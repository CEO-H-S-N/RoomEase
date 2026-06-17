from fastapi import APIRouter, Depends, HTTPException
from utils.jwt_utils import get_user_from_cookie
from db.mongo import get_profiles_collection, get_users_collection
from bson import ObjectId
from agents.agent_pipeline import match_pipeline
from .match_response_schemas import RichMatchResult
from routes.profiles.profiles_response_schemas import ProfileResponse
from routes.users.users_response_schemas import UserResponse
from typing import List
import asyncio
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
import time

router = APIRouter(prefix="/ai", tags=["Match"])

# Thread pool for running blocking pipeline calls without blocking the event loop
_executor = ThreadPoolExecutor(max_workers=4)

def _run_pipeline_sync(user_profile: dict, top_n: int) -> list:
    """Runs the blocking pipeline in a thread."""
    return match_pipeline.get_best_matches(user_profile, top_n=top_n)

@router.get("/best_matches", response_model=List[RichMatchResult])
async def best_matches_route(
    current_user: UserResponse = Depends(get_user_from_cookie),
    top_n: int = 5
):
    """
    Get top N best matching roommate profiles for the logged-in user using the 4-agent pipeline.
    Runs asynchronously so it never blocks the server.
    """
    if not match_pipeline:
        raise HTTPException(status_code=503, detail="Match pipeline not initialized")

    users_collection = get_users_collection()
    profiles_collection = get_profiles_collection()

    # Fetch user document
    try:
        user_doc = users_collection.find_one({"_id": ObjectId(current_user.id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    profile_id = user_doc.get("profile_id")
    if not profile_id:
        raise HTTPException(status_code=404, detail="No profile assigned to this user. Please complete your profile first.")

    # Fetch user's profile
    try:
        profile_doc = profiles_collection.find_one({"_id": ObjectId(profile_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid profile ID in user document")

    if not profile_doc:
        raise HTTPException(status_code=404, detail="User profile not found")

    user_profile = {
        "id": str(profile_doc["_id"]),
        "raw_profile_text": profile_doc.get("raw_profile_text", ""),
        "city": profile_doc.get("city", ""),
        "area": profile_doc.get("area", ""),
        "budget_PKR": profile_doc.get("budget_PKR", 0),
        "sleep_schedule": profile_doc.get("sleep_schedule"),
        "cleanliness": profile_doc.get("cleanliness"),
        "noise_tolerance": profile_doc.get("noise_tolerance"),
        "study_habits": profile_doc.get("study_habits"),
        "food_pref": profile_doc.get("food_pref"),
        "age": profile_doc.get("age"),
        "occupation": profile_doc.get("occupation"),
        "full_name": profile_doc.get("full_name"),
    }

    # Run the blocking pipeline in a thread pool with a 60s timeout
    loop = asyncio.get_event_loop()
    start = time.time()
    try:
        results = await asyncio.wait_for(
            loop.run_in_executor(_executor, _run_pipeline_sync, user_profile, top_n),
            timeout=60.0
        )
        elapsed = time.time() - start
        print(f"[INFO] Pipeline completed in {elapsed:.1f}s, returned {len(results)} matches")
        return results
    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=504,
            detail="Match pipeline timed out (>60s). The AI agents are busy - please try again in a moment."
        )
    except Exception as e:
        print(f"[ERROR] Match pipeline error: {e}")
        raise HTTPException(status_code=500, detail=f"Match pipeline error: {e}")
