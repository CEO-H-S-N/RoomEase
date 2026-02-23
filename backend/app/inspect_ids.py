import sys
import os
from dotenv import load_dotenv
from bson import ObjectId
from pymongo import MongoClient

load_dotenv()
sys.path.append(os.getcwd())

from db.mongo import get_profiles_collection, get_users_collection

def inspect():
    print("🔍 Inspecting IDs...")
    users = list(get_users_collection().find())
    profiles = list(get_profiles_collection().find())
    
    print(f"Total Users: {len(users)}")
    print(f"Total Profiles: {len(profiles)}")
    
    print("\n--- Checking Users for Bad Profile IDs ---")
    bad_users = 0
    for u in users:
        pid = u.get("profile_id")
        if pid:
            try:
                ObjectId(pid)
            except Exception:
                print(f"❌ User '{u.get('username')}' ({u['_id']}) has INVALID profile_id: '{pid}'")
                bad_users += 1
    
    if bad_users == 0:
        print("✅ All user profile_ids are valid ObjectIds.")
        
    print("\n--- Checking Profiles for Bad _ids ---")
    bad_profiles = 0
    for p in profiles:
        try:
            ObjectId(str(p["_id"]))
        except Exception:
             print(f"❌ Profile '{p.get('full_name')}' has INVALID _id: '{p['_id']}'")
             bad_profiles += 1
             
    if bad_profiles == 0:
        print("✅ All profile _ids are valid.")

if __name__ == "__main__":
    inspect()
