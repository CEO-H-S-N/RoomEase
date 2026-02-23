import sys
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()
sys.path.append(os.getcwd())

from db.mongo import get_profiles_collection, get_users_collection

def fix_link():
    users_coll = get_users_collection()
    profiles_coll = get_profiles_collection()
    
    # 1. Target the specific user with empty profile_id
    target_username = "Hassan Tariq" # Based on debug output
    user = users_coll.find_one({"username": target_username})
    
    if not user:
        print(f"❌ User '{target_username}' not found.")
        return

    print(f"User Found: {user['username']} (Profile ID: '{user.get('profile_id')}')")
    
    # 2. Look for an orphaned profile with this name
    profile = profiles_coll.find_one({"full_name": target_username})
    
    if not profile:
        print(f"❌ No profile found with full_name '{target_username}'")
        # Try searching by user ID if stored in profile? (Not standardized)
        return

    print(f"✅ Found Orphaned Profile: {profile['_id']} (Name: {profile.get('full_name')})")
    
    # 3. Link them
    users_coll.update_one(
        {"_id": user["_id"]},
        {"$set": {"profile_id": str(profile["_id"])}}
    )
    
    print(f"🚀 SUCCESS: Linked User '{user['username']}' to Profile '{profile['_id']}'")

if __name__ == "__main__":
    fix_link()
