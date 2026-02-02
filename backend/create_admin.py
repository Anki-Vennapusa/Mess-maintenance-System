import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mess_system.settings')
django.setup()

from mess_api.models import User

def create_admin():
    username = "admin"
    password = "admin123"
    email = "admin@example.com"

    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser '{username}'...")
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        print(f"✅ Superuser '{username}' created successfully.")
    else:
        print(f"ℹ️ Superuser '{username}' already exists.")

if __name__ == '__main__':
    create_admin()
