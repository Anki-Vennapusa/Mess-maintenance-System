import os
import django
import datetime
import requests
import json

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mess_system.settings')
django.setup()

from mess_api.models import User, StudentProfile, Menu, Attendance, Bill
from rest_framework.test import APIClient

def test_workflow():
    print("🚀 Starting Backend Workflow Verification...")
    client = APIClient()

    # 1. Auth: Login as Staff
    print("\n1. Authentication (Staff)...")
    login_resp = client.post('/api/login/', {'username': 'staff', 'password': 'staffpassword123'})
    if login_resp.status_code != 200:
        print("❌ Staff Login Failed")
        return
    token = login_resp.data['access']
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
    print("✅ Staff Login Successful")

    # 2. Manage Students: List
    print("\n2. Manage Students (List)...")
    students_resp = client.get('/api/profiles/')
    if students_resp.status_code == 200:
        print(f"✅ Fetched {len(students_resp.data)} students")
    else:
        print("❌ Failed to fetch students")

    # 3. Menu: Update
    print("\n3. Menu Management (Update)...")
    # Get first menu item ID
    menu_resp = client.get('/api/menu/')
    if len(menu_resp.data) > 0:
        menu_id = menu_resp.data[0]['id']
        patch_resp = client.patch(f'/api/menu/{menu_id}/', {'lunch': 'Verified Lunch Item'})
        if patch_resp.status_code == 200 and patch_resp.data['lunch'] == 'Verified Lunch Item':
            print("✅ Menu Update Successful")
        else:
            print("❌ Menu Update Failed")
    else:
        print("⚠️ No menu items to update")

    # 4. Attendance: Bulk Update
    print("\n4. Attendance (Bulk Update)...")
    today = datetime.date.today().isoformat()
    # Get a student reg_num
    if StudentProfile.objects.exists():
        student = StudentProfile.objects.first()
        payload = {
            "date": today,
            "records": [
                {"reg_num": student.reg_num, "is_present": True, "meal_type": "Non-Veg"}
            ]
        }
        att_resp = client.post('/api/attendance/bulk_update/', payload, format='json')
        if att_resp.status_code == 200:
            print("✅ Bulk Attendance Marked")
            # Verify in DB
            att_entry = Attendance.objects.get(student=student, date=today)
            if att_entry.is_present and att_entry.meal_type == 'Non-Veg':
                print("✅ Database verification passed: Present, Non-Veg")
            else:
                print(f"❌ Database Mismatch: {att_entry.is_present}, {att_entry.meal_type}")
        else:
            print(f"❌ Bulk Attendance Failed: {att_resp.data}")
    else:
        print("⚠️ No students to mark attendance for")

    # 5. Billing: Generate
    print("\n5. Billing (Generate)...")
    billing_payload = {
        "month": "2025-01",
        "daily_rate": 100
    }
    bill_resp = client.post('/api/bills/generate_bills/', billing_payload, format='json')
    if bill_resp.status_code == 200:
        print(f"✅ Generated Bills: {bill_resp.data['message']}")
    else:
        print(f"❌ Failed to generate bills: {bill_resp.data}")

    # 6. Billing: Mark as Paid
    print("\n6. Billing (Mark as Paid)...")
    # Find a bill
    if Bill.objects.exists():
        bill = Bill.objects.first()
        pay_resp = client.patch(f'/api/bills/{bill.id}/', {'is_paid': True}, format='json')
        if pay_resp.status_code == 200 and pay_resp.data['is_paid']:
            print("✅ Mark as Paid Successful")
        else:
            print("❌ Failed to mark as paid")
    else:
        print("⚠️ No bills found")

    print("\n🎉 Verification Complete!")

if __name__ == '__main__':
    test_workflow()
