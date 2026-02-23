import asyncio
from db.mongo import get_users_collection
from bson import ObjectId

async def make_user_admin(email: str):
    users = get_users_collection()
    user = users.find_one({"email": email})

    if not user:
        print(f"❌ User with email '{email}' not found.")
        return

    users.update_one(
        {"_id": user["_id"]},
        {"$set": {"is_admin": True}}
    )

    print(f"✅ User '{user['username']}' ({email}) is now an ADMIN.")

if __name__ == "__main__":
    email = input("Enter email to promote to admin: ")
    asyncio.run(make_user_admin(email))
