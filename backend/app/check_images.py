import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["RoomEase"]
housing_collection = db["housing_listings"]

# Fetch all listings
listings = list(housing_collection.find({}, {
    "listing_id": 1,
    "city": 1,
    "area": 1,
    "thumbnail": 1,
    "images": 1
}))

print(f"\n{'='*80}")
print(f"Total Listings: {len(listings)}")
print(f"{'='*80}\n")

# Check for unique thumbnails
thumbnails = set()
images_list = []

for idx, listing in enumerate(listings, 1):
    listing_id = listing.get("listing_id", "N/A")
    city = listing.get("city", "N/A")
    area = listing.get("area", "N/A")
    thumbnail = listing.get("thumbnail", "N/A")
    images = listing.get("images", [])
    
    print(f"Listing {idx}: {listing_id}")
    print(f"  Location: {city}, {area}")
    print(f"  Thumbnail: {thumbnail}")
    if images:
        print(f"  Images ({len(images)}):")
        for img in images:
            print(f"    - {img}")
            images_list.append(img)
    else:
        print(f"  Images: None")
    print()
    
    if thumbnail != "N/A":
        thumbnails.add(thumbnail)

print(f"\n{'='*80}")
print(f"SUMMARY:")
print(f"{'='*80}")
print(f"Total listings: {len(listings)}")
print(f"Unique thumbnails: {len(thumbnails)}")
print(f"Unique images: {len(set(images_list))}")
print(f"\nAre all thumbnails the same? {'YES' if len(thumbnails) == 1 else 'NO'}")
print(f"Are all images the same? {'YES' if len(set(images_list)) == 1 else 'NO'}")
print(f"{'='*80}\n")

client.close()
