from pymongo import MongoClient
import gridfs
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "Flat-Waley")

# Create global client
# Added tlsAllowInvalidCertificates=True to handle potential SSL handshake errors in dev environments
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000, tlsAllowInvalidCertificates=True)
except Exception as e:
    print(f"Global MongoClient init failed: {e}")
    client = None

# Database reference
if client:
    db = client[DB_NAME]
    # GridFS for file uploads (optional)
    fs = gridfs.GridFS(db)
else:
    db = None
    fs = None


# ----- Collection helpers -----
def get_users_collection():
    if db is None:
        raise Exception("Database connection failed")
    return db["users"]

def get_user_likes_collection():
    if db is None:
        raise Exception("Database connection failed")
    return db["user_likes"]

def get_housing_collection():
    if db is None:
        raise Exception("Database connection failed")
    return db["housing"]

def get_profiles_collection():
    if db is None:
        raise Exception("Database connection failed")
    return db["profiles"]

def check_connection():
    """Check if MongoDB connection works"""
    if not client:
        return False
    try:
        client.admin.command("ping")
        return True
    except Exception as e:
        print("❌ MongoDB connection failed:", e)
        return False