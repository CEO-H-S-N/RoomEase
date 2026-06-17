from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List, Optional
from bson import ObjectId
from db.mongo import get_users_collection, get_profiles_collection, db
from utils.jwt_utils import get_user_from_cookie
from routes.users.users_response_schemas import UserResponse
from datetime import datetime
import os
import shutil
import uuid

router = APIRouter(tags=["Verification"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Helper to save uploaded file
def save_upload_file(upload_file: UploadFile, user_id: str, doc_type: str) -> str:
    # ensure directory exists
    user_dir = os.path.join(UPLOAD_DIR, user_id)
    os.makedirs(user_dir, exist_ok=True)
    
    # generate a unique filename
    ext = upload_file.filename.split('.')[-1] if '.' in upload_file.filename else 'png'
    filename = f"{doc_type}_{uuid.uuid4().hex[:8]}.{ext}"
    file_path = os.path.join(user_dir, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
        
    return f"/{file_path.replace(chr(92), '/')}" # replace backslash for web url

@router.post("/api/verification/submit")
async def submit_verification(
    cnic_front: UploadFile = File(...),
    cnic_back: UploadFile = File(...),
    proof_of_address: UploadFile = File(...),
    student_id: Optional[UploadFile] = File(None),
    current_user: UserResponse = Depends(get_user_from_cookie)
):
    users_col = get_users_collection()
    user_id = str(current_user.id)
    
    # Save files
    documents = {
        "cnic_front": save_upload_file(cnic_front, user_id, "cnic_front"),
        "cnic_back": save_upload_file(cnic_back, user_id, "cnic_back"),
        "proof_of_address": save_upload_file(proof_of_address, user_id, "proof"),
    }
    if student_id:
        documents["student_id"] = save_upload_file(student_id, user_id, "student_id")
        
    # Update user record
    users_col.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "document_verification_status": "pending",
            "verification_documents": documents,
            "verification_submitted_at": datetime.utcnow()
        }}
    )
    
    return {"message": "Verification documents submitted successfully"}

@router.get("/api/verification/status")
def get_verification_status(current_user: UserResponse = Depends(get_user_from_cookie)):
    """Get the current user's verification status."""
    users_col = get_users_collection()
    user = users_col.find_one({"_id": ObjectId(current_user.id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    status = user.get("document_verification_status", "none")
    return {"status": status}

@router.get("/api/admin/verifications")
def get_pending_verifications(current_user: UserResponse = Depends(get_user_from_cookie)):
    if not getattr(current_user, 'is_admin', False):
        raise HTTPException(status_code=403, detail="Admin access required")
        
    users_col = get_users_collection()
    profiles_col = get_profiles_collection()
    
    pending_users = list(users_col.find({"document_verification_status": "pending"}))
    
    results = []
    for user in pending_users:
        # Fetch profile for name and avatar if exists
        profile = None
        if user.get("profile_id"):
            profile = profiles_col.find_one({"_id": ObjectId(user["profile_id"])})
            
        name = profile.get("full_name", profile.get("name", "Unknown")) if profile else user.get("username", "Unknown")
        avatar = profile.get("profile_photo", profile.get("profile_pic")) if profile else None
        if not avatar:
            avatar = f"https://ui-avatars.com/api/?name={name}&background=random"
        
        docs = user.get("verification_documents", {})
        doc_count = len(docs)
        
        time_diff = datetime.utcnow() - user.get("verification_submitted_at", datetime.utcnow())
        hours = int(time_diff.total_seconds() / 3600)
        time_str = f"Submitted {hours} hours ago" if hours > 0 else "Submitted recently"
        
        results.append({
            "id": str(user["_id"]),
            "name": name,
            "email": user.get("email"),
            "avatar": avatar,
            "type": "ID Verification",
            "docCount": doc_count,
            "time": time_str,
            "documents": docs
        })
        
    return results

@router.post("/api/admin/verifications/{user_id}/approve")
def approve_verification(user_id: str, current_user: UserResponse = Depends(get_user_from_cookie)):
    if not getattr(current_user, 'is_admin', False):
        raise HTTPException(status_code=403, detail="Admin access required")
        
    users_col = get_users_collection()
    profiles_col = get_profiles_collection()
    
    result = users_col.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"document_verification_status": "approved", "verified": True}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or status already updated")
    
    # Also mark the profile as verified
    user = users_col.find_one({"_id": ObjectId(user_id)})
    if user and user.get("profile_id"):
        try:
            profiles_col.update_one(
                {"_id": ObjectId(user["profile_id"])},
                {"$set": {"verified": True}}
            )
        except Exception:
            pass
        
    return {"message": "Verification approved"}

@router.post("/api/admin/verifications/{user_id}/reject")
def reject_verification(user_id: str, current_user: UserResponse = Depends(get_user_from_cookie)):
    if not getattr(current_user, 'is_admin', False):
        raise HTTPException(status_code=403, detail="Admin access required")
        
    users_col = get_users_collection()
    result = users_col.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"document_verification_status": "rejected"}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or status already updated")
        
    return {"message": "Verification rejected"}

@router.get("/api/admin/users")
def get_admin_users(current_user: UserResponse = Depends(get_user_from_cookie)):
    """Get all users with their profile info for admin management."""
    if not getattr(current_user, 'is_admin', False):
        raise HTTPException(status_code=403, detail="Admin access required")

    users_col = get_users_collection()
    profiles_col = get_profiles_collection()

    all_users = list(users_col.find())
    results = []

    for user in all_users:
        # Fetch linked profile if exists
        profile = None
        if user.get("profile_id"):
            try:
                profile = profiles_col.find_one({"_id": ObjectId(user["profile_id"])})
            except Exception:
                pass

        full_name = None
        avatar = None
        city = None
        area = None
        occupation = None
        age = None

        if profile:
            full_name = profile.get("full_name") or profile.get("name")
            avatar = profile.get("profile_photo") or profile.get("profile_pic")
            city = profile.get("city")
            area = profile.get("area")
            occupation = profile.get("occupation")
            age = profile.get("age")

        if not full_name:
            full_name = user.get("username", "Unknown")

        if not avatar:
            avatar = f"https://ui-avatars.com/api/?name={full_name}&background=random"

        # Determine status
        doc_status = user.get("document_verification_status", "none")
        if doc_status == "approved" or user.get("verified"):
            status = "Active"
        elif doc_status == "pending":
            status = "Pending"
        elif doc_status == "rejected":
            status = "Suspended"
        else:
            status = "Active"  # default for users who haven't submitted docs

        # Determine role
        role = "Admin" if user.get("is_admin") else "User"

        # Joined date from ObjectId timestamp
        try:
            joined = ObjectId(str(user["_id"])).generation_time.strftime("%Y-%m-%d")
        except Exception:
            joined = "N/A"

        results.append({
            "id": str(user["_id"]),
            "name": full_name,
            "email": user.get("email", "N/A"),
            "avatar": avatar,
            "status": status,
            "role": role,
            "joined": joined,
            "verified": user.get("is_verified", False) or user.get("verified", False),
            "city": city,
            "area": area,
            "occupation": occupation,
            "age": age,
            "has_profile": bool(user.get("profile_id")),
        })

    return results


@router.get("/api/admin/listings")
def get_admin_listings(current_user: UserResponse = Depends(get_user_from_cookie)):
    """Get all housing listings for admin management."""
    if not getattr(current_user, 'is_admin', False):
        raise HTTPException(status_code=403, detail="Admin access required")

    housing_col = db["housing"]
    listings = list(housing_col.find())

    results = []
    for listing in listings:
        # Joined/created date from ObjectId timestamp
        try:
            created = ObjectId(str(listing["_id"])).generation_time.strftime("%Y-%m-%d")
        except Exception:
            created = "N/A"

        results.append({
            "id": str(listing["_id"]),
            "city": listing.get("city", "N/A"),
            "area": listing.get("area", "N/A"),
            "monthly_rent_PKR": listing.get("monthly_rent_PKR", 0),
            "rooms_available": listing.get("rooms_available", 0),
            "availability": listing.get("availability", "Unknown"),
            "amenities": listing.get("amenities", []),
            "thumbnail": listing.get("thumbnail"),
            "rating": listing.get("rating"),
            "created": created,
        })

    return results


@router.delete("/api/admin/users/{user_id}")
def admin_delete_user(user_id: str, current_user: UserResponse = Depends(get_user_from_cookie)):
    """Admin: delete a user and their profile."""
    if not getattr(current_user, 'is_admin', False):
        raise HTTPException(status_code=403, detail="Admin access required")

    users_col = get_users_collection()
    profiles_col = get_profiles_collection()

    try:
        obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    user = users_col.find_one({"_id": obj_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete linked profile if exists
    if user.get("profile_id"):
        try:
            profiles_col.delete_one({"_id": ObjectId(user["profile_id"])})
        except Exception:
            pass

    users_col.delete_one({"_id": obj_id})
    return {"message": "User deleted successfully"}


@router.delete("/api/admin/listings/{listing_id}")
def admin_delete_listing(listing_id: str, current_user: UserResponse = Depends(get_user_from_cookie)):
    """Admin: delete a housing listing."""
    if not getattr(current_user, 'is_admin', False):
        raise HTTPException(status_code=403, detail="Admin access required")

    housing_col = db["housing"]

    try:
        obj_id = ObjectId(listing_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid listing ID")

    result = housing_col.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Listing not found")

    return {"message": "Listing deleted successfully"}


@router.get("/api/admin/analytics")
def get_admin_analytics(current_user: UserResponse = Depends(get_user_from_cookie)):
    if not getattr(current_user, 'is_admin', False):
        raise HTTPException(status_code=403, detail="Admin access required")
        
    users_col = get_users_collection()
    housing_col = db["housing"] # Direct access or use helper
    likes_col = db["user_likes"]
    
    # 1. Base Stats
    total_users = users_col.count_documents({})
    active_listings = housing_col.count_documents({"availability": "Available"})
    verified_users = users_col.count_documents({"verified": True})
    total_matches = likes_col.count_documents({})
    
    # 2. User Growth (Last 6 months)
    user_growth_agg = users_col.aggregate([
        {
            "$project": {
                "date": {"$ifNull": ["$created_at", {"$toDate": "$_id"}]}
            }
        },
        {
            "$project": {
                "month": {"$month": "$date"},
                "year": {"$year": "$date"}
            }
        },
        {
            "$group": {
                "_id": {"month": "$month", "year": "$year"},
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id.year": 1, "_id.month": 1}},
        {"$limit": 6}
    ])
    
    # 3. Listing Activity (Last 6 months)
    listing_activity_agg = housing_col.aggregate([
        {
            "$project": {
                "date": {"$ifNull": ["$created_at", {"$toDate": "$_id"}]}
            }
        },
        {
            "$project": {
                "month": {"$month": "$date"},
                "year": {"$year": "$date"}
            }
        },
        {
            "$group": {
                "_id": {"month": "$month", "year": "$year"},
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id.year": 1, "_id.month": 1}},
        {"$limit": 6}
    ])
    
    # Format growth data
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    user_growth_data = []
    for item in user_growth_agg:
        m_idx = item["_id"]["month"] - 1
        user_growth_data.append({
            "label": months[m_idx],
            "value": item["count"]
        })
        
    listing_growth_data = []
    for item in listing_activity_agg:
        m_idx = item["_id"]["month"] - 1
        listing_growth_data.append({
            "label": months[m_idx],
            "value": item["count"]
        })
        
    # If collections are empty, provide at least something
    if not user_growth_data:
        user_growth_data = [{"label": "May", "value": total_users}]
    if not listing_growth_data:
        listing_growth_data = [{"label": "May", "value": active_listings}]
        
    return {
        "stats": {
            "totalUsers": total_users,
            "activeListings": active_listings,
            "verifiedUsers": verified_users,
            "totalMatches": total_matches
        },
        "userGrowth": user_growth_data,
        "listingActivity": listing_growth_data
    }
