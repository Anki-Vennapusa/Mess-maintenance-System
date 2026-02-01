import os
import django
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mess_system.settings')
django.setup()

from mess_api.models import Bill, StudentProfile, Attendance
from datetime import date

# Ensure test student profile exists
student = StudentProfile.objects.first()
if not student:
    print("No student profile found. Please create one.")
    exit()

# Ensure some attendance exists for Jan 2025
Attendance.objects.filter(student=student, date__year=2025, date__month=1).delete()
for d in range(1, 11): # 10 days present
    Attendance.objects.create(student=student, date=date(2025, 1, d), is_present=True, meal_type='Veg')
for d in range(11, 13): # 2 days NV
    Attendance.objects.create(student=student, date=date(2025, 1, d), is_present=True, meal_type='Non-Veg')

# Generate Bill for 2025-01
month_str = '2025-01'
daily_rate = 65.0
nv_plate_rate = 27.0
room = 150.0
water = 125.0
elec = 150.0
est = 275.0

fixed_total = room + water + elec + est
present_days = 12
nv_days = 2

food_cost = (present_days * daily_rate)
nv_add_on = (nv_days * nv_plate_rate)
total = food_cost + nv_add_on + fixed_total

bill, created = Bill.objects.update_or_create(
    student=student,
    month=month_str,
    defaults={
        'amount': total,
        'daily_rate': daily_rate,
        'nv_plate_rate': nv_plate_rate,
        'room_rent': room,
        'water_charges': water,
        'electricity_charges': elec,
        'establishment_charges': est
    }
)

print(f"Generated Bill for {student.reg_num}: {bill.amount}")
print(f"Details: Food({food_cost}) + NV_Add({nv_add_on}) + Fixed({fixed_total})")
