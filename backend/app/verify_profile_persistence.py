import sys
import os
import json
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()
sys.path.append(os.getcwd())

from db.mongo import get_profiles_collection, get_users_collection

def verify_persistence():
    print("💾 Verifying Profile Persistence...")
    
    users_coll = get_users_collection()
    profiles_coll = get_profiles_collection()
    
    # 1. Get User
    target_username = "Hassan Tariq"
    user = users_coll.find_one({"username": target_username})
    
    if not user:
        print(f"❌ User '{target_username}' not found.")
        return

    profile_id = user.get("profile_id")
    if not profile_id:
        print("❌ User has no profile_id linked!")
        return
        
    print(f"✅ User '{target_username}' linked to Profile ID: {profile_id}")
    
    # 2. Get Original Profile
    original_profile = profiles_coll.find_one({"_id": ObjectId(profile_id)})
    if not original_profile:
        print("❌ Profile document not found!")
        return
        
    original_budget = original_profile.get("budget_PKR")
    print(f"📉 Current Budget: {original_budget}")
    
    # 3. Modify Profile (Simulate Edit Profile Page)
    new_budget = original_budget + 5000
    print(f"✏️  Updating budget to: {new_budget}...")
    
    update_data = {
        "budget_PKR": new_budget,
        "raw_profile_text": f"Updated via verification script at {os.times()[4]}"
    }
    
    # Simulate the backend update operation
    profiles_coll.update_one(
        {"_id": ObjectId(profile_id)},
        {"$set": update_data}
    )
    
    # 4. Read Back to Verify
    updated_profile = profiles_coll.find_one({"_id": ObjectId(profile_id)})
    
    print("\n--- Verification Results ---")
    if updated_profile.get("budget_PKR") == new_budget:
        print(f"✅ Success! Budget updated to {updated_profile.get('budget_PKR')} in DB.")
    else:
        print(f"❌ Fail! Budget is {updated_profile.get('budget_PKR')}, expected {new_budget}.")
        
    if updated_profile.get("raw_profile_text") == update_data["raw_profile_text"]:
         print(f"✅ Success! Bio updated in DB.")
    else:
         print(f"❌ Fail! Bio not updated.")

    # 5. Revert (Optional, but good manners)
    print("\n↺ Reverting changes...")
    profiles_coll.update_one(
        {"_id": ObjectId(profile_id)},
        {"$set": {"budget_PKR": original_budget, "raw_profile_text": original_profile.get("raw_profile_text")}}
    )
    print("✅ Reverted to original state.")

if __name__ == "__main__":
    verify_persistence()
