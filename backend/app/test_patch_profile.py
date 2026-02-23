import sys
import os
from datetime import timedelta
from dotenv import load_dotenv
import requests
import json

# Load env before importing modules that might use env vars
load_dotenv()

# Add current directory to path so we can import app modules
sys.path.append(os.getcwd())

from utils.jwt_utils import create_access_token

BASE_URL = "http://localhost:8000"
PROFILE_ID = "698edd29e28dff0d1977a2cb"
USER_ID = "698e93f649d98635b9b41bbe" # ID from user listing earlier

def test_patch_profile():
    # 1. Create a valid token
    token = create_access_token(
        user_id=USER_ID,
        username="testuser",
        email="test@example.com",
        profile_id=PROFILE_ID,
        is_verified=True,
        expires_delta=timedelta(minutes=5)
    )
    
    cookies = {"access_token": token}
    
    url = f"{BASE_URL}/profiles/{PROFILE_ID}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "city": "Lahore",
        "budget_PKR": 65000,
        "occupation": "Senior Engineer"
    }

    print(f"Testing PATCH {url}")
    print(f"Payload: {payload}")
    
    try:
        response = requests.patch(url, json=payload, headers=headers, cookies=cookies)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_patch_profile()
