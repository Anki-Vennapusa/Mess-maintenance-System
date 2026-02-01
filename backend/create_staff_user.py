import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mess_system.settings')
django.setup()

from mess_api.models import User

def create_staff_user():
    username = "staff"
    password = "staffpassword123"
    email = "staff@example.com"

    if not User.objects.filter(username=username).exists():
        print(f"Creating staff user '{username}'...")
        User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_staff=True,
            is_staff_member=True # Custom field in User model
        )
        print(f"✅ Staff user '{username}' created successfully.")
    else:
        print(f"ℹ️ Staff user '{username}' already exists.")

if __name__ == '__main__':
    create_staff_user()
