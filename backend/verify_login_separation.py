import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api"

def test_login(username, password, role, expected_status, description):
    print(f"Testing: {description}")
    try:
        response = requests.post(f"{BASE_URL}/login/", json={
            "username": username,
            "password": password,
            "role": role
        })
        
        if response.status_code == expected_status:
            print(f"✅ PASSED: Got {response.status_code}")
            if response.status_code == 200:
                print(f"   Token: {response.json().get('access')[:20]}...")
            else:
                 print(f"   Error: {response.json().get('detail')}")
        else:
            print(f"❌ FAILED: Expected {expected_status}, got {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ ERROR: Could not connect to server. Is it running? {e}")

if __name__ == "__main__":
    print("--- Verifying Login Separation ---")
    
    # 1. Student as Student (Correct)
    test_login("teststudent", "testpassword123", "student", 200, "Student logging in as Student")
    
    # 2. Student as Staff (Should Fail)
    test_login("teststudent", "testpassword123", "staff", 400, "Student logging in as Staff (Should Fail)")
    
    # 3. Staff as Staff (Correct)
    test_login("staff", "staffpassword123", "staff", 200, "Staff logging in as Staff")
    
    # 4. Staff as Student (Should Fail)
    test_login("staff", "staffpassword123", "student", 400, "Staff logging in as Student (Should Fail)")
