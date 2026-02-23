import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to MongoDB - CORRECTED: Using Flat-Waley.housing
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["Flat-Waley"]
housing_collection = db["housing"]

# Fetch all listings
listings = list(housing_collection.find({}, {
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
output.append(f"Database: Flat-Waley")
output.append(f"Collection: housing")
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
    output.append("⚠️  WARNING: All listings have the SAME thumbnail!")
    for url, listing_ids in thumbnails.items():
        output.append(f"\nURL: {url}")
        output.append(f"Used by ALL {len(listing_ids)} listings")
        output.append(f"Listing IDs: {', '.join(listing_ids[:20])}")
elif len(thumbnails) == 0:
    output.append("❌ No thumbnails found in any listing")
else:
    output.append(f"✅ Good: Listings have {len(thumbnails)} different thumbnails")
    for idx, (url, listing_ids) in enumerate(list(thumbnails.items())[:5], 1):
        output.append(f"\n{idx}. {url}")
        output.append(f"   Used by {len(listing_ids)} listing(s): {', '.join(listing_ids[:5])}")

output.append("")
output.append("="*80)
output.append("IMAGES ANALYSIS:")
output.append("="*80)
output.append(f"Total unique image URLs: {len(all_images)}")
output.append("")

if len(all_images) == 1:
    output.append("⚠️  WARNING: All listings have the SAME images!")
    for url, listing_ids in all_images.items():
        output.append(f"\nURL: {url}")
        output.append(f"Used by ALL {len(listing_ids)} listings")
elif len(all_images) == 0:
    output.append("❌ No images found in any listing")
elif len(all_images) <= 10:
    output.append(f"⚠️  WARNING: Only {len(all_images)} unique images for {len(listings)} listings")
    for idx, (url, listing_ids) in enumerate(all_images.items(), 1):
        output.append(f"\n{idx}. {url}")
        output.append(f"   Used by {len(listing_ids)} listing(s)")
else:
    output.append(f"✅ Good: Listings have {len(all_images)} different images")

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

# Print summary
print("\n" + "="*80)
print("QUICK SUMMARY")
print("="*80)
print(f"Total listings: {len(listings)}")
print(f"Unique thumbnails: {len(thumbnails)}")
print(f"Unique images: {len(all_images)}")
print("")
if len(thumbnails) == 1:
    print("⚠️  ALL THUMBNAILS ARE THE SAME!")
elif len(thumbnails) == 0:
    print("❌ NO THUMBNAILS FOUND")
else:
    print(f"✅ {len(thumbnails)} different thumbnails")

if len(all_images) == 1:
    print("⚠️  ALL IMAGES ARE THE SAME!")
elif len(all_images) == 0:
    print("❌ NO IMAGES FOUND")
else:
    print(f"✅ {len(all_images)} different images")
print("="*80)
print("\nFull results written to: image_check_results.txt\n")

client.close()
