import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mess_system.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_superuser():
    username = 'admin'
    password = 'admin123'
    email = 'admin@example.com'

    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser '{username}'...")
        User.objects.create_superuser(username=username, email=email, password=password, is_staff_member=True)
        print("Superuser created.")
    else:
        print(f"Superuser '{username}' already exists.")
        user = User.objects.get(username=username)
        user.set_password(password)
        user.is_staff_member = True
        user.save()
        print("Password updated.")

if __name__ == '__main__':
    create_superuser()
