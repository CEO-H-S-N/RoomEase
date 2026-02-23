import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

# List all databases
print("\n" + "="*80)
print("Available Databases:")
print("="*80)
for db_name in client.list_database_names():
    print(f"  - {db_name}")

# Check both possible database names
for db_name in ["RoomEase", "Flat-Waley"]:
    print(f"\n{'='*80}")
    print(f"Collections in '{db_name}' database:")
    print("="*80)
    try:
        db = client[db_name]
        collections = db.list_collection_names()
        if collections:
            for coll in collections:
                count = db[coll].count_documents({})
                print(f"  - {coll}: {count} documents")
        else:
            print("  (No collections found)")
    except Exception as e:
        print(f"  Error: {e}")

# Try to find housing listings in any collection
print(f"\n{'='*80}")
print("Searching for housing listings...")
print("="*80)

for db_name in ["RoomEase", "Flat-Waley"]:
    db = client[db_name]
    for coll_name in db.list_collection_names():
        coll = db[coll_name]
        # Check if this collection has housing-like documents
        sample = coll.find_one()
        if sample and any(key in sample for key in ["listing_id", "monthly_rent_PKR", "rooms_available"]):
            print(f"\nFound housing data in: {db_name}.{coll_name}")
            count = coll.count_documents({})
            print(f"Total documents: {count}")
            
            # Show first 3 listings with image info
            listings = list(coll.find({}, {
                "listing_id": 1,
                "city": 1,
                "area": 1,
                "thumbnail": 1,
                "images": 1
            }).limit(3))
            
            for idx, listing in enumerate(listings, 1):
                print(f"\nSample {idx}:")
                print(f"  ID: {listing.get('listing_id', 'N/A')}")
                print(f"  Location: {listing.get('city', 'N/A')}, {listing.get('area', 'N/A')}")
                print(f"  Thumbnail: {listing.get('thumbnail', 'N/A')}")
                print(f"  Images: {listing.get('images', 'N/A')}")

client.close()
