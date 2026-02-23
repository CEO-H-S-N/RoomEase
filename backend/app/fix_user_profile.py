import sys
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()
sys.path.append(os.getcwd())

from db.mongo import get_profiles_collection, get_users_collection

def fix_hassan_profile():
    users_coll = get_users_collection()
    profiles_coll = get_profiles_collection()
    
    target_username = "Hassan Tariq"
    user = users_coll.find_one({"username": target_username})
    
    if not user:
        print(f"❌ User '{target_username}' not found.")
        return

    print(f"Fixing profile for: {user['username']}")
    
    # Check if a profile with this name already exists to avoid dupes, but since the ID link is broken, 
    # we might want to just make a fresh one and link it.
    
    # Create a fresh profile for Hassan
    hassan_profile = {
        "full_name": target_username,
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
        "raw_profile_text": "I am a student looking for a room. I like coding and gaming.",
        "profile_photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"
    }
    
    result = profiles_coll.insert_one(hassan_profile)
    new_profile_id = str(result.inserted_id)
    
    print(f"✅ Created New Profile for Hassan: {new_profile_id}")
    
    # Link it
    users_coll.update_one(
        {"_id": user["_id"]},
        {"$set": {"profile_id": new_profile_id}}
    )
    
    print(f"🚀 Successfully linked User '{target_username}' to new Profile ID: {new_profile_id}")

if __name__ == "__main__":
    fix_hassan_profile()
