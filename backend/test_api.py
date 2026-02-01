import requests

BASE_URL = "http://127.0.0.1:8000/api"

def test_register():
    print("Testing Registration...")
    url = f"{BASE_URL}/register/"
    data = {
        "username": "teststudent",
        "password": "testpassword123",
        "email": "student@example.com",
        "is_student": True
    }
    try:
        response = requests.post(url, data=data)
        if response.status_code == 201:
            print("✅ Registration Successful")
            return True
        elif response.status_code == 400 and "username" in response.json() and "already exists" in str(response.json()):
             print("✅ User already exists (Registration skipped)")
             return True
        else:
            print(f"❌ Registration Failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Registration Error: {e}")
        return False

def test_login():
    print("\nTesting Login...")
    url = f"{BASE_URL}/login/"
    data = {
        "username": "teststudent",
        "password": "testpassword123"
    }
    try:
        response = requests.post(url, data=data)
        if response.status_code == 200:
            print("✅ Login Successful")
            token = response.json().get("access")
            print(f"   Token obtained: {token[:20]}...")
            return token
        else:
            print(f"❌ Login Failed: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login Error: {e}")
        return None

if __name__ == "__main__":
    if test_register():
        test_login()
