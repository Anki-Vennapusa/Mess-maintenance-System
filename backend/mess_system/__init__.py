import pymysql

pymysql.install_as_MySQLdb()

# Monkey patch version to satisfy Django
import MySQLdb
if not hasattr(MySQLdb, 'version_info'):
    MySQLdb.version_info = (1, 4, 3, "final", 0)
# Depending on error, we might need a higher version. 
# The error said "mysqlclient 2.2.1 or newer is required; you have 1.4.6".
# So lets fake 2.2.1
MySQLdb.version_info = (2, 2, 1, "final", 0)
