import sys
import os
import json
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()
sys.path.append(os.getcwd())

from db.mongo import get_profiles_collection, get_users_collection
from agents.agent_pipeline import match_pipeline

def verify_live_matching():
    print("🧪 Verifying Live Matching Logic...")
    
    users_coll = get_users_collection()
    profiles_coll = get_profiles_collection()
    
    # 1. Get User (Hassan)
    target_username = "Hassan Tariq"
    user = users_coll.find_one({"username": target_username})
    if not user: return
    
    user_profile_id = user.get("profile_id")
    user_profile_doc = profiles_coll.find_one({"_id": ObjectId(user_profile_id)})
    
    # 2. Get a Candidate (Ali Khan)
    candidate_name = "Ali Khan"
    candidate_doc = profiles_coll.find_one({"full_name": candidate_name})
    if not candidate_doc:
        print(f"❌ Candidate {candidate_name} not found")
        return

    candidate_budget = candidate_doc.get("budget_PKR", 30000)
    print(f"🎯 Candidate {candidate_name} Budget: {candidate_budget}")

    # Helper to run pipeline
    def run_score(budget_val):
        # Update User in DB
        profiles_coll.update_one(
            {"_id": ObjectId(user_profile_id)},
            {"$set": {"budget_PKR": budget_val}}
        )
        
        # Re-fetch as the route would
        fresh_user_doc = profiles_coll.find_one({"_id": ObjectId(user_profile_id)})
        
        user_profile_struct = {
            "id": str(fresh_user_doc["_id"]),
            "raw_profile_text": fresh_user_doc.get("raw_profile_text", ""),
            "city": fresh_user_doc.get("city", ""),
            "area": fresh_user_doc.get("area", ""),
            "budget_PKR": fresh_user_doc.get("budget_PKR", 0),
            "sleep_schedule": fresh_user_doc.get("sleep_schedule"),
            "cleanliness": fresh_user_doc.get("cleanliness"),
            "noise_tolerance": fresh_user_doc.get("noise_tolerance"),
            "study_habits": fresh_user_doc.get("study_habits"),
            "food_pref": fresh_user_doc.get("food_pref"),
            "age": fresh_user_doc.get("age"),
            "occupation": fresh_user_doc.get("occupation"),
            "full_name": fresh_user_doc.get("full_name"),
            "profile_photo": fresh_user_doc.get("profile_photo")
        }
        
        cand_struct = {
             "id": str(candidate_doc["_id"]),
             "budget_PKR": candidate_doc.get("budget_PKR", 0),
             "city": candidate_doc.get("city", ""),
             "full_name": candidate_doc.get("full_name", ""),
             # minimal needed for scoring
             "sleep_schedule": candidate_doc.get("sleep_schedule"),
             "cleanliness": candidate_doc.get("cleanliness"),
             "noise_tolerance": candidate_doc.get("noise_tolerance"),
             "study_habits": candidate_doc.get("study_habits"),
             "food_pref": candidate_doc.get("food_pref"),
        }

        # Run pipeline
        result = match_pipeline.run_pipeline(user_profile_struct, cand_struct)
        return result["final_score"], result["score_reasons"]

    # Test 1: MATCHING Budget
    print(f"\n--- Test 1: Setting User Budget to {candidate_budget} (Match) ---")
    score_1, reasons_1 = run_score(candidate_budget)
    print(f"Score: {score_1}")
    print(f"Reasons: {reasons_1}")

    # Test 2: MISMATCHING Budget
    mismatch_budget = candidate_budget + 100000 
    print(f"\n--- Test 2: Setting User Budget to {mismatch_budget} (Mismatch) ---")
    score_2, reasons_2 = run_score(mismatch_budget)
    print(f"Score: {score_2}")
    print(f"Reasons: {reasons_2}")

    # Verification
    if score_1 > score_2:
        print("\n✅ PASSED: Matching budget yielded higher score.")
    else:
        print("\n❌ FAILED: Scores did not reflect budget change.")

    # Revert
    print("\n↺ Reverting User Budget...")
    profiles_coll.update_one(
        {"_id": ObjectId(user_profile_id)},
        {"$set": {"budget_PKR": user_profile_doc.get("budget_PKR")}}
    )
    print("✅ Reverted.")

if __name__ == "__main__":
    verify_live_matching()
