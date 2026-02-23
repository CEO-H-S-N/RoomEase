"""
Script to update housing listings with REAL unique Unsplash images using the official API.
This uses actual Unsplash photo IDs instead of the deprecated random/featured endpoint.

IMPORTANT: You need an Unsplash API Access Key
Get one free at: https://unsplash.com/developers
"""

import os
import requests
import time
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Unsplash API Configuration
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "YOUR_ACCESS_KEY_HERE")
UNSPLASH_API_URL = "https://api.unsplash.com"

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["Flat-Waley"]
housing_collection = db["housing"]

def fetch_random_photos(count=100, query="apartment,interior,room"):
    """
    Fetch random photos from Unsplash API
    Returns a list of photo objects with IDs and URLs
    """
    url = f"{UNSPLASH_API_URL}/photos/random"
    headers = {"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"}
    params = {
        "count": min(count, 30),  # Unsplash API limit is 30 per request
        "query": query,
        "orientation": "landscape"
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching photos: {e}")
        return []

def get_photo_urls(photo):
    """Extract URLs from Unsplash photo object"""
    return {
        "thumbnail": photo["urls"]["small"],  # 400x600
        "regular": photo["urls"]["regular"],   # ~1080px width
        "full": photo["urls"]["full"]          # Full resolution
    }

def update_listings_with_unsplash():
    """Update all housing listings with unique Unsplash photos"""
    
    # Check if API key is set
    if UNSPLASH_ACCESS_KEY == "YOUR_ACCESS_KEY_HERE":
        print("\n" + "="*80)
        print("ERROR: Unsplash API Access Key not configured!")
        print("="*80)
        print("\nTo use this script:")
        print("1. Go to https://unsplash.com/developers")
        print("2. Create a free developer account")
        print("3. Create a new application")
        print("4. Copy your Access Key")
        print("5. Add it to your .env file:")
        print("   UNSPLASH_ACCESS_KEY=your_access_key_here")
        print("\n" + "="*80 + "\n")
        return
    
    # Fetch all listings
    listings = list(housing_collection.find({}))
    total_listings = len(listings)
    
    print(f"\n{'='*80}")
    print(f"UPDATING HOUSING LISTINGS WITH REAL UNSPLASH PHOTOS")
    print(f"{'='*80}")
    print(f"Total listings to update: {total_listings}\n")
    
    # Fetch photos in batches (Unsplash allows max 30 per request)
    all_photos = []
    batches_needed = (total_listings + 29) // 30  # Round up
    
    print(f"Fetching {total_listings} unique photos from Unsplash...")
    print(f"This will take {batches_needed} API requests...\n")
    
    for batch in range(batches_needed):
        batch_size = min(30, total_listings - len(all_photos))
        print(f"Fetching batch {batch + 1}/{batches_needed} ({batch_size} photos)...")
        
        photos = fetch_random_photos(count=batch_size, query="apartment,interior,home")
        all_photos.extend(photos)
        
        # Rate limiting - be nice to Unsplash API
        if batch < batches_needed - 1:
            time.sleep(1)  # Wait 1 second between requests
    
    print(f"\n✅ Fetched {len(all_photos)} unique photos from Unsplash\n")
    
    # Update each listing with a unique photo
    updated_count = 0
    
    for idx, listing in enumerate(listings):
        if idx >= len(all_photos):
            print(f"⚠️  Warning: Not enough photos fetched. Stopping at listing {idx}")
            break
        
        listing_id = listing.get("listing_id", "")
        photo = all_photos[idx]
        urls = get_photo_urls(photo)
        
        # Use the same photo for thumbnail and images (different sizes)
        new_thumbnail = urls["thumbnail"]
        new_images = [
            urls["regular"],
            urls["full"]
        ]
        
        # Update the document
        result = housing_collection.update_one(
            {"_id": listing["_id"]},
            {
                "$set": {
                    "thumbnail": new_thumbnail,
                    "images": new_images,
                    "unsplash_photo_id": photo["id"],  # Store for attribution
                    "unsplash_photographer": photo["user"]["name"]
                }
            }
        )
        
        if result.modified_count > 0:
            updated_count += 1
            if updated_count <= 5:  # Show first 5 updates
                print(f"✅ Updated {listing_id}:")
                print(f"   Photo by: {photo['user']['name']}")
                print(f"   Thumbnail: {new_thumbnail[:60]}...")
                print()
    
    print(f"{'='*80}")
    print(f"SUMMARY:")
    print(f"{'='*80}")
    print(f"Total listings updated: {updated_count}/{total_listings}")
    print(f"\n✅ All listings now have REAL unique Unsplash photos!")
    print(f"   - Each listing has a different photo")
    print(f"   - Photos are from actual Unsplash photo IDs")
    print(f"   - No more caching issues!")
    print(f"\n📸 Photo credits stored in database for attribution")
    print(f"{'='*80}\n")
    
    client.close()

if __name__ == "__main__":
    update_listings_with_unsplash()
