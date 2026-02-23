import sys
import os
import time
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()
sys.path.append(os.getcwd())

from db.mongo import get_profiles_collection, get_users_collection
from agents.agent_pipeline import match_pipeline

def debug_v2():
    print("🚀 Starting Debug Matches V2...")
    
    # 1. Find a valid user with a profile
    users_coll = get_users_collection()
    profiles_coll = get_profiles_collection()
    
    # Find a user who has a profile_id
    user = users_coll.find_one({"profile_id": {"$exists": True, "$ne": "", "$ne": None}})
    
    if not user:
        print("❌ No user with a profile_id found in DB.")
        return

    print(f"👤 Testing with User: {user.get('username')} (ID: {user['_id']})")
    
    profile_id = user["profile_id"]
    print(f"📄 Profile ID: {repr(profile_id)} (Length: {len(str(profile_id))})")
    
    try:
        pid_obj = ObjectId(profile_id)
    except Exception as e:
        print(f"❌ INVALID PROFILE ID: {e}")
        return

    profile = profiles_coll.find_one({"_id": pid_obj})
    if not profile:
        print("❌ Profile document not found!")
        return
        
    print(f"✅ Profile found: {profile.get('full_name')} in {profile.get('city')}")
    
    # Construct user_profile dict as route does
    user_profile = {
        "id": str(profile["_id"]),
        "raw_profile_text": profile.get("raw_profile_text", ""),
        "city": profile.get("city", ""),
        "area": profile.get("area", ""),
        "budget_PKR": profile.get("budget_PKR", 0),
        "sleep_schedule": profile.get("sleep_schedule"),
        "cleanliness": profile.get("cleanliness"),
        "noise_tolerance": profile.get("noise_tolerance"),
        "study_habits": profile.get("study_habits"),
        "food_pref": profile.get("food_pref"),
        "age": profile.get("age"),
        "occupation": profile.get("occupation"),
        "full_name": profile.get("full_name"),
    }
    
    print("\n⏳ Starting Pipeline Execution...")
    start_time = time.time()
    
    try:
        results = match_pipeline.get_best_matches(user_profile, top_n=5)
        end_time = time.time()
        duration = end_time - start_time
        
        print(f"\n✅ Pipeline Finished in {duration:.2f} seconds")
        print(f"📊 Matches Found: {len(results)}")
        
        for i, res in enumerate(results):
            print(f"  [{i+1}] {res['profile']['full_name']} - Score: {res['final_score']}")
            
    except Exception as e:
        print(f"\n❌ Pipeline Crashed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_v2()
