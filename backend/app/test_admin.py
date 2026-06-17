import requests
r = requests.post('http://localhost:8000/users/login', json={'email':'asd@asd.com','password':'asd123'}, timeout=5)
print(f'Status: {r.status_code}')
print(f'is_admin: {r.json().get("is_admin")}')
print(f'Body: {r.text[:400]}')
