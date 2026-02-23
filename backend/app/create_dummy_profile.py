import sys
import os
import random
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()
sys.path.append(os.getcwd())

from db.mongo import get_profiles_collection, get_users_collection

def create_dummy_profiles():
    profiles_coll = get_profiles_collection()
    
    # diverse set of profiles
    dummy_data = [
        {
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
            "profile_photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
        },
        {
            "full_name": "Sara Ahmed",
            "age": 23,
            "occupation": "Medical Student",
            "city": "Lahore",
            "area": "Model Town",
            "budget_PKR": 25000,
            "sleep_schedule": "Early riser",
            "cleanliness": "Tidy",
            "noise_tolerance": "Quiet",
            "study_habits": "Library",
            "food_pref": "Veg",
            "raw_profile_text": "Med student, need quiet environment for studies.",
            "profile_photo": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
        },
        {
            "full_name": "Bilal Sheikh",
            "age": 24,
            "occupation": "Marketing",
            "city": "Lahore",
            "area": "Gulberg",
            "budget_PKR": 40000,
            "sleep_schedule": "Flexible",
            "cleanliness": "Average",
            "noise_tolerance": "Moderate",
            "study_habits": "Room study",
            "food_pref": "Non-veg",
            "raw_profile_text": "Easy going, love to cook on weekends.",
            "profile_photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
        },
        {
            "full_name": "Raza Ali",
            "age": 20,
            "occupation": "Student",
            "city": "Lahore",
            "area": "Johar Town",
            "budget_PKR": 15000,
            "sleep_schedule": "Night owl",
            "cleanliness": "Messy",
            "noise_tolerance": "Loud ok",
            "study_habits": "Online classes",
            "food_pref": "Flexible",
            "raw_profile_text": "Gamer, usually up late. Need cheap rent.",
            "profile_photo": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop"
        },
        {
            "full_name": "Zainab Malik",
            "age": 25,
            "occupation": "Designer",
            "city": "Lahore",
            "area": "DHA",
            "budget_PKR": 50000,
            "sleep_schedule": "Early riser",
            "cleanliness": "Tidy",
            "noise_tolerance": "Quiet",
            "study_habits": "Room study",
            "food_pref": "Veg",
            "raw_profile_text": "Designer working from home completely. Need clean space.",
            "profile_photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop"
        }
    ]

    print(f"Creating {len(dummy_data)} diverse profiles...")
    
    for data in dummy_data:
        # Check if already exists to avoid dupes on re-run
        if profiles_coll.find_one({"full_name": data["full_name"]}):
            print(f"Skipping {data['full_name']} (already exists)")
            continue
            
        result = profiles_coll.insert_one(data)
        print(f"✅ Created Profile: {data['full_name']} ({result.inserted_id})")

    print("🚀 Dummy data population complete!")

if __name__ == "__main__":
    create_dummy_profiles()
