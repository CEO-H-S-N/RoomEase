from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any
from bson import ObjectId
from db.mongo import get_housing_collection
from utils.jwt_utils import get_user_from_cookie
from routes.users.users_response_schemas import UserResponse
from models.housing import Housing, HousingCreate, HousingUpdate

router = APIRouter(prefix="/housing", tags=["Housing CRUD"])

@router.post("/", response_model=Housing)
def create_listing(listing: HousingCreate, current_user: UserResponse = Depends(get_user_from_cookie)):
    try:
        housing_collection = get_housing_collection()
        
        # Add owner_id to the listing
        listing_data = listing.model_dump()
        listing_data["owner_id"] = current_user.id
        
        # Insert into DB
        result = housing_collection.insert_one(listing_data)
        
        # Fetch the created document
        created_listing = housing_collection.find_one({"_id": result.inserted_id})
        created_listing["_id"] = str(created_listing["_id"])
        
        return created_listing
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating listing: {e}")

@router.get("/my-listings", response_model=List[Housing])
def get_my_listings(current_user: UserResponse = Depends(get_user_from_cookie)):
    try:
        housing_collection = get_housing_collection()
        # Find listings owned by this user
        listings = list(housing_collection.find({"owner_id": current_user.id}))
        
        for listing in listings:
            listing["_id"] = str(listing["_id"])
            
        return listings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching your listings: {e}")

@router.get("/{listing_id}", response_model=Housing)
def get_listing(listing_id: str):
    try:
        housing_collection = get_housing_collection()
        listing = housing_collection.find_one({"_id": ObjectId(listing_id)})
        
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
            
        listing["_id"] = str(listing["_id"])
        return listing
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching listing: {e}")

@router.put("/{listing_id}", response_model=Housing)
def update_listing(listing_id: str, update: HousingUpdate, current_user: UserResponse = Depends(get_user_from_cookie)):
    try:
        housing_collection = get_housing_collection()
        
        # Verify ownership
        existing = housing_collection.find_one({"_id": ObjectId(listing_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        if existing.get("owner_id") != current_user.id:
            raise HTTPException(status_code=403, detail="You do not have permission to update this listing")
            
        # Update
        update_data = {k: v for k, v in update.model_dump().items() if v is not None}
        housing_collection.update_one({"_id": ObjectId(listing_id)}, {"$set": update_data})
        
        updated_listing = housing_collection.find_one({"_id": ObjectId(listing_id)})
        updated_listing["_id"] = str(updated_listing["_id"])
        return updated_listing
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating listing: {e}")

@router.delete("/{listing_id}")
def delete_listing(listing_id: str, current_user: UserResponse = Depends(get_user_from_cookie)):
    try:
        housing_collection = get_housing_collection()
        
        # Verify ownership
        existing = housing_collection.find_one({"_id": ObjectId(listing_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        if existing.get("owner_id") != current_user.id:
            raise HTTPException(status_code=403, detail="You do not have permission to delete this listing")
            
        housing_collection.delete_one({"_id": ObjectId(listing_id)})
        return {"detail": "Listing deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting listing: {e}")
