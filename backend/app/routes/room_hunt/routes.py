# routes/ai/room_hunter_route.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from bson import ObjectId

from db.mongo import get_profiles_collection, get_housing_collection, get_users_collection
from utils.jwt_utils import get_user_from_cookie
from routes.users.users_response_schemas import UserResponse
from agents.room_hunter_agent import room_hunter_agent

router = APIRouter(prefix="/ai", tags=["Housing"])


@router.get("/housing_listings")
def get_housing_listings_route() -> List[Dict[str, Any]]:
    try:
        housing_collection = get_housing_collection()
        listings = list(housing_collection.find())
        
        # Convert ObjectIds to strings
        json_listings = []
        for listing in listings:
            listing["id"] = str(listing["_id"])
            del listing["_id"]
            json_listings.append(listing)
            
        return json_listings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching listings: {e}")


@router.post("/top_housing_matches")
def top_housing_matches_route(
    profile_a: Dict[str, Any],
    profile_b: Dict[str, Any],
    current_user: UserResponse = Depends(get_user_from_cookie),
    top_n: int = 10
) -> List[Dict[str, Any]]:
    if not room_hunter_agent:
        raise HTTPException(status_code=500, detail="RoomHunterAgent not initialized.")

    try:
        # Fetch full profiles if IDs are passed
        profiles_collection = get_profiles_collection()
        for profile in [profile_a, profile_b]:
            if "id" in profile and not all(k in profile for k in ["city", "area", "budget_PKR"]):
                db_profile = profiles_collection.find_one({"_id": ObjectId(profile["id"])})
                if not db_profile:
                    raise HTTPException(status_code=404, detail=f"Profile {profile['id']} not found")
                profile.update({
                    "city": db_profile.get("city"),
                    "area": db_profile.get("area"),
                    "budget_PKR": db_profile.get("budget_PKR"),
                    "sleep_schedule": db_profile.get("sleep_schedule"),
                    "cleanliness": db_profile.get("cleanliness"),
                    "noise_tolerance": db_profile.get("noise_tolerance"),
                    "study_habits": db_profile.get("study_habits"),
                    "food_pref": db_profile.get("food_pref"),
                    "id": str(db_profile["_id"])  # ensure JSON-serializable
                })

        matches = room_hunter_agent.get_top_housing_matches([profile_a, profile_b], top_n=top_n)

        # Convert all ObjectIds to strings in the response
        json_matches = []
        for m in matches:
            match_dict = m.dict() if hasattr(m, "dict") else dict(m)
            if "_id" in match_dict:
                match_dict["_id"] = str(match_dict["_id"])
            json_matches.append(match_dict)

        return json_matches

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error computing housing matches: {e}")

@router.get("/recommended_housing")
def recommended_housing_route(
    current_user: UserResponse = Depends(get_user_from_cookie),
    top_n: int = 10
) -> List[Dict[str, Any]]:
    """
    Get top N recommended housing listings for the logged-in user.
    """
    if not room_hunter_agent:
        raise HTTPException(status_code=500, detail="RoomHunterAgent not initialized.")

    users_collection = get_users_collection()
    profiles_collection = get_profiles_collection()

    try:
        user_doc = users_collection.find_one({"_id": ObjectId(current_user.id)})
        if not user_doc or "profile_id" not in user_doc:
            raise HTTPException(status_code=404, detail="User profile not found. Please create a profile first.")
        
        profile_doc = profiles_collection.find_one({"_id": ObjectId(user_doc["profile_id"])})
        if not profile_doc:
            raise HTTPException(status_code=404, detail="Profile document not found.")

        user_profile = {
            "id": str(profile_doc["_id"]),
            "city": profile_doc.get("city"),
            "area": profile_doc.get("area"),
            "budget_PKR": profile_doc.get("budget_PKR"),
            "sleep_schedule": profile_doc.get("sleep_schedule"),
            "cleanliness": profile_doc.get("cleanliness"),
            "noise_tolerance": profile_doc.get("noise_tolerance"),
            "study_habits": profile_doc.get("study_habits"),
            "food_pref": profile_doc.get("food_pref")
        }

        matches = room_hunter_agent.get_top_housing_matches([user_profile], top_n=top_n)

        # Convert all ObjectIds to strings in the response
        json_matches = []
        for m in matches:
            match_dict = m.dict() if hasattr(m, "dict") else dict(m)
            # Ensure id is present and stringified
            if "_id" in match_dict:
                match_dict["id"] = str(match_dict["_id"])
                del match_dict["_id"]
            json_matches.append(match_dict)

        return json_matches

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error computing housing matches: {e}")

@router.post("/wishlist/{listing_id}")
def toggle_wishlist_route(
    listing_id: str,
    current_user: UserResponse = Depends(get_user_from_cookie)
):
    try:
        from db.mongo import get_wishlist_collection
        wishlist_col = get_wishlist_collection()
        
        query = {"user_id": current_user.id, "listing_id": listing_id}
        existing = wishlist_col.find_one(query)
        
        if existing:
            wishlist_col.delete_one(query)
            return {"status": "removed"}
        else:
            wishlist_col.insert_one(query)
            return {"status": "added"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Wishlist error: {e}")

@router.get("/wishlist")
def get_wishlist_route(
    current_user: UserResponse = Depends(get_user_from_cookie)
) -> List[Dict[str, Any]]:
    try:
        from db.mongo import get_wishlist_collection, get_housing_collection
        wishlist_col = get_wishlist_collection()
        housing_col = get_housing_collection()
        
        # Find all wishlisted IDs for this user
        wish_docs = list(wishlist_col.find({"user_id": current_user.id}))
        listing_ids = [ObjectId(doc["listing_id"]) for doc in wish_docs if ObjectId.is_valid(doc["listing_id"])]
        
        if not listing_ids:
            return []
            
        listings = list(housing_col.find({"_id": {"$in": listing_ids}}))
        
        json_listings = []
        for listing in listings:
            listing["id"] = str(listing["_id"])
            del listing["_id"]
            json_listings.append(listing)
            
        return json_listings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching wishlist: {e}")
