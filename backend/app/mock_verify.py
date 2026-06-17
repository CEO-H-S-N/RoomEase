import os
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

# Ensure uploads dir exists
os.makedirs("uploads/dummy_user", exist_ok=True)
with open("uploads/dummy_user/dummy_cnic.jpg", "w") as f:
    f.write("dummy image")
with open("uploads/dummy_user/dummy_doc.pdf", "w") as f:
    f.write("dummy pdf")

client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DB_NAME", "Flat-Waley")]

# Create a dummy user
dummy_user_id = db.users.insert_one({
    "username": "testuser_verify",
    "email": "verify@test.com",
    "document_verification_status": "pending",
    "verification_documents": {
        "cnic_front": "/uploads/dummy_user/dummy_cnic.jpg",
        "cnic_back": "/uploads/dummy_user/dummy_cnic.jpg",
        "proof_of_address": "/uploads/dummy_user/dummy_doc.pdf"
    }
}).inserted_id

print(f"Created mock pending request for user {dummy_user_id}")
