from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
import os
from datetime import datetime, timedelta
import jwt
from db.mongo import get_users_collection

router = APIRouter(prefix="/auth", tags=["OAuth"])

# Google OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "your_google_client_id_here")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")

class GoogleAuthRequest(BaseModel):
    token: str

class GoogleAuthResponse(BaseModel):
    access_token: str
    user: dict

@router.post("/google", response_model=GoogleAuthResponse)
async def google_auth(auth_request: GoogleAuthRequest):
    """
    Authenticate user with Google OAuth token
    """
    try:
        print(f"Received Google auth request")
        print(f"GOOGLE_CLIENT_ID: {GOOGLE_CLIENT_ID}")
        print(f"Token length: {len(auth_request.token)}")
        
        # Verify the Google token
        idinfo = id_token.verify_oauth2_token(
            auth_request.token, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        
        print(f"Token verified successfully")
        print(f"User info: {idinfo}")

        # Extract user information
        email = idinfo.get('email')
        name = idinfo.get('name')
        picture = idinfo.get('picture')
        google_id = idinfo.get('sub')

        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")

        # Get users collection
        users_collection = get_users_collection()

        # Check if user exists
        user = users_collection.find_one({"email": email})

        if not user:
            # Create new user
            new_user = {
                "username": name,
                "email": email,
                "google_id": google_id,
                "profile_picture": picture,
                "auth_provider": "google",
                "created_at": datetime.utcnow(),
                "email_verified": True  # Google emails are pre-verified
            }
            result = users_collection.insert_one(new_user)
            user_id = str(result.inserted_id)
            print(f"Created new user: {user_id}")
        else:
            # Update existing user with Google info if not already set
            user_id = str(user["_id"])
            if not user.get("google_id"):
                users_collection.update_one(
                    {"_id": user["_id"]},
                    {"$set": {
                        "google_id": google_id,
                        "profile_picture": picture,
                        "email_verified": True
                    }}
                )
            print(f"Found existing user: {user_id}")

        # Create JWT token
        token_data = {
            "user_id": user_id,
            "email": email,
            "exp": datetime.utcnow() + timedelta(days=7)
        }
        access_token = jwt.encode(token_data, SECRET_KEY, algorithm="HS256")

        return GoogleAuthResponse(
            access_token=access_token,
            user={
                "id": user_id,
                "username": name,
                "email": email,
                "profile_picture": picture
            }
        )

    except ValueError as e:
        # Invalid token
        print(f"ValueError: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {str(e)}")
    except Exception as e:
        print(f"Exception: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")
