import os
from dotenv import load_dotenv
from pymongo import MongoClient
import requests

load_dotenv()
uri = os.getenv("MONGO_URI")
client = MongoClient(uri, serverSelectionTimeoutMS=8000, tlsAllowInvalidCertificates=True)
db = client[os.getenv("DB_NAME", "Flat-Waley")]
users = db["users"]

count = users.count_documents({})
print(f"Total users: {count}")
for u in users.find({}, {"email": 1, "username": 1, "is_verified": 1, "password": 1}).limit(5):
    has_pw = bool(u.get("password", ""))
    print(f"  username={u.get('username')} | email={u.get('email')} | verified={u.get('is_verified')} | has_password={has_pw}")

# Test login endpoint
print("\n--- Testing /users/login endpoint ---")
url = "http://localhost:8000/users/login"
payload = {"email": "test@test.com", "password": "test123"}
try:
    r = requests.post(url, json=payload, timeout=5)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text[:200]}")
except Exception as e:
    print(f"Request failed: {e}")
