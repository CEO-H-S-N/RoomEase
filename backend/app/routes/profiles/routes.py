from fastapi import APIRouter, HTTPException, Path, Depends, Body
from models.profile import ProfileCreate
from routes.profiles.profiles_response_schemas import ProfileResponse
from db.mongo import get_profiles_collection, get_users_collection
from bson import ObjectId
from typing import List
from utils.jwt_utils import get_user_from_cookie
from routes.users.users_response_schemas import UserResponse

router = APIRouter(prefix="/profiles", tags=["Profiles"])


@router.get("/locations")
def get_locations():
    profiles_collection = get_profiles_collection()
    pipeline = [
        {
            "$group": {
                "_id": "$city",
                "areas": {"$addToSet": "$area"}
            }
        },
        {
            "$project": {
                "_id": 0,
                "city": "$_id",
                "areas": 1
            }
        }
    ]
    results = list(profiles_collection.aggregate(pipeline))
    # Transform to easier frontend format: { "Lahore": ["DHA", "Gulberg"], "Karachi": [...] }
    locations = {item["city"]: sorted(item["areas"]) for item in results if item["city"]}
    return locations

# --- Create Profile ---
@router.post("/", response_model=ProfileResponse)
def create_profile(
    request: ProfileCreate,
    current_user: UserResponse = Depends(get_user_from_cookie)
):
    profiles_collection = get_profiles_collection()
    users_collection = get_users_collection()

    # Check if user already has a profile
    user_doc = users_collection.find_one({"_id": ObjectId(current_user.id)})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    if user_doc.get("profile_id"):
        raise HTTPException(status_code=400, detail="User already has a profile")

    # Insert the new profile
    result = profiles_collection.insert_one(request.dict())
    db_profile = profiles_collection.find_one({"_id": result.inserted_id})

    # Update the user's profile_id in the users collection
    update_result = users_collection.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {"profile_id": str(result.inserted_id)}}
    )
    if update_result.matched_count == 0:
        # Rollback: delete the profile if user update fails
        profiles_collection.delete_one({"_id": result.inserted_id})
        raise HTTPException(status_code=500, detail="Failed to assign profile to user")

    # Return the created profile
    return ProfileResponse(
        id=str(db_profile["_id"]),
        raw_profile_text=db_profile["raw_profile_text"],
        city=db_profile["city"],
        area=db_profile["area"],
        budget_PKR=db_profile["budget_PKR"],
        sleep_schedule=db_profile.get("sleep_schedule"),
        cleanliness=db_profile.get("cleanliness"),
        noise_tolerance=db_profile.get("noise_tolerance"),
        study_habits=db_profile.get("study_habits"),
        food_pref=db_profile.get("food_pref"),
        age=db_profile.get("age"),
        occupation=db_profile.get("occupation"),
        full_name=db_profile.get("full_name"),
        profile_photo=db_profile.get("profile_photo"),
        rating=db_profile.get("rating", 0.0),
        verified=db_profile.get("verified", False),
        reviews=db_profile.get("reviews", []),
    )


# --- Get All Profiles ---
@router.get("/", response_model=List[ProfileResponse])
def get_profiles(current_user: UserResponse = Depends(get_user_from_cookie)):
    profiles_collection = get_profiles_collection()
    users_collection = get_users_collection()
    
    profiles = list(profiles_collection.find())
    
    # Fetch all users who have a profile_id
    users_with_profile = list(users_collection.find({"profile_id": {"$exists": True, "$ne": ""}}))
    
    # Create a map: profile_id -> user_document
    # profile_id in users collection is a string (Line 59 in create_profile)
    profile_user_map = {u["profile_id"]: u for u in users_with_profile}

    result = []
    for profile in profiles:
        pid = str(profile["_id"])
        
        # Try to find the user associated with this profile
        related_user = profile_user_map.get(pid)
        
        # Resolve fields with fallbacks
        # 1. Profile document (Priority) - check 'name' and 'profile_pic' as per DB schema
        # 2. User document (Fallback)
        
        # Mapping DB fields to Response fields
        db_name = profile.get("name") or profile.get("full_name")
        db_pic = profile.get("profile_pic") or profile.get("profile_photo")

        full_name = db_name
        if not full_name and related_user:
            full_name = related_user.get("username")
            
        profile_photo = db_pic
        # If we had photo in users, we would fetch it here. assuming we don't for now unless user matches.
        
        # Ensure rating/verified are present (from DB update)
        rating = profile.get("rating", 0.0)
        verified = profile.get("verified", False)
        # Also check user verification status if profile verification is false
        if not verified and related_user:
            verified = related_user.get("is_verified", False)

        result.append(
             ProfileResponse(
                id=pid,
                raw_profile_text=profile["raw_profile_text"],
                city=profile["city"],
                area=profile["area"],
                budget_PKR=profile["budget_PKR"],
                sleep_schedule=profile.get("sleep_schedule"),
                cleanliness=profile.get("cleanliness"),
                noise_tolerance=profile.get("noise_tolerance"),
                study_habits=profile.get("study_habits"),
                food_pref=profile.get("food_pref"),
                age=profile.get("age"),
                occupation=profile.get("occupation"),
                full_name=full_name,
                profile_photo=profile_photo,
                rating=rating,
                verified=verified,
                reviews=profile.get("reviews", []),
                past_stays=profile.get("past_stays", []),
            )
        )
        
    return result


# --- Get Profile by ID ---
@router.get("/{profile_id}", response_model=ProfileResponse)
def get_profile(profile_id: str = Path(..., description="Profile ID"), current_user: UserResponse = Depends(get_user_from_cookie)):
    profiles_collection = get_profiles_collection()
    try:
        obj_id = ObjectId(profile_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid profile ID format")

    profile = profiles_collection.find_one({"_id": obj_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Fetch associated user for fallback data
    users_collection = get_users_collection()
    related_user = users_collection.find_one({"profile_id": str(profile["_id"])})

    # Resolve fields with fallbacks (Same logic as get_profiles)
    db_name = profile.get("name") or profile.get("full_name")
    db_pic = profile.get("profile_pic") or profile.get("profile_photo")

    full_name = db_name
    if not full_name and related_user:
        full_name = related_user.get("username")

    profile_photo = db_pic
    # In future: if not profile_photo and related_user: profile_photo = related_user.get("photo")

    rating = profile.get("rating", 0.0)
    verified = profile.get("verified", False)
    if not verified and related_user:
        verified = related_user.get("is_verified", False)

    return ProfileResponse(
        id=str(profile["_id"]),
        raw_profile_text=profile["raw_profile_text"],
        city=profile["city"],
        area=profile["area"],
        budget_PKR=profile["budget_PKR"],
        sleep_schedule=profile.get("sleep_schedule"),
        cleanliness=profile.get("cleanliness"),
        noise_tolerance=profile.get("noise_tolerance"),
        study_habits=profile.get("study_habits"),
        food_pref=profile.get("food_pref"),
        age=profile.get("age"),
        occupation=profile.get("occupation"),
        full_name=full_name,
        profile_photo=profile_photo,
        rating=rating,
        verified=verified,
        reviews=profile.get("reviews", []),
        past_stays=profile.get("past_stays", []),
    )


# --- Delete Profile ---
@router.delete("/{profile_id}")
def delete_profile(profile_id: str = Path(..., description="Profile ID"), current_user: UserResponse = Depends(get_user_from_cookie)):
    profiles_collection = get_profiles_collection()
    try:
        obj_id = ObjectId(profile_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid profile ID format")

    result = profiles_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"detail": "Profile deleted successfully"}


# --- Update Profile ---
@router.patch("/{profile_id}")
def update_profile(profile_id: str, update: dict, current_user: UserResponse = Depends(get_user_from_cookie)):
    profiles_collection = get_profiles_collection()
    try:
        obj_id = ObjectId(profile_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid profile ID format")

    if not update:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = profiles_collection.update_one({"_id": obj_id}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {"detail": "Profile updated successfully"}