# Sahayak — Voice-Enabled AI Teaching Assistant

A **voice-first AI co-pilot for smart classrooms** in government schools. Teachers speak in **Hindi, English, or Hinglish**; the assistant detects the command, generates classroom content with **Google Gemini**, and projects it on a smartboard — with optional spoken narration.

Re-scoped from an earlier "AI Tutor" project to the [scope.md](scope.md) deliverables. Everything runs on **Gemini** (text + native text-to-speech); an optional **NeonDB** (PostgreSQL) keeps a history of generated content. The API ships with interactive **Swagger UI**.

---

## Table of Contents

- [Core Features](#core-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Do I Need to Populate the Database?](#do-i-need-to-populate-the-database)
- [Available Commands](#available-commands)
- [API Reference & Swagger](#api-reference--swagger)
- [Frontend Routes](#frontend-routes)
- [Voice Commands](#voice-commands)
- [Notes & Limitations](#notes--limitations)

---

## Core Features

The four scope.md MVP features, all driven by voice or text:

| # | Feature | What it does | Endpoint |
|---|---------|--------------|----------|
| 1 | **Live Concept Simplification** | Speak a topic → student-friendly **Hinglish** explanation + key points + an auto-generated **Mermaid diagram** (concept map/flowchart). Optional TTS narration. | `POST /simplify` |
| 2 | **Voice-Triggered Quiz Generation** | Ask for a quiz verbally → topic-specific **MCQs or short-answer** questions projected instantly. | `POST /quiz` |
| 3 | **Bilingual Dictation & Translation** | Dictate/paste content → **Hindi and English side-by-side**, each readable aloud. | `POST /translate` |
| 4 | **Hands-Free Activity Guide** | Ask for an activity/experiment → step-by-step instructions navigated by voice (**"Next" / "Repeat" / "Previous"**). | `POST /activity` |

Plus the glue that makes it voice-first:

- **Voice command router** (`POST /command`) — Gemini detects the **intent** of a spoken command and routes it to the right feature.
- **Text-to-speech** (`POST /tts`) — Gemini native TTS, returns WAV audio for narration.
- **Speech-to-text** — runs in the browser via the Web Speech API (free, supports `hi-IN` / `en-IN`).

Two teacher tools build on the same backend:

- **Quiz Studio** (`/quiz`) — generate an MCQ quiz on a topic and play it interactively (auto-scored).
- **Test Generator** (`/test-generate`) — generate a short-answer question paper and export it to PDF (paper or answer key).

A **Dashboard** (`/dashboard`) provides the teacher's overview (videos, attendance, results, notes, calendar, profile, stats).

---

## Architecture

```
   Teacher speaks ──▶ Browser STT (Web Speech API) ──▶ transcript
                                                          │
        ┌─────────────────────────────────────────────────┘
        ▼
  Next.js front-end  (/smartboard, /quiz, /test-generate, /dashboard)
        │  POST /command (or /simplify, /quiz, /translate, /activity, /tts)
        ▼
  Flask API  (http://127.0.0.1:5000)   ── Swagger UI at /docs
        │
        ├─▶ Google Gemini      ── text generation (gemini-2.0-flash), intent, JSON output
        ├─▶ Google Gemini TTS  ── (gemini-2.5-flash-preview-tts) → WAV audio
        └─▶ NeonDB / PostgreSQL (optional) ── history of generated content
        ▼
  Smartboard renders: explanation + Mermaid diagram / quiz / Hindi|English / activity steps
        └─▶ optional narration via <audio> (WAV from /tts)
```

**One AI provider (Gemini) for everything.** No Groq, no Cartesia, no vector database, no RAG.

---

## Tech Stack

**Backend** (`backend/`)
- Flask 3.1 + Flask-CORS + **flask-swagger-ui**
- `google-genai` (unified Gemini SDK) — text **and** TTS
- `psycopg2-binary` — NeonDB/PostgreSQL (optional)
- `python-dotenv`

**Frontend** (`frontend/`)
- Next.js 15 (App Router) + React 19
- Tailwind CSS v4 + shadcn/ui (Radix) for the dashboard
- Framer Motion (animation), Lucide (icons)
- **Mermaid** for concept diagrams
- Browser **Web Speech API** for voice input

---

## Design System

The UI uses a custom dark, editorial aesthetic (not a stock template):

- **Background:** pure black (`bg-black`).
- **Display type:** *Instrument Serif* (loaded via Google Fonts) — use the `.font-display` class for headings.
- **Liquid glass:** a reusable `.liquid-glass` class (frosted blur + gradient hairline border) defined in [`globals.css`](frontend/src/app/globals.css), used on nav, cards, inputs, and buttons.
- **Motion:** Framer Motion `useInView` reveals; the hero uses a vanilla-rAF crossfade-to-black video loop.
- Landing sections live in [`components/landing/`](frontend/src/components/landing/); the dashboard runs in forced dark mode using shadcn tokens.

---

## Project Structure

```
AI Tutor/
├── README.md            mine.md            scope.md
├── backend/                       # Flask API (Gemini + NeonDB + Swagger)
│   ├── apiEndpoints.py            # All routes + Swagger wiring
│   ├── openapi.py                 # OpenAPI 3.0 spec (served at /openapi.json)
│   ├── requirements.txt           # Gemini + Neon + Swagger deps
│   ├── schema.sql / init_db.py    # NeonDB schema (no seed data)
│   ├── .env.example
│   └── utils/
│       ├── gemini.py              # simplify / quiz / translate / activity / intent
│       ├── tts.py                 # Gemini TTS → WAV
│       └── db.py                  # NeonDB persistence (graceful no-op if unset)
└── frontend/
    ├── package.json               # (+ mermaid)
    ├── .env.local.example
    └── src/
        ├── app/
        │   ├── page.js                # Landing page (new design)
        │   ├── smartboard/page.js     # ★ Voice-first assistant
        │   ├── quiz/page.js           # Quiz Studio (interactive)
        │   ├── test-generate/page.js  # Test Generator (PDF export)
        │   └── dashboard/ …           # Teacher dashboard (dark)
        ├── components/
        │   ├── Navbar.jsx  ToolHeader.jsx  Mermaid.jsx
        │   ├── landing/ Hero · About · Features · HowItWorks · Footer
        │   ├── dashboard/ …           # sidebar, header, cards
        │   └── ui/ …                  # shadcn/ui primitives
        └── lib/ api.js · utils.js
```

Removed during the re-scope (out of scope.md): backend RAG/plagiarism/Cartesia code; frontend `pdf-chat`, `url-chat`, `plague`, `doubt-engine`, `virtual-class` pages; 3D classroom components + `.glb`/audio assets.

---

## Requirements

- **Node.js** 18.18+ (Node 20 LTS recommended), **npm**
- **Python** 3.10–3.12, **pip**, `venv`
- A **Google Gemini API key** — https://aistudio.google.com/apikey
- *(Optional)* a **NeonDB** account + connection string — https://neon.tech
- A **Chromium-based browser** (Chrome/Edge) for voice input — the Web Speech API isn't in Firefox/Safari

---

## Environment Variables

### Backend — `backend/.env` (copy from `.env.example`)

```env
GEMINI_API_KEY=your_gemini_api_key            # required
GEMINI_TEXT_MODEL=gemini-2.0-flash            # optional
GEMINI_TTS_MODEL=gemini-2.5-flash-preview-tts # optional
GEMINI_TTS_VOICE=Kore                         # optional (Kore, Puck, Charon, Aoede, …)
DATABASE_URL=                                 # optional NeonDB connection string
```

> `GEMINI_API_KEY` is also accepted as `GOOGLE_API_KEY`. Empty `DATABASE_URL` → app runs fine, history just isn't persisted.

### Frontend — `frontend/.env.local` (copy from `.env.local.example`)

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5000   # defaults to this if unset
```

The front-end talks only to the backend; no API key is exposed to the browser.

---

## Getting Started

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate            # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                # fill in GEMINI_API_KEY (+ DATABASE_URL if using Neon)
python init_db.py                   # optional: create NeonDB schema (no-op without DATABASE_URL)
python apiEndpoints.py              # http://127.0.0.1:5000  ·  docs at /docs
```

### 2. Frontend
```bash
cd frontend
npm install                         # also pulls in mermaid
cp .env.local.example .env.local    # optional; defaults work locally
npm run dev                         # http://localhost:3000
```

### 3. Use it
Open **http://localhost:3000/smartboard**, click **Speak Command**, and say *"Explain photosynthesis in Hinglish"*. API docs are at **http://127.0.0.1:5000/docs**.

---

## Do I Need to Populate the Database?

**No — there is no data to seed.** Every feature is generated live by Gemini. The database is **optional** and only stores a *history* of generations. The only setup is creating one empty table:

```bash
# after setting DATABASE_URL in backend/.env, run ONE of:
psql "$DATABASE_URL" -f backend/schema.sql
cd backend && python init_db.py
```

No `INSERT`s, no imports. The `generations` table starts empty and fills as you use the app. Inspect via `GET /history` or SQL.

---

## Available Commands

### Backend (`backend/`)
| Command | Description |
|---------|-------------|
| `pip install -r requirements.txt` | Install Python deps |
| `python apiEndpoints.py` | Run the Flask API (port 5000) + Swagger UI |
| `python init_db.py` | Create the NeonDB schema |

### Frontend (`frontend/`)
| Command | Description |
|---------|-------------|
| `npm install` | Install deps (incl. mermaid) |
| `npm run dev` / `build` / `start` / `lint` | Standard Next.js |

---

## API Reference & Swagger

- **Swagger UI:** http://127.0.0.1:5000/docs (interactive — try every endpoint in the browser)
- **OpenAPI spec:** http://127.0.0.1:5000/openapi.json

Base URL `http://127.0.0.1:5000`. All POST bodies are JSON; errors return `{ "error": "..." }`.

| Method | Path | Purpose | Body / Query |
|--------|------|---------|--------------|
| POST | `/command` | Detect intent from a transcript and run it | `{ transcript }` |
| POST | `/simplify` | Concept explanation + key points + Mermaid diagram | `{ topic, language?, level? }` |
| POST | `/quiz` | Generate MCQ/short-answer questions | `{ topic, n?, type?, language? }` |
| POST | `/translate` | Hindi + English translation | `{ text }` |
| POST | `/activity` | Step-by-step activity guide | `{ topic, language? }` |
| POST | `/tts` | Gemini text-to-speech → `audio/wav` | `{ text, voice? }` |
| GET | `/history` | Recent generations (if NeonDB configured) | `?kind=&limit=` |
| GET | `/health` | Health/config check | — |

Example:
```bash
curl -X POST http://127.0.0.1:5000/command \
  -H "Content-Type: application/json" \
  -d '{"transcript":"Make a 5 question quiz on fractions"}'
```

---

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page (new liquid-glass design) |
| `/smartboard` | **★ Main app** — voice/text command bar + the 4 feature panels + narration |
| `/quiz` | Quiz Studio — generate & play MCQ quizzes |
| `/test-generate` | Test Generator — short-answer paper + PDF export |
| `/dashboard` (+ subpages) | Teacher dashboard (videos, attendance, results, tests, notes, calendar, profile, stats) |

---

## Voice Commands

Click **Speak Command** and talk naturally:

- *"Explain the water cycle in Hinglish"* → concept + diagram
- *"Make a 5 question quiz on fractions"* → MCQs
- *"Translate: photosynthesis happens in the leaves"* → Hindi/English
- *"Create an activity to show air has weight"* → step-by-step guide

In the **Activity Guide**, enable **hands-free** mode and say **"next"**, **"previous"/"back"**, or **"repeat"** (also recognises Hindi cues like *dobara*, *pichla*, *aage*).

---

## Notes & Limitations

- **Model names** (`gemini-2.0-flash`, `gemini-2.5-flash-preview-tts`) are env-overridable if Google changes availability.
- **Voice input** uses the browser Web Speech API → Chromium-based browsers only; requires mic permission and `localhost`/HTTPS.
- **Hinglish STT** is approximate (browser transcribes `hi-IN` or `en-IN`; the language selector picks which).
- The dashboard is largely **mock/sample data** (no analytics backend) — it's kept as the teacher shell per project scope.
- **CORS is open and Flask debug is on** for local development — lock both down before deploying.

See [mine.md](mine.md) for the full technical deep-dive.
