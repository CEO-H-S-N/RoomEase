import requests
import json

try:
    response = requests.get("http://localhost:8000/api/profiles")
    if response.status_code == 200:
        data = response.json()
        print(f"Found {len(data)} profiles.")
        for p in data[:3]: # Print first 3
            print(json.dumps({
                "id": p.get("id"),
                "full_name": p.get("full_name"),
                "profile_photo": p.get("profile_photo"), 
                "verified": p.get("verified")
            }, indent=2))
    else:
        print(f"Error: {response.status_code} - {response.text}")
except Exception as e:
    print(f"Failed to connect: {e}")
