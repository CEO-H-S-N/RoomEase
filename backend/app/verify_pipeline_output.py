# verify_pipeline_output.py
import sys
import os
import json
from dotenv import load_dotenv

load_dotenv()
sys.path.append(os.getcwd())

from agents.agent_pipeline import match_pipeline

def verify_pipeline():
    print("🔬 Verifying Agent Pipeline Output with Hardcoded Data...")

    # 1. Define Dummy User
    user_profile = {
        "id": "dummy_user_123",
        "full_name": "Hassan Tariq",
        "age": 22,
        "occupation": "Student",
        "city": "Lahore",
        "area": "DHA",
        "budget_PKR": 35000,
        "sleep_schedule": "Night owl",
        "cleanliness": "Average",
        "noise_tolerance": "Moderate",
        "study_habits": "Late-night study",
        "food_pref": "Non-veg",
        "raw_profile_text": "I like gaming and coding late at night.",
        "profile_photo": "http://example.com/hassan.jpg"
    }

    # 2. Define Dummy Candidate
    candidate_profile = {
        "id": "dummy_candidate_456",
        "full_name": "Ali Khan",
        "age": 21,
        "occupation": "Software Engineer",
        "city": "Lahore",
        "area": "DHA",
        "budget_PKR": 30000,
        "sleep_schedule": "Night owl",
        "cleanliness": "Messy",
        "noise_tolerance": "Loud ok",
        "study_habits": "Late-night study",
        "food_pref": "Non-veg",
        "raw_profile_text": "I code late into the night. Looking for someone chill.",
        "profile_photo": "http://example.com/ali.jpg"
    }

    print("\n--- Input Profiles ---")
    print(f"User: {user_profile['full_name']}")
    print(f"Candidate: {candidate_profile['full_name']}")

    # 3. Run Pipeline
    print("\n🚀 Running pipeline...")
    try:
        result = match_pipeline.run_pipeline(user_profile, candidate_profile)
        
        # Add profile to simulate get_best_matches behavior
        result["profile"] = candidate_profile

        print("\n✅ Pipeline Execution Successful!")
        print("\n--- Output JSON (Formatted) ---")
        print(json.dumps(result, indent=4))
        
        # 4. specialized checks
        print("\n--- Integrity Checks ---")
        if result.get("final_score") is None:
            print("❌ 'final_score' is missing or None")
        else:
            print(f"✅ 'final_score': {result['final_score']}")

        if not result.get("explanation"):
            print("❌ 'explanation' is missing or empty")
        else:
            print(f"✅ 'explanation' length: {len(result['explanation'])}")

        if not result.get("profile"):
            print("❌ 'profile' object missing")
        else:
            print("✅ 'profile' object present")

    except Exception as e:
        print(f"\n❌ Pipeline Failed with Exception: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    verify_pipeline()
