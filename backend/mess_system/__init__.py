import os
from decouple import config

# Only use PyMySQL if explicitly configured or casually locally if available
# But we don't want to crash if it's missing in production (Postgres)
if config('USE_MYSQL', default=False, cast=bool):
    try:
        import pymysql
        pymysql.install_as_MySQLdb()
        
        # Monkey patch version to satisfy Django
        import MySQLdb
        if not hasattr(MySQLdb, 'version_info'):
            MySQLdb.version_info = (1, 4, 3, "final", 0)
        MySQLdb.version_info = (2, 2, 1, "final", 0)
    except ImportError:
        pass
