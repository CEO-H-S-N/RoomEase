import sys
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()
sys.path.append(os.getcwd())

from db.mongo import get_profiles_collection, get_users_collection

def create_dummy():
    users_coll = get_users_collection()
    profiles_coll = get_profiles_collection()
    
    target_username = "Hassan Tariq"
    user = users_coll.find_one({"username": target_username})
    
    if not user:
        print(f"❌ User '{target_username}' not found.")
        return

    print(f"Creating profile for: {user['username']}")
    
    dummy_profile = {
        "full_name": target_username,
        "age": 22,
        "occupation": "Student",
        "city": "Lahore",
        "area": "DHA",
        "budget_PKR": 25000,
        "sleep_schedule": "Night owl",
        "cleanliness": "Average",
        "noise_tolerance": "Moderate",
        "study_habits": "Late-night study",
        "food_pref": "Non-veg",
        "raw_profile_text": "I am a student looking for a room.",
        "profile_photo": ""
    }
    
    result = profiles_coll.insert_one(dummy_profile)
    new_profile_id = str(result.inserted_id)
    
    print(f"✅ Created Profile: {new_profile_id}")
    
    users_coll.update_one(
        {"_id": user["_id"]},
        {"$set": {"profile_id": new_profile_id}}
    )
    
    print(f"🚀 Linked User to Profile!")

if __name__ == "__main__":
    create_dummy()
