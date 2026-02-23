from db.mongo import get_users_collection, get_profiles_collection
from bson import ObjectId

def check_and_fix_broken_profiles():
    users_coll = get_users_collection()
    profiles_coll = get_profiles_collection()
    
    # diverse users with profile_id set
    users = list(users_coll.find({'profile_id': {'$ne': ''}}))
    print(f"Checking {len(users)} users with profiles...")
    
    broken_count = 0
    for user in users:
        pid = user.get('profile_id')
        if not pid: continue
            
        try:
            profile = profiles_coll.find_one({'_id': ObjectId(pid)})
            if not profile:
                print(f"❌ BROKEN LINK: User {user.get('username')} [{user['_id']}] -> Profile {pid} NOT FOUND")
                
                # Fix it
                users_coll.update_one(
                    {'_id': user['_id']},
                    {'$set': {'profile_id': ''}}  # Reset to empty string
                )
                print(f"   ✅ FIXED: Reset profile_id to empty string for user {user.get('username')}")
                broken_count += 1
            else:
                print(f"✅ User {user.get('username')} -> Profile {pid} OK")
        except Exception as e:
            print(f"⚠️ Error checking user {user.get('username')}: {e}")
            
    if broken_count == 0:
        print("\n✨ No broken profile links found.")
    else:
        print(f"\n🔧 Fixed {broken_count} broken profile links.")

if __name__ == "__main__":
    check_and_fix_broken_profiles()
