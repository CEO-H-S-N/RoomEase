# routes/ai/room_hunter_route.py
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from bson import ObjectId

from db.mongo import get_profiles_collection, get_housing_collection
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


@router.get("/best_housing_matches")
def best_housing_matches_route(
    current_user: UserResponse = Depends(get_user_from_cookie),
    top_n: int = 10
) -> List[Dict[str, Any]]:
    """
    Get top N housing matches for the currently logged-in user.
    """
    if not room_hunter_agent:
        raise HTTPException(status_code=500, detail="RoomHunterAgent not initialized.")

    try:
        profiles_collection = get_profiles_collection()
        users_collection = get_users_collection()

        # 1. Find user's profile
        user_doc = users_collection.find_one({"_id": ObjectId(current_user.id)})
        if not user_doc or not user_doc.get("profile_id"):
            raise HTTPException(status_code=404, detail="User profile not found. Please create a profile first.")

        profile_doc = profiles_collection.find_one({"_id": ObjectId(user_doc["profile_id"])})
        if not profile_doc:
            raise HTTPException(status_code=404, detail="Profile document not found.")

        # 2. Extract profile data
        user_profile = {
            "id": str(profile_doc["_id"]),
            "city": profile_doc.get("city"),
            "area": profile_doc.get("area"),
            "budget_PKR": profile_doc.get("budget_PKR"),
            "sleep_schedule": profile_doc.get("sleep_schedule"),
            "cleanliness": profile_doc.get("cleanliness"),
            "noise_tolerance": profile_doc.get("noise_tolerance"),
            "study_habits": profile_doc.get("study_habits"),
            "food_pref": profile_doc.get("food_pref"),
        }

        # 3. Get matches
        matches = room_hunter_agent.get_top_housing_matches([user_profile], top_n=top_n)

        # 4. JSON-ify
        json_matches = []
        for m in matches:
            match_dict = m.dict() if hasattr(m, "dict") else dict(m)
            # MongoDB IDs and other cleanup if needed
            if "_id" in match_dict:
                match_dict["id"] = str(match_dict["_id"])
                del match_dict["_id"]
            elif "id" not in match_dict:
                # Fallback id if missing
                match_dict["id"] = "H" + str(hash(match_dict.get("short_reason", "")))[:6]
                
            json_matches.append(match_dict)

        return json_matches

    except Exception as e:
        print(f"Error in housing match: {e}")
        raise HTTPException(status_code=500, detail=str(e))
