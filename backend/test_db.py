import pymysql
import sys

# print(f"Python: {sys.version}")

print("Attempting connection with EMPTY password...")
try:
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='', # Trying empty password
        database='mess_db'
    )
    print("Connection successful with empty password!")
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")
