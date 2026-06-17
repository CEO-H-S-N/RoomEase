from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient
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

# Async Client for Motor
try:
    async_client = AsyncIOMotorClient(MONGO_URI)
    async_db = async_client[DB_NAME]
except Exception as e:
    print(f"Async MongoClient init failed: {e}")
    async_db = None

def get_database():
    return async_db


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

def get_wishlist_collection():
    if db is None:
        raise Exception("Database connection failed")
    return db["wishlist"]

def check_connection():
    """Check if MongoDB connection works"""
    if not client:
        return False
    try:
        client.admin.command("ping")
        return True
    except Exception as e:
        print("[ERROR] MongoDB connection failed:", e)
        return False

def get_stay_history_collection():
    if db is None:
        raise Exception("Database connection failed")
    return db["stay_history"]

def get_ratings_collection():
    if db is None:
        raise Exception("Database connection failed")
    return db["ratings"]