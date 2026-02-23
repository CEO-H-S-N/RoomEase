import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "Flat-Waley")

print(f"Connecting to {DB_NAME} at {MONGO_URI.split('@')[1] if '@' in MONGO_URI else '...'}...")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
housing_collection = db["housing"]

sample_listings = [
    {
        "city": "Islamabad",
        "area": "F-10 Markaz",
        "monthly_rent_PKR": 36000,
        "rooms_available": 1,
        "amenities": ["WiFi", "Security guard", "Attach Bath"],
        "availability": "Available",
        "latitude": 33.6938,
        "longitude": 73.0652
    },
    {
        "city": "Islamabad",
        "area": "G-11 Markaz",
        "monthly_rent_PKR": 14000,
        "rooms_available": 3,
        "amenities": ["WiFi", "Shared Kitchen", "Near Metro"],
        "availability": "Available",
        "latitude": 33.6685,
        "longitude": 73.0187
    },
    {
        "city": "Islamabad",
        "area": "E-11",
        "monthly_rent_PKR": 24000,
        "rooms_available": 2,
        "amenities": ["Parking", "Lift", "Backup Generator"],
        "availability": "Available",
        "latitude": 33.7050,
        "longitude": 72.9774
    }
]

# Clear existing to avoid duplicates if run multiple times
housing_collection.delete_many({})
result = housing_collection.insert_many(sample_listings)
print(f"✅ Inserted {len(result.inserted_ids)} sample listings into 'housing' collection.")
