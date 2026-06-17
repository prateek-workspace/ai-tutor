# Backend — Voice-Enabled AI Teaching Assistant

Flask API powered entirely by **Google Gemini** (text + native TTS), with an
optional **NeonDB** (PostgreSQL) for storing a history of generated content.

## Quick start

```bash
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # set GEMINI_API_KEY (+ DATABASE_URL if using Neon)
python init_db.py             # optional: create the NeonDB schema (no-op if no DATABASE_URL)
python apiEndpoints.py        # http://127.0.0.1:5000
```

## Layout

| File | Purpose |
|------|---------|
| `apiEndpoints.py` | All Flask routes |
| `utils/gemini.py` | Concept simplification, quiz, translation, activity, intent detection |
| `utils/tts.py` | Gemini text-to-speech → WAV |
| `utils/db.py` | NeonDB persistence (graceful no-op if `DATABASE_URL` unset) |
| `schema.sql` / `init_db.py` | Create the `generations` table (no seed data) |
| `.env.example` | Environment template |

See the root [README.md](../README.md) for the full API reference