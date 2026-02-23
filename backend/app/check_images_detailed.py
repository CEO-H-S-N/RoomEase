import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["Flat-Waley"]
housing_collection = db["users"]

# Fetch all listings that have housing data
listings = list(housing_collection.find({
    "listing_id": {"$exists": True}
}, {
    "listing_id": 1,
    "city": 1,
    "area": 1,
    "thumbnail": 1,
    "images": 1
}))

print(f"\n{'='*80}")
print(f"HOUSING LISTINGS IMAGE CHECK")
print(f"{'='*80}")
print(f"Total Listings Found: {len(listings)}\n")

# Collect all unique URLs
thumbnails = {}
all_images = {}

for idx, listing in enumerate(listings, 1):
    listing_id = listing.get("listing_id", "N/A")
    thumbnail = listing.get("thumbnail", None)
    images = listing.get("images", [])
    
    # Track thumbnails
    if thumbnail:
        if thumbnail not in thumbnails:
            thumbnails[thumbnail] = []
        thumbnails[thumbnail].append(listing_id)
    
    # Track images
    for img in images:
        if img not in all_images:
            all_images[img] = []
        all_images[img].append(listing_id)

# Display results
print(f"{'='*80}")
print(f"THUMBNAIL ANALYSIS:")
print(f"{'='*80}")
print(f"Total unique thumbnails: {len(thumbnails)}\n")

if len(thumbnails) == 1:
    print("⚠️  WARNING: All listings have the SAME thumbnail!")
    for url, listing_ids in thumbnails.items():
        print(f"\nURL: {url}")
        print(f"Used by {len(listing_ids)} listings")
else:
    print("✅ Listings have different thumbnails")
    for url, listing_ids in list(thumbnails.items())[:5]:  # Show first 5
        print(f"\nURL: {url[:80]}...")
        print(f"Used by: {', '.join(listing_ids[:3])}{'...' if len(listing_ids) > 3 else ''}")

print(f"\n{'='*80}")
print(f"IMAGES ANALYSIS:")
print(f"{'='*80}")
print(f"Total unique image URLs: {len(all_images)}\n")

if len(all_images) == 1:
    print("⚠️  WARNING: All listings have the SAME images!")
    for url, listing_ids in all_images.items():
        print(f"\nURL: {url}")
        print(f"Used by {len(listing_ids)} listings")
elif len(all_images) <= 10:
    print("⚠️  WARNING: Very few unique images!")
    for url, listing_ids in all_images.items():
        print(f"\nURL: {url[:80]}...")
        print(f"Used by: {', '.join(listing_ids[:3])}{'...' if len(listing_ids) > 3 else ''}")
else:
    print("✅ Listings have diverse images")

# Show sample of first 5 listings
print(f"\n{'='*80}")
print(f"SAMPLE LISTINGS (First 5):")
print(f"{'='*80}\n")

for idx, listing in enumerate(listings[:5], 1):
    listing_id = listing.get("listing_id", "N/A")
    city = listing.get("city", "N/A")
    area = listing.get("area", "N/A")
    thumbnail = listing.get("thumbnail", "None")
    images = listing.get("images", [])
    
    print(f"Listing {idx}: {listing_id}")
    print(f"  Location: {city}, {area}")
    print(f"  Thumbnail: {thumbnail[:80] if thumbnail != 'None' else 'None'}...")
    if images:
        print(f"  Images ({len(images)}):")
        for img in images[:2]:  # Show first 2 images
            print(f"    - {img[:80]}...")
    else:
        print(f"  Images: None")
    print()

print(f"{'='*80}\n")

client.close()
