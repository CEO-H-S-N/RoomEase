import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DB_NAME", "Flat-Waley")]

user = db.users.find_one({"email": "asd@asd.com"})
print(f"User is_admin: {user.get('is_admin')}")
