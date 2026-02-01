import os
import django
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mess_system.settings')
django.setup()

from mess_api.models import Bill, StudentProfile, User
from mess_api.serializers import BillSerializer

# Create dummy data if needed
if not User.objects.filter(username='test_student').exists():
    u = User.objects.create(username='test_student', is_student=True)
    StudentProfile.objects.create(user=u, reg_num='TEST101', branch='CSE', year=3)

try:
    student = StudentProfile.objects.first()
    if not Bill.objects.filter(student=student).exists():
        Bill.objects.create(student=student, month='2025-01', amount=1000)

    bill = Bill.objects.filter(student__isnull=False).first()
    if bill:
        print(f"Testing Bill ID: {bill.id}, Student Reg: {bill.student.reg_num}")
        serializer = BillSerializer(bill)
        print("Serialized Data:", serializer.data)
        if 'student_reg_num' in serializer.data:
            print("SUCCESS: student_reg_num is present.")
        else:
            print("FAILURE: student_reg_num is MISSING.")
    else:
        print("No bills found to test.")

except Exception as e:
    print(f"Error: {e}")
