"""
One-time database setup for NeonDB.

Usage:
    python init_db.py

Reads DATABASE_URL from backend/.env, then creates the `generations` table.
This does NOT insert any data — it only creates the schema. Safe to run again.
"""

from utils.db import init_db, is_enabled

if __name__ == "__main__":
    if not is_enabled():
        print(
            "Nothing to do: set DATABASE_URL in backend/.env "
            "(and `pip install psycopg2-binary`) first."
        )
    else:
        init_db()
