import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
print(f"Testing connection to: {MONGO_URI.split('@')[1] if '@' in MONGO_URI else 'LOCALHOST'}")

try:
    client = MongoClient(MONGO_URI)
    client.admin.command('ping')
    print("✅ MongoDB Connection Successful!")
    
    # List databases
    dbs = client.list_database_names()
    print(f"\nAvailable Databases: {dbs}")
    
    # List collections in current DB (from .env or default)
    target_db_name = os.getenv("DB_NAME", "Flat-Waley")
    print(f"\nChecking target database: '{target_db_name}'")
    
    if target_db_name in dbs:
        db = client[target_db_name]
        collections = db.list_collection_names()
        print(f"Collections in '{target_db_name}': {collections}")
        
        # Check count in 'housing' collection
        if "housing" in collections:
            count = db["housing"].count_documents({})
            print(f"Documents in 'housing' collection: {count}")
        else:
            print(f"❌ Collection 'housing' not found in '{target_db_name}'")
    else:
        print(f"❌ Database '{target_db_name}' not found in cluster.")
        
except Exception as e:
    print(f"❌ MongoDB Connection Failed: {e}")
