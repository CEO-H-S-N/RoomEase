from db.mongo import get_users_collection
import json

def list_users():
    users = get_users_collection()
    all_users = list(users.find({}, {"password": 0}))
    for user in all_users:
        user["_id"] = str(user["_id"])
    print(json.dumps(all_users, indent=2))

if __name__ == "__main__":
    list_users()
