import os
import django
import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mess_system.settings')
django.setup()

from mess_api.models import User, StudentProfile, Menu, Attendance, Bill

def populate():
    print("Populating data...")

    # 1. Ensure a student user exists
    username = "teststudent"
    if not User.objects.filter(username=username).exists():
        user = User.objects.create_user(username=username, email="student@example.com", password="testpassword123", is_student=True)
        print(f"Created user: {username}")
    else:
        user = User.objects.get(username=username)
        print(f"User {username} already exists")

    # 2. Create Student Profile
    if not StudentProfile.objects.filter(user=user).exists():
        student = StudentProfile.objects.create(
            user=user,
            reg_num="SVU2025001",
            branch="Computer Science",
            year=3,
            phone="9876543210"
        )
        print("Created Student Profile")
    else:
        student = StudentProfile.objects.get(user=user)

    # 3. Create Weekly Menu
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    for day in days:
        if not Menu.objects.filter(day=day).exists():
            Menu.objects.create(
                day=day,
                breakfast="Idli, Vada, Sambar",
                lunch="Rice, Dal, Veg Curry, Curd",
                dinner="Chapati, Paneer Butter Masala, Rice"
            )
            print(f"Created Menu for {day}")

    # 4. Create Attendance (Random for demonstration)
    today = datetime.date.today()
    if not Attendance.objects.filter(student=student, date=today, meal_type="Lunch").exists():
        Attendance.objects.create(
            student=student,
            date=today,
            meal_type="Lunch",
            is_present=True
        )
        print("Marked Lunch Attendance for Today")

    # 5. Create Bill
    if not Bill.objects.filter(student=student, month="December 2025").exists():
        Bill.objects.create(
            student=student,
            month="December 2025",
            amount=2500.00,
            is_paid=False
        )
        print("Created Bill for December 2025")

    print("✅ Data Population Complete!")

if __name__ == '__main__':
    populate()
