import sys
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()
sys.path.append(os.getcwd())

from db.mongo import get_profiles_collection, get_users_collection

def aggressive_fix():
    print("🔧 Starting Aggressive Profile Fix...")
    
    users_coll = get_users_collection()
    profiles_coll = get_profiles_collection()
    
    target_username = "Hassan Tariq"
    user = users_coll.find_one({"username": target_username})
    
    if not user:
        print(f"❌ User '{target_username}' not found.")
        return

    # 1. Unset existing profile_id to clear bad state
    users_coll.update_one(
        {"_id": user["_id"]},
        {"$unset": {"profile_id": ""}}
    )
    print("🧹 Cleared existing profile_id")
    
    # 2. Create NEW profile
    new_profile = {
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
    
    result = profiles_coll.insert_one(new_profile)
    new_profile_id = str(result.inserted_id)
    print(f"✅ Created fresh profile: {new_profile_id}")
    
    # 3. Link Profile
    users_coll.update_one(
        {"_id": user["_id"]},
        {"$set": {"profile_id": new_profile_id}}
    )
    print(f"🔗 Linked User -> Profile {new_profile_id}")
    
    # 4. Verify immediately
    updated_user = users_coll.find_one({"_id": user["_id"]})
    print(f"👀 Verification Check: User profile_id is now: {updated_user.get('profile_id')}")
    
    if updated_user.get('profile_id') == new_profile_id:
        print("🎉 SUCCESS: Link confirmed!")
    else:
        print("❌ ERROR: Link failed verification!")

if __name__ == "__main__":
    aggressive_fix()
