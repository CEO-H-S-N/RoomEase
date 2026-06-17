import requests

def test():
    # Login
    session = requests.Session()
    res = session.post("http://localhost:8000/users/login", json={
        "email": "asd@asd.com",
        "password": "asd123"
    })
    print("Login:", res.status_code, res.json())
    
    # Check verification endpoint
    res = session.get("http://localhost:8000/api/admin/verifications")
    print("Verifications:", res.status_code, res.text)

test()
