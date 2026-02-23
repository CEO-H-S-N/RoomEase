import sys
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()
sys.path.append(os.getcwd())

from db.mongo import get_profiles_collection, get_users_collection

def check_status():
    users_coll = get_users_collection()
    profiles_coll = get_profiles_collection()
    
    target_username = "Hassan Tariq"
    user = users_coll.find_one({"username": target_username})
    
    if not user:
        print(f"❌ User '{target_username}' not found.")
        return

    print(f"User found: {user.get('username')} (ID: {user.get('_id')})")
    
    profile_id = user.get("profile_id")
    print(f"Linked Profile ID: {profile_id}")
    
    if not profile_id:
        print("❌ WARNING: No profile_id linked to user!")
    else:
        try:
            profile = profiles_coll.find_one({"_id": ObjectId(profile_id)})
            if profile:
                print(f"✅ Linked Profile found: {profile.get('full_name')}")
            else:
                print(f"❌ Profile ID exists but document not found in profiles collection!")
        except Exception as e:
            print(f"❌ Error looking up profile ID: {e}")

    # Check for candidates
    all_profiles_count = profiles_coll.count_documents({})
    print(f"Total Profiles in DB: {all_profiles_count}")
    
    if all_profiles_count < 2:
        print("❌ Not enough profiles for matching (needs > 1)")
    else:
        print("✅ Sufficient candidate profiles exist.")

if __name__ == "__main__":
    check_status()
