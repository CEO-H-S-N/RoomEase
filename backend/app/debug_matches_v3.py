import sys
import os
import json
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()
sys.path.append(os.getcwd())

from db.mongo import get_profiles_collection, get_users_collection
from agents.agent_pipeline import match_pipeline

def debug_matches():
    print("🔍 Starting Match Debugger v3...")
    
    users_coll = get_users_collection()
    profiles_coll = get_profiles_collection()
    
    # 1. Get User
    target_username = "Hassan Tariq"
    user = users_coll.find_one({"username": target_username})
    
    if not user:
        print(f"❌ User '{target_username}' not found.")
        return

    print(f"✅ User found: {user['_id']}")
    
    # 2. Get Profile
    profile_id = user.get("profile_id")
    if not profile_id:
        print("❌ User has no profile_id!")
        return
        
    user_profile_doc = profiles_coll.find_one({"_id": ObjectId(profile_id)})
    if not user_profile_doc:
        print(f"❌ Profile document {profile_id} not found!")
        return
        
    print(f"✅ User Profile found: {user_profile_doc.get('full_name')} ({profile_id})")
    print(f"   City: {user_profile_doc.get('city')}")
    
    # 3. Transform to dict expectation
    user_profile = {
        "id": str(user_profile_doc["_id"]),
        "raw_profile_text": user_profile_doc.get("raw_profile_text", ""),
        "city": user_profile_doc.get("city", ""),
        "area": user_profile_doc.get("area", ""),
        "budget_PKR": user_profile_doc.get("budget_PKR", 0),
        "sleep_schedule": user_profile_doc.get("sleep_schedule"),
        "cleanliness": user_profile_doc.get("cleanliness"),
        "noise_tolerance": user_profile_doc.get("noise_tolerance"),
        "study_habits": user_profile_doc.get("study_habits"),
        "food_pref": user_profile_doc.get("food_pref"),
        "age": user_profile_doc.get("age"),
        "occupation": user_profile_doc.get("occupation"),
        "full_name": user_profile_doc.get("full_name"),
    }
    
    # 4. Check Candidates count manually first
    candidate_query = {"city": {"$regex": f"^{user_profile['city']}$", "$options": "i"}}
    candidates_count = profiles_coll.count_documents(candidate_query)
    print(f"📊 Found {candidates_count} potential candidates in {user_profile['city']} (including self)")
    
    # 5. Run Pipeline
    print("🚀 Running match_pipeline.get_best_matches...")
    try:
        matches = match_pipeline.get_best_matches(user_profile, top_n=5)
        print(f"✅ Pipeline returned {len(matches)} matches.")
        
        for i, m in enumerate(matches):
            print(f"\nMatch #{i+1}: {m['profile']['full_name']}")
            print(f"   Score: {m['final_score']}")
            print(f"   Explanation: {m.get('explanation')[:100]}...")
            
    except Exception as e:
        print(f"❌ Pipeline Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_matches()
