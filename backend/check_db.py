import pymysql

try:
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='Anki2244@',
        port=3306
    )
    cursor = conn.cursor()
    cursor.execute("SHOW DATABASES")
    dbs = [db[0] for db in cursor.fetchall()]
    print("Combined Databases Found:", dbs)
    
    if 'mess_system_db' in dbs:
        print("SUCCESS: Database 'mess_system_db' exists.")
    else:
        print("FAILURE: Database 'mess_system_db' NOT found.")
        
    conn.close()
except Exception as e:
    print(f"CONNECTION ERROR: {e}")
