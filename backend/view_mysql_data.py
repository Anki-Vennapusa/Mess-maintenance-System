import pymysql

# Database Configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Anki2244@',
    'db': 'mess_system_db',
    'port': 3306
}

def view_data():
    try:
        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()
        
        # 1. List all tables
        print("\n--- Tables in 'mess_system_db' ---")
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        for table in tables:
            print(f"- {table[0]}")
            
        # 2. View Users
        print("\n--- Users (mess_api_user) ---")
        cursor.execute("SELECT id, username, email, is_staff_member, is_student FROM mess_api_user")
        users = cursor.fetchall()
        if not users:
            print("No users found.")
        for user in users:
            print(f"ID: {user[0]}, Username: {user[1]}, Staff: {user[3]}, Student: {user[4]}")

        # 3. View Menu
        print("\n--- Menu Items (mess_api_menu) ---")
        cursor.execute("SELECT day, breakfast, lunch, dinner FROM mess_api_menu")
        menus = cursor.fetchall()
        if not menus:
            print("No menu items found.")
        for menu in menus:
            print(f"Day: {menu[0]} | B: {menu[1][:20]}... | L: {menu[2][:20]}... | D: {menu[3][:20]}...")

        conn.close()
        
    except Exception as e:
        print(f"Error viewing data: {e}")

if __name__ == "__main__":
    view_data()
