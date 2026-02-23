import os
from dotenv import load_dotenv
from pymongo import MongoClient
import time

load_dotenv()

def test_mongo():
    uri = os.getenv("MONGO_URI")
    print(f"Testing MongoDB connection to: {uri[:30]}...")
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("✅ MongoDB connection SUCCESSFUL")
        db_name = os.getenv("DB_NAME", "Flat-Waley")
        db = client[db_name]
        count = db["profiles"].count_documents({})
        print(f"✅ Found {count} profiles in DB.")
    except Exception as e:
        print(f"❌ MongoDB connection FAILED: {e}")

def test_groq():
    key = os.getenv("GROQ_API_KEY")
    if not key:
        print("❌ No GROQ_API_KEY found in environment.")
    else:
        print(f"✅ GROQ_API_KEY found: {key[:10]}...")

if __name__ == "__main__":
    test_mongo()
    test_groq()
