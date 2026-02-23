import requests

# Test the backend API
try:
    response = requests.get("http://localhost:8000/ai/housing_listings")
    if response.ok:
        listings = response.json()
        print(f"Total listings returned: {len(listings)}")
        print("\nFirst 5 listings thumbnail check:")
        print("="*80)
        
        for idx, listing in enumerate(listings[:5], 1):
            listing_id = listing.get("id", "N/A")
            thumbnail = listing.get("thumbnail", "NOT FOUND")
            images = listing.get("images", [])
            
            print(f"\n{idx}. Listing ID: {listing_id}")
            print(f"   Thumbnail: {thumbnail}")
            print(f"   Images: {len(images)} found")
            if images:
                for img in images[:1]:  # Show first image
                    print(f"     - {img}")
        
        print("\n" + "="*80)
        print("\nChecking if thumbnails are unique:")
        thumbnails = [l.get("thumbnail") for l in listings if l.get("thumbnail")]
        unique_thumbnails = set(thumbnails)
        print(f"Total thumbnails: {len(thumbnails)}")
        print(f"Unique thumbnails: {len(unique_thumbnails)}")
        
        if len(unique_thumbnails) == 1:
            print("\n⚠️  WARNING: API is returning the SAME thumbnail for all listings!")
            print(f"URL: {list(unique_thumbnails)[0]}")
        elif len(unique_thumbnails) == 0:
            print("\n❌ ERROR: No thumbnails in API response!")
        else:
            print(f"\n✅ API is returning {len(unique_thumbnails)} unique thumbnails")
            
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error connecting to API: {e}")
