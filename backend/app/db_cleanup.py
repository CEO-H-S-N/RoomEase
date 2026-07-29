import sys, os
sys.path.insert(0, '.')
from dotenv import load_dotenv
load_dotenv('.env')
from pymongo import MongoClient
from bson import ObjectId

MONGO_URI = os.getenv('MONGO_URI')
DB_NAME   = os.getenv('DB_NAME', 'Flat-Waley')

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=8000, tlsAllowInvalidCertificates=True)
db = client[DB_NAME]
users_col    = db['users']
profiles_col = db['profiles']

print('--- CHECK 1: Admin Users ---')
admins = list(users_col.find({'is_admin': True}, {'_id':1,'username':1,'email':1}))
print('Found ' + str(len(admins)) + ' admin(s):')
for a in admins:
    print('  email=' + str(a.get('email')) + '  username=' + str(a.get('username')) + '  id=' + str(a['_id']))

print('')
print('--- CHECK 2: Broken profile_id links ---')
all_users = list(users_col.find({}, {'_id':1,'username':1,'email':1,'profile_id':1}))
broken = []
for u in all_users:
    pid = u.get('profile_id', '')
    if not pid:
        continue
    try:
        exists = profiles_col.find_one({'_id': ObjectId(str(pid))}, {'_id':1})
    except Exception:
        exists = None
    if not exists:
        broken.append(u)

print('Found ' + str(len(broken)) + ' broken profile_id link(s):')
for u in broken:
    print('  email=' + str(u.get('email')) + '  bad_profile_id=' + str(u.get('profile_id')))
    users_col.update_one({'_id': u['_id']}, {'$set': {'profile_id': ''}})
    print('    -> Cleared.')

print('')
print('--- CHECK 3: Orphan Profiles (seed/dummy data for AI matching) ---')
all_profiles = list(profiles_col.find({}, {'_id':1,'full_name':1,'city':1}))
linked_ids = set()
for u in all_users:
    pid = u.get('profile_id','')
    if pid:
        linked_ids.add(str(pid))
orphans = [p for p in all_profiles if str(p['_id']) not in linked_ids]
print('Found ' + str(len(orphans)) + ' orphan profile(s):')
for o in orphans[:5]:
    print('  id=' + str(o['_id']) + '  name=' + str(o.get('full_name','N/A')) + '  city=' + str(o.get('city','N/A')))
if len(orphans) > 5:
    print('  ... and ' + str(len(orphans)-5) + ' more.')

print('')
print('--- SUMMARY ---')
print('Total users:        ' + str(users_col.count_documents({})))
print('Total profiles:     ' + str(profiles_col.count_documents({})))
print('Admin users:        ' + str(len(admins)))
print('Broken links fixed: ' + str(len(broken)))
print('Orphan profiles:    ' + str(len(orphans)))
