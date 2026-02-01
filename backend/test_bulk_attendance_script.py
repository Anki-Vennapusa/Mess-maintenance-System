import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api"

def run_test():
    print("Testing Bulk Attendance API...")
    
    # 1. Login
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/login/", json=login_data)
        if resp.status_code != 200:
            print(f"Login failed: {resp.status_code} {resp.text}")
            # Try to populate admin if login fails? No, assuming admin exists.
            print("Ensure 'admin' user exists. Run 'python create_admin.py' if needed.")
            sys.exit(1)
            
        token = resp.json()['access']
        print("Login successful. Got token.")

        # 2. Bulk Update
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "date": "2025-12-31",
            "records": [
                { "reg_num": "SVU2025001", "is_present": True, "meal_type": "Non-Veg" },
                 { "reg_num": "UNKNOWN123", "is_present": True } # Should error
            ]
        }
        
        print(f"Sending payload: {json.dumps(payload, indent=2)}")
        resp = requests.post(f"{BASE_URL}/attendance/bulk_update/", json=payload, headers=headers)
        
        print(f"Response Status: {resp.status_code}")
        print(f"Response Body: {json.dumps(resp.json(), indent=2)}")
        
        if resp.status_code == 200:
            print("✅ Bulk Update Test Passed!")
        else:
            print("❌ Bulk Update Test Failed.")

    except ImportError:
        print("requests library not found. Please install it: pip install requests")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    run_test()
