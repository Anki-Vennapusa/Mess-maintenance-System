import os
import django
import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mess_system.settings')
django.setup()

from mess_api.models import StudentProfile, Attendance, Bill

def verify_plate_billing():
    print("--- Verifying Plate-Based Billing ---")
    
    # 1. Setup Data
    # Get first student
    student = StudentProfile.objects.first()
    if not student:
        print("❌ No student found. Run populate_data.py first.")
        return

    print(f"Testing with student: {student.reg_num}")
    
    # Rates
    veg_rate = 100.0
    nv_rate_full = 150.0 # Full plate price
    fixed_total = 150*2 + 125 + 275 # 700
    
    month_str = "2026-05"
    year, month = 2026, 5
    
    # Clear previous data for this month
    Attendance.objects.filter(student=student, date__year=year, date__month=month).delete()
    Bill.objects.filter(student=student, month=month_str).delete()
    
    # 2. Create Attendance Records
    # Day 1: 2 Veg plates
    Attendance.objects.create(
        student=student,
        date=datetime.date(2026, 5, 1),
        is_present=True,
        veg_plate_count=2,
        non_veg_plate_count=0
    )
    
    # Day 2: 1 Veg, 1 Non-Veg
    Attendance.objects.create(
        student=student,
        date=datetime.date(2026, 5, 2),
        is_present=True,
        veg_plate_count=1,
        non_veg_plate_count=1
    )
    
    # Day 3: 0 Veg, 2 Non-Veg
    Attendance.objects.create(
        student=student,
        date=datetime.date(2026, 5, 3),
        is_present=True,
        veg_plate_count=0,
        non_veg_plate_count=2
    )
    
    # Expected Counts:
    # Total Veg = 2 + 1 + 0 = 3
    # Total Non-Veg = 0 + 1 + 2 = 3
    
    # Expected Cost:
    # Veg Cost = 3 * 100 = 300
    # NV Cost = 3 * 150 = 450
    # Fixed = 700
    # Total = 300 + 450 + 700 = 1450
    
    expected_amount = 1450.0
    
    print(f"Set up 3 days of attendance.")
    print(f"Expected: Veg=3, NV=3")
    print(f"Expected Bill Amount: {expected_amount}")
    
    # 3. Trigger Bill Generation
    # We can call the view logic or hit the API. Let's hit the API logic using requests or Django test client?
    # Simpler: call the logic via DB or just use requests if server running. 
    # Let's use requests to be sure API is working.
    
    import requests
    try:
        # Login specific headers handled? No auth on this script, need token.
        # easier: duplicate logic or assume view works if we call requests.
        # Let's just simulate the logic directly to verify Models+ORM first, 
        # as generating token in script is tedious.
        
        # Actually, let's just use the URL if we can get a token.
        # Or just re-implement the calculation query here to verify *logic* works with ORM.
        
        # Real verification: Use API.
        # Get Token
        login_resp = requests.post('http://127.0.0.1:8000/api/login/', json={'username': 'staff', 'password': 'staffpassword123', 'role': 'staff'})
        token = login_resp.json().get('access')
        
        headers = {'Authorization': f'Bearer {token}'}
        
        payload = {
            'month': month_str,
            'daily_rate': veg_rate, # 100
            'nv_plate_rate': nv_rate_full, # 150
            'room_rent': 150,
            'water_charges': 125,
            'electricity_charges': 150,
            'establishment_charges': 275
        }
        
        print("Generating Bill via API...")
        bill_resp = requests.post('http://127.0.0.1:8000/api/bills/generate_bills/', json=payload, headers=headers)
        
        if bill_resp.status_code == 200:
            print("✅ Bill Generated Successfully")
            
            bill = Bill.objects.get(student=student, month=month_str)
            print(f"Generated Amount: {bill.amount}")
            
            if abs(float(bill.amount) - expected_amount) < 0.1: # Float comparison
                print("✅ PASSED: Amount matches expected.")
            else:
                print(f"❌ FAILED: Expected {expected_amount}, got {bill.amount}")
        else:
            print(f"❌ FAILED to generate bill. Status: {bill_resp.status_code}")
            print(bill_resp.text)

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    verify_plate_billing()
