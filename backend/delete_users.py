import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mess_system.settings')
django.setup()

from mess_api.models import User

def delete_all_users():
    total_users = User.objects.count()
    if total_users == 0:
        print("ℹ️  No users found in the database.")
        return

    print(f"⚠️  Found {total_users} users. Deleting them now...")
    
    # Delete all users
    count, _ = User.objects.all().delete()
    
    print(f"✅ Successfully deleted {count} users.")

    # verify
    remaining_users = User.objects.count()
    if remaining_users == 0:
        print("✅ Database is now clean of users.")
    else:
        print(f"❌ Warning: {remaining_users} users still remain.")

if __name__ == '__main__':
    # Add a simple confirmation to prevent accidental runs if run manually in future
    # But since I'm running it programmatically, I'll bypass input if I can, 
    # or just keep it simple as this is a specific user request.
    # For now, no input needed to make it automation friendly.
    delete_all_users()
