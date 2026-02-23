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

output = []
output.append("="*80)
output.append("HOUSING LISTINGS IMAGE CHECK")
output.append("="*80)
output.append(f"Total Listings Found: {len(listings)}")
output.append("")

# Collect all unique URLs
thumbnails = {}
all_images = {}

for listing in listings:
    listing_id = listing.get("listing_id", "N/A")
    thumbnail = listing.get("thumbnail", None)
    images = listing.get("images", [])
    
    if thumbnail:
        if thumbnail not in thumbnails:
            thumbnails[thumbnail] = []
        thumbnails[thumbnail].append(listing_id)
    
    for img in images:
        if img not in all_images:
            all_images[img] = []
        all_images[img].append(listing_id)

# Display results
output.append("="*80)
output.append("THUMBNAIL ANALYSIS:")
output.append("="*80)
output.append(f"Total unique thumbnails: {len(thumbnails)}")
output.append("")

if len(thumbnails) == 1:
    output.append("WARNING: All listings have the SAME thumbnail!")
    for url, listing_ids in thumbnails.items():
        output.append(f"\nURL: {url}")
        output.append(f"Used by {len(listing_ids)} listings: {', '.join(listing_ids[:10])}")
elif len(thumbnails) == 0:
    output.append("No thumbnails found in any listing")
else:
    output.append(f"Good: Listings have {len(thumbnails)} different thumbnails")
    for idx, (url, listing_ids) in enumerate(list(thumbnails.items())[:5], 1):
        output.append(f"\n{idx}. {url}")
        output.append(f"   Used by: {', '.join(listing_ids[:5])}")

output.append("")
output.append("="*80)
output.append("IMAGES ANALYSIS:")
output.append("="*80)
output.append(f"Total unique image URLs: {len(all_images)}")
output.append("")

if len(all_images) == 1:
    output.append("WARNING: All listings have the SAME images!")
elif len(all_images) == 0:
    output.append("No images found in any listing")
elif len(all_images) <= 10:
    output.append(f"WARNING: Only {len(all_images)} unique images for {len(listings)} listings")
else:
    output.append(f"Good: Listings have {len(all_images)} different images")

# Show sample of first 10 listings
output.append("")
output.append("="*80)
output.append("SAMPLE LISTINGS (First 10):")
output.append("="*80)
output.append("")

for idx, listing in enumerate(listings[:10], 1):
    listing_id = listing.get("listing_id", "N/A")
    city = listing.get("city", "N/A")
    area = listing.get("area", "N/A")
    thumbnail = listing.get("thumbnail", "None")
    images = listing.get("images", [])
    
    output.append(f"Listing {idx}: {listing_id} ({city}, {area})")
    output.append(f"  Thumbnail: {thumbnail}")
    if images:
        output.append(f"  Images ({len(images)}):")
        for img in images:
            output.append(f"    - {img}")
    else:
        output.append(f"  Images: None")
    output.append("")

output.append("="*80)

# Write to file
with open("image_check_results.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(output))

print("Results written to image_check_results.txt")
print(f"\nQuick Summary:")
print(f"  Total listings: {len(listings)}")
print(f"  Unique thumbnails: {len(thumbnails)}")
print(f"  Unique images: {len(all_images)}")
print(f"  Same thumbnails? {'YES - ALL SAME!' if len(thumbnails) == 1 else 'NO - Different'}")

client.close()
