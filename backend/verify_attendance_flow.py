import os
import django
import datetime
# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mess_system.settings')
django.setup()

from rest_framework.test import APIClient
from mess_api.models import User, StudentProfile, Attendance

def verify_flow():
    print("🚀 Starting End-to-End Attendance Verification...")
    client = APIClient()
    
    # 1. Setup Test Users
    print("\n1. Setting up Test Users...")
    # Staff
    staff_user, _ = User.objects.get_or_create(username='test_staff', defaults={'email': 'staff@test.com', 'is_staff_member': True})
    staff_user.set_password('staff123')
    staff_user.is_staff_member = True
    staff_user.save()
    
    # Student
    student_user, _ = User.objects.get_or_create(username='test_student', defaults={'email': 'student@test.com'})
    student_user.set_password('student123')
    student_user.save()
    
    profile, _ = StudentProfile.objects.get_or_create(
        user=student_user, 
        defaults={
            'reg_num': 'TEST001', 
            'branch': 'CSE', 
            'year': 1, 
            'phone': '1234567890'
        }
    )
    
    # Clear any existing attendance for this student for today
    today = datetime.date.today()
    Attendance.objects.filter(student=profile, date=today).delete()
    
    print("✅ Users setup complete")

    # 2. Login as Staff
    print("\n2. Staff Action: Mark Attendance...")
    login_resp = client.post('/api/login/', {'username': 'test_staff', 'password': 'staff123'})
    staff_token = login_resp.data['access']
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + staff_token)
    
    # Mark Present
    payload = {
        "date": today.isoformat(),
        "records": [
            {"reg_num": profile.reg_num, "is_present": True, "meal_type": "Veg"}
        ]
    }
    client.post('/api/attendance/bulk_update/', payload, format='json')
    print("✅ Marked 'Present' as Staff")
    
    # 3. Login as Student & Verify
    print("\n3. Student View: Checking Dashboard...")
    client.credentials() # Clear creds
    login_resp_student = client.post('/api/login/', {'username': 'test_student', 'password': 'student123'})
    student_token = login_resp_student.data['access']
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + student_token)
    
    # Fetch Attendance (Student Dashboard Logic)
    att_resp = client.get('/api/attendance/')
    my_attendance = att_resp.data
    
    # Check if today is present
    today_record = next((a for a in my_attendance if a['date'] == today.isoformat()), None)
    
    if today_record and today_record['is_present']:
        print("✅ SUCCESS: Student sees themselves as PRESENT")
    else:
        print(f"❌ FAILURE: Student does not see present status. Data: {my_attendance}")
        return

    # 4. Change to Absent
    print("\n4. Staff Action: Mark Absent...")
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + staff_token)
    payload['records'][0]['is_present'] = False
    client.post('/api/attendance/bulk_update/', payload, format='json')
    print("✅ Marked 'Absent' as Staff")
    
    # 5. Verify Student View again
    print("\n5. Student View: Checking Update...")
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + student_token)
    att_resp = client.get('/api/attendance/')
    my_attendance = att_resp.data
    today_record = next((a for a in my_attendance if a['date'] == today.isoformat()), None)
    
    if today_record and not today_record['is_present']:
         print("✅ SUCCESS: Student sees themselves as ABSENT")
    else:
         print(f"❌ FAILURE: Student does not see absent status. Data: {my_attendance}")
         return

    print("\n🎉 Integrated Flow Verified Successfully!")

if __name__ == '__main__':
    verify_flow()
