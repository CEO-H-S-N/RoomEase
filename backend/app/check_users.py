import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "Flat-Waley")

print(f"Connecting to {DB_NAME}...")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_collection = db["users"]

# Find all users
users = list(users_collection.find())

print(f"\n✅ Found {len(users)} user(s) in the database:\n")

for user in users:
    print(f"Username: {user.get('username')}")
    print(f"Email: {user.get('email')}")
    print(f"Password (hashed): {user.get('password')[:20]}..." if user.get('password') else "No password")
    print(f"Verified: {user.get('is_verified', False)}")
    print(f"ID: {user.get('_id')}")
    print("-" * 50)
