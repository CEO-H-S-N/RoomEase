import os
import sys

# Add the current directory to sys.path to allow imports from local modules
sys.path.append(os.getcwd())

from agents.agent_pipeline import match_pipeline
from db.mongo import get_profiles_collection
from bson import ObjectId

def debug():
    print("Testing MatchPipeline...")
    
    profiles_collection = get_profiles_collection()
    all_profiles = list(profiles_collection.find())
    
    if len(all_profiles) < 2:
        print("Not enough profiles in DB to test matching.")
        return

    seeker = all_profiles[0]
    seeker_id = str(seeker["_id"])
    
    user_profile = {
        "id": seeker_id,
        "raw_profile_text": seeker.get("raw_profile_text", ""),
        "city": seeker.get("city", ""),
        "area": seeker.get("area", ""),
        "budget_PKR": seeker.get("budget_PKR", 0),
        "sleep_schedule": seeker.get("sleep_schedule"),
        "cleanliness": seeker.get("cleanliness"),
        "noise_tolerance": seeker.get("noise_tolerance"),
        "study_habits": seeker.get("study_habits"),
        "food_pref": seeker.get("food_pref"),
        "age": seeker.get("age"),
        "occupation": seeker.get("occupation"),
        "full_name": seeker.get("full_name"),
    }

    try:
        print(f"Running pipeline for user: {user_profile['full_name']} ({seeker_id})")
        results = match_pipeline.get_best_matches(user_profile, top_n=5)
        print(f"Successfully found {len(results)} matches.")
        for i, res in enumerate(results):
            print(f"Match {i+1}: {res['profile']['full_name']} - Score: {res['final_score']}")
            print(f"  Explanation: {res['explanation']}")
    except Exception as e:
        print(f"PIPELINE ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug()
