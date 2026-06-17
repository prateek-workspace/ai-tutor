"""
NeonDB (PostgreSQL) persistence for generated classroom content.

This is *optional*: scope.md features all work without a database (everything
is generated live by Gemini). The DB only keeps a history of what was generated
so it can be reviewed/reused later.

If DATABASE_URL is not set, every function here is a safe no-op, so the API
keeps working without Neon configured.

There is NO data to "seed" — the only setup is creating the schema (see
schema.sql or run `python init_db.py`). Rows are written automatically as the
assistant is used.
"""

import os
import json

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor, Json
    _PSYCOPG_AVAILABLE = True
except ImportError:  # dependency not installed yet
    _PSYCOPG_AVAILABLE = False


def is_enabled():
    return bool(DATABASE_URL) and _PSYCOPG_AVAILABLE


def get_conn():
    """Open a new connection to Neon. Neon requires SSL (sslmode=require)."""
    if not is_enabled():
        return None
    dsn = DATABASE_URL
    if "sslmode" not in dsn:
        sep = "&" if "?" in dsn else "?"
        dsn = f"{dsn}{sep}sslmode=require"
    return psycopg2.connect(dsn)


SCHEMA = """
CREATE TABLE IF NOT EXISTS generations (
    id          SERIAL PRIMARY KEY,
    kind        TEXT NOT NULL,           -- 'simplify' | 'quiz' | 'translate' | 'activity'
    topic       TEXT,
    language    TEXT,
    data        JSONB NOT NULL,          -- the full generated payload
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_generations_kind ON generations (kind);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations (created_at DESC);
"""


def init_db():
    """Create the schema. Idempotent. Returns True if it ran."""
    if not is_enabled():
        print("DATABASE_URL not set (or psycopg2 missing) — skipping DB init.")
        return False
    conn = get_conn()
    try:
        with conn, conn.cursor() as cur:
            cur.execute(SCHEMA)
        print("Schema created/verified on NeonDB.")
        return True
    finally:
        conn.close()


def save_generation(kind, data, topic=None, language=None):
    """Persist one generated artifact. No-op if DB is not configured."""
    if not is_enabled():
        return None
    try:
        conn = get_conn()
        with conn, conn.cursor() as cur:
            cur.execute(
                """INSERT INTO generations (kind, topic, language, data)
                   VALUES (%s, %s, %s, %s) RETURNING id""",
                (kind, topic, language, Json(data)),
            )
            new_id = cur.fetchone()[0]
        conn.close()
        return new_id
    except Exception as e:  # never let persistence break a generation
        print(f"[db] save_generation failed: {e}")
        return None


def recent_generations(kind=None, limit=20):
    """Return recent generated artifacts (most recent first)."""
    if not is_enabled():
        return []
    try:
        conn = get_conn()
        with conn, conn.cursor(cursor_factory=RealDictCursor) as cur:
            if kind:
                cur.execute(
                    """SELECT id, kind, topic, language, data, created_at
                       FROM generations WHERE kind = %s
                       ORDER BY created_at DESC LIMIT %s""",
                    (kind, limit),
                )
            else:
                cur.execute(
                    """SELECT id, kind, topic, language, data, created_at
                       FROM generations
                       ORDER BY created_at DESC LIMIT %s""",
                    (limit,),
                )
            rows = cur.fetchall()
        conn.close()
        # make timestamps JSON-serializable
        for r in rows:
            r["created_at"] = r["created_at"].isoformat()
        return rows
    except Exception as e:
        print(f"[db] recent_generations failed: {e}")
        return []
