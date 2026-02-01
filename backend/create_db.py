import pymysql

try:
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='Anki2244@',
        port=3306
    )
    cursor = conn.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS mess_system_db")
    print("Database 'mess_system_db' created successfully.")
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
