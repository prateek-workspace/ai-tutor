-- NeonDB schema for the Voice-Enabled AI Teaching Assistant.
--
-- There is NO seed data. This only creates the table that stores a history of
-- generated content (concept explanations, quizzes, translations, activities).
-- Rows are inserted automatically by the API as the assistant is used.
--
-- Apply it with:
--   psql "$DATABASE_URL" -f schema.sql
-- or:
--   python init_db.py

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
