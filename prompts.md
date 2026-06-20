# Building **Sahayak** from Scratch — An AI Prompt Playbook

> A reproducible, prompt-by-prompt guide to building **Sahayak**, a voice-first AI teaching
> assistant for multilingual smart classrooms, entirely with an AI coding agent (Claude Code,
> Cursor, etc.) — with **you as the human-in-the-loop** owning the product brief, the
> architecture decisions, the model/provider choices, and acceptance criteria.

---

## How to use this playbook

- **Model**: drive a strong coding model with tool/file access. Keep one feature branch per phase.
- **Cadence**: paste **one numbered prompt at a time**, review the diff, run it, then continue.
- **Your job (the human in the loop)** is highlighted in `▸ DECIDE` callouts before each prompt:
  the agent proposes; *you* ratify the provider, data model, hosting target, and scope cuts.
- **Golden rule for the agent** (state this once up front): *"Prefer the latest, most capable
  Google **Gemini** models. Use a single provider. No RAG, no vector DB, no extra LLM vendors.
  Structured outputs via JSON. Fail loud on missing config. Keep the API key server-side."*

There are **7 extensive prompts**. Together they reproduce the full system: a **Flask + google-genai**
backend (text, native TTS, image generation, optional **NeonDB** persistence, **OpenAPI/Swagger**)
and a **Next.js 15 (App Router) + React 19 + Tailwind v4** frontend (liquid-glass design system,
voice-first smartboard, quiz studio, test generator, dashboard, and **English/Hindi/Hinglish/Haryanvi**
localization).

---

## Prompt 1 — Product brief, scope freeze & architecture

`▸ DECIDE before sending:` the **AI provider** (this build = Google Gemini, one vendor end-to-end),
whether you want a **database** at all (here: optional Postgres for history, **no RAG/vector store**),
and the **hosting** target (here: managed PaaS for the API, static/edge host for the web app).

```
You are a senior engineer. We are building a NEW product from an empty repo. Read this brief,
then propose a concrete architecture and repository layout for my approval BEFORE writing code.

PRODUCT BRIEF — "Sahayak": a voice-first AI teaching assistant for smart classrooms in
government schools. It is an AI co-pilot for teachers that enables hands-free classroom
interaction through natural Hindi, English, Hinglish (and later Haryanvi) voice commands while
projecting educational content on a smartboard in real time.

Problem: teachers spend significant time writing explanations, translating content, creating
quizzes, and guiding activities manually; existing digital tools are keyboard-driven and not
optimized for multilingual classrooms.

Core features (MVP, all driven by voice or text):
  1. Live Concept Simplification — teacher speaks a topic; AI generates a student-friendly
     Hinglish explanation; smartboard shows key points plus a visual aid (diagram/concept map);
     optional text-to-speech narration.
  2. Voice-Triggered Quiz Generation — teacher requests a quiz verbally; AI generates topic
     MCQs / short questions; projected instantly.
  3. Bilingual Dictation & Translation — convert spoken or textual content into Hindi and
     English shown side-by-side.
  4. Hands-Free Activity Guide — AI generates step-by-step activity/experiment instructions the
     teacher navigates by voice ("Next Step", "Repeat Step"), with an on-screen timer.

User flow: teacher activates voice input → speech-to-text → AI identifies the command INTENT →
relevant content generated → smartboard updates with visual output → AI optionally narrates.

Out of scope (do NOT build): student performance tracking, attendance, LMS integration, homework
evaluation, learning analytics, multi-classroom management, authentication.

ARCHITECTURE CONSTRAINTS:
- Single AI provider: Google Gemini via the unified `google-genai` Python SDK. No Groq/OpenAI,
  no LangChain, no embeddings, no vector database, no RAG. Everything is live generation.
- Backend: Python + Flask REST API with permissive CORS, an intent-routing endpoint, per-feature
  endpoints, a text-to-speech endpoint (returns audio), an image endpoint (returns PNG/JPEG), a
  health endpoint, and interactive API docs (OpenAPI 3.0 + Swagger UI).
- Persistence: OPTIONAL NeonDB (managed Postgres) storing a history of generated content in a
  single JSONB table. The app MUST run fully without a database (graceful no-op). There is no
  seed data — schema creation only.
- Frontend: Next.js 15 App Router + React 19, Tailwind CSS v4, framer-motion, lucide-react.
  Speech-to-text uses the browser Web Speech API. The browser never sees the Gemini key — all
  AI calls go through the Flask backend.
- Config via environment variables only; secrets never committed.

DELIVERABLE FOR THIS STEP (no code yet): propose (a) the monorepo layout (backend/ + frontend/),
(b) the list of backend endpoints with request/response JSON shapes, (c) the Gemini model
matrix (text model, TTS model, image model) each overridable by an env var, (d) the env var
list for both services, and (e) the data model for the history table. Wait for my approval.
```

`▸ AFTER:` review the endpoint list and model matrix. Confirm endpoint names
(`/command`, `/simplify`, `/quiz`, `/translate`, `/activity`, `/tts`, `/image`, `/history`,
`/health`) and that each Gemini model is env-overridable. Approve, then continue.

---

## Prompt 2 — Backend foundation & the Gemini generation core

`▸ DECIDE:` the **prompt-engineering contract** — that every generator returns **strict JSON**
(via `response_mime_type="application/json"`) so the frontend never parses prose, and that
**language** is a first-class parameter so the same code serves Hindi/English/Hinglish/Haryanvi.

```
Scaffold the backend in /backend (Python 3, Flask). Create:
- requirements.txt: Flask, flask-cors, flask-swagger-ui, python-dotenv, google-genai,
  psycopg2-binary. Pin with >= minimums, UTF-8.
- .env.example with: GEMINI_API_KEY (also accept GOOGLE_API_KEY), GEMINI_TEXT_MODEL
  (default gemini-2.5-flash), GEMINI_TTS_MODEL (default gemini-2.5-flash-preview-tts),
  GEMINI_TTS_VOICE (default Kore), GEMINI_IMAGE_MODEL (default gemini-2.5-flash-image),
  DATABASE_URL (blank). Load with python-dotenv.
- utils/gemini.py — the text generation core. Use a single lazily-created, cached
  `genai.Client(api_key=...)` that raises a clear RuntimeError if the key is missing. Read the
  model id from GEMINI_TEXT_MODEL. Provide two private helpers:
    * _generate_text(prompt, system_instruction=None, temperature) -> str
    * _generate_json(prompt, system_instruction=None, temperature) -> parsed JSON, by setting
      config.response_mime_type="application/json" and json.loads()-ing the result, with a
      fenced-code-block fallback (strip ``` and a leading "json").
  Add a LANGUAGE_INSTRUCTIONS dict mapping language codes to natural-language instructions:
    hinglish -> "conversational Hinglish (Hindi-English mix in Roman script)"
    hindi    -> "simple Hindi (Devanagari)"
    english  -> "simple English"
    haryanvi -> "the Haryanvi dialect of Hindi in Devanagari (use words like सै, के, कोन्या, थारे)"
  and a language_phrase(code) accessor used by every generator.

Now implement the four feature generators + the intent router as pure functions returning dicts:
  1. simplify_concept(topic, language="hinglish", level="secondary") -> 
     {topic, language, explanation, key_points:[...], diagram} where `diagram` is valid Mermaid.js
     source (flowchart TD or mindmap, ASCII only); strip any code fences from it.
  2. generate_quiz(topic, n=5, qtype="mcq"|"short", language="english") ->
     {topic, type, language, questions:[...]}. For mcq each item is
     {question, options:[4], answer:<exact option text>}; for short {question, answer}.
  3. translate_text(text) -> {original, hindi, english} (faithful, low temperature).
  4. generate_activity(topic, language="english") -> {topic, title, materials:[...], steps:[...]}
     where each step is one clear action the teacher reads aloud.
  5. detect_intent(transcript) -> {intent, topic, text, n, qtype, language} where intent ∈
     {simplify, quiz, translate, activity, unknown}; the teacher may speak Hindi/English/Hinglish/
     Haryanvi. Constrain intent to the valid set; default language hinglish; coerce n to int.

Write idiomatic, commented code. System instructions should frame the model as a warm Indian
government-school teacher's co-pilot using everyday classroom examples. Do NOT build the Flask
routes yet — just utils/gemini.py and the project skeleton. Verify everything imports / compiles.
```

`▸ AFTER:` skim `utils/gemini.py`. Confirm JSON-only outputs and that `language` threads through
every generator and the intent router. This is the brain of the app — get the prompts right here.

---

## Prompt 3 — Media generation, persistence & the full API surface (with Swagger)

`▸ DECIDE:` how **TTS** audio is returned (here: wrap Gemini's raw **24 kHz/16-bit/mono PCM** into a
**WAV** container so any browser plays it), the **image-generation strategy** (env-selectable:
Gemini image model via `generate_content(response_modalities=["IMAGE"])` *or* an **Imagen** model
via `generate_images`), and that **persistence is best-effort and never blocks a generation**.

```
Extend the backend with media + persistence + the HTTP layer.

utils/tts.py — text_to_speech(text, voice=None) using GEMINI_TTS_MODEL with
config.response_modalities=["AUDIO"] and a PrebuiltVoiceConfig (default GEMINI_TTS_VOICE="Kore").
Gemini returns raw PCM (24000 Hz, 16-bit, mono) in candidates[0].content.parts[0].inline_data.data.
Wrap it into a WAV using the std-lib `wave` + io.BytesIO and return WAV bytes.

utils/image.py — generate_image(prompt) -> (bytes, mime). Read GEMINI_IMAGE_MODEL. If the model id
contains "imagen", call client.models.generate_images(...) with GenerateImagesConfig(number_of_images=1)
and return generated_images[0].image.(image_bytes, mime_type); otherwise call
client.models.generate_content(model, contents=prompt,
config=GenerateContentConfig(response_modalities=["IMAGE"])) and return the first part whose
inline_data has data. Raise a clear error if no image is produced. Keep the model id in ONE env var
so I can swap models without code changes.

utils/db.py — optional NeonDB (Postgres) persistence. is_enabled() is true only if DATABASE_URL is
set AND psycopg2 imports. get_conn() appends sslmode=require if missing (Neon needs SSL). Define a
single table `generations(id serial pk, kind text, topic text, language text, data jsonb,
created_at timestamptz default now())` plus indexes on kind and created_at. Provide init_db()
(idempotent CREATE TABLE IF NOT EXISTS), save_generation(kind, data, topic, language) and
recent_generations(kind=None, limit=20). EVERY db function must try/except and be a silent no-op
when disabled — persistence must never break a generation. Also write schema.sql and a small
init_db.py CLI ("python init_db.py" creates the schema; prints a notice if DATABASE_URL is unset).
There is NO seed data.

apiEndpoints.py — the Flask app. Enable permissive CORS. Mount Swagger UI at /docs reading an
OpenAPI 3.0 spec served at /openapi.json (keep the spec as a Python dict in openapi.py covering
every route with request/response schemas). Implement:
  POST /command   {transcript} -> detect_intent then dispatch to the right generator; respond
                  {intent, transcript, data}; persist the result.
  POST /simplify  {topic, language?, level?} -> simplify_concept; persist.
  POST /quiz      {topic, n?, type?, language?} -> generate_quiz; persist.
  POST /translate {text} -> translate_text; persist.
  POST /activity  {topic, language?} -> generate_activity; persist.
  POST /tts       {text, voice?} -> Response(wav, mimetype="audio/wav").
  POST /image     {prompt} -> Response(img, mimetype=mime).
  GET  /history   ?kind=&limit= -> {db_enabled, items}.
  GET  /health    -> {status:"ok", db_enabled}.
Validate inputs, return {"error": ...} with 400/500 on failure. The entrypoint must read
PORT from the environment (default 10000) and bind host 0.0.0.0 so it runs on a managed PaaS.
Verify it boots and /health responds; confirm /docs renders.
```

`▸ AFTER:` hit `/health`, open `/docs`, and probe each Gemini model id against your key (text,
TTS, image) — model availability changes, so **verify the exact ids your key supports** and put
the working ones in `.env`. If an image model 404s, switch `GEMINI_IMAGE_MODEL` (Gemini image
model ⇄ Imagen) without touching code.

---

## Prompt 4 — Frontend foundation: design system, API client & i18n (incl. Haryanvi)

`▸ DECIDE:` the **visual language**. This build uses a black, editorial, "art-gallery" aesthetic:
**Instrument Serif** display type + a reusable **`.liquid-glass`** frosted surface, with
framer-motion reveals. Also decide that **one language toggle re-localizes the UI *and* drives the
content language**, and that the browser never holds the API key.

```
Scaffold the web app in /frontend with create-next-app (Next.js 15 App Router, React 19,
JavaScript, Tailwind CSS v4 via @tailwindcss/postcss, ESLint). Add deps: framer-motion,
lucide-react, mermaid, jspdf, next-themes.

DESIGN SYSTEM (globals.css):
- Import Instrument Serif: @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
- Default everything to a pure black background.
- Add a reusable .liquid-glass component class and a .font-display helper. Use EXACTLY this CSS
  for the glass (it is the signature of the product):

  .liquid-glass {
    background: rgba(255, 255, 255, 0.01);
    background-blend-mode: luminosity;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
  }
  .liquid-glass::before {
    content: '';
    position: absolute; inset: 0; border-radius: inherit; padding: 1.4px;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%,
      rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none;
  }
  .font-display { font-family: 'Instrument Serif', ui-serif, Georgia, serif; font-weight: 400; }

  Also add: smooth `html { scroll-behavior: smooth }`, a `.text-balance` utility, an infinite
  `@keyframes marquee` + `.animate-marquee`, and a `@media (prefers-reduced-motion: reduce)` block
  that disables animations.

API CLIENT (src/lib/api.js): export API_BASE from process.env.NEXT_PUBLIC_API_BASE_URL, trimmed and
with trailing slashes stripped. Wrap fetch in a safeFetch() that converts the browser's opaque
"Failed to fetch" into an actionable message ("Cannot reach the backend at <URL> … is it running?").
Export typed helpers: runCommand(transcript), simplify(topic,language), quiz(topic,n,type,language),
translate(text), activity(topic,language), getHistory(limit,kind), fetchSpeech(text,voice) ->
playable object URL from a Blob, fetchImage(prompt) -> object URL from a Blob.

I18N (src/lib/i18n.js): a dictionary of UI strings for "english", "hindi", "hinglish", "haryanvi"
with fallback chains (haryanvi -> hindi -> english; hinglish -> english). Export LANGUAGES (id +
native label, e.g. हरियाणवी) and tr(language) returning the merged string table. Cover the smartboard
chrome: tabs, buttons, placeholders, status lines, the activity timer, the visual-aid panel labels,
and example commands. Write genuine Hindi and Devanagari-Haryanvi strings.

SITE-WIDE NAV (src/components/AppNav.jsx, client): a sticky liquid-glass top bar with brand
"Sahayak" + links Home / Smartboard / Quiz Studio / Test Generator / Dashboard, active-route
highlighting via usePathname, and a responsive mobile menu. This goes on every app page so users
can move back and forth without dead links.

Set NEXT_PUBLIC_API_BASE_URL in .env.local and document it. Verify lint + dev server boot.
```

`▸ AFTER:` confirm the language dropdown actually changes UI strings (not just content) and that
`API_BASE` is robust to a trailing slash / stray whitespace.

---

## Prompt 5 — The landing page (an "art-gallery" marketing site)

`▸ DECIDE:` the **narrative** of the page and that content is **strictly from the product brief**
(the four features, the user flow, the target users) — only the *visual style* is borrowed from a
reference. Decide perf budget: **lazy, in-viewport-only video** (IntersectionObserver) and a
**requestAnimationFrame crossfade** hero loop, not multiple always-playing videos.

```
Build the marketing landing page at app/page.js as a server component that composes client section
components in src/components/landing/. The whole page is bg-black. Use framer-motion `useInView`
({ once:true, margin:"-100px" }) for scroll reveals and the liquid-glass class throughout. Content
must come ONLY from our product brief (voice-first classroom assistant; Hindi/English/Hinglish/
Haryanvi; the 4 features; the teacher user flow; government smart classrooms; primary & secondary).

Sections, in order:
1. Hero (full min-h-screen): a background <video> (object-cover) with a SEAMLESS crossfade-to-black
   loop driven by vanilla refs + requestAnimationFrame (no CSS transitions): on `canplay` play and
   fade opacity 0→1 over 500ms; on `timeupdate` when remaining ≤0.55s fade 1→0 over 500ms; on
   `ended` reset currentTime and fade back in. Over it: the AppNav-style liquid-glass pill, an
   Instrument-Serif headline (text-6xl→9xl, with one italic <em>), a one-line value prop, primary CTA
   → /smartboard, and small feature chips (Voice commands · Hindi·English·Hinglish · Activity guides).
2. Marquee: an infinite .animate-marquee band of subjects/capabilities with an edge fade mask.
3. About: the problem statement (teachers lose hours writing/translating/quizzing by hand) with a
   radial-gradient overlay and animated headline.
4. Showcase: a rounded-3xl aspect-video featured video (use a LazyVideo component that plays only
   when in viewport via IntersectionObserver and respects reduced-motion) with a liquid-glass caption
   card and a CTA.
5. Features: a 2-col grid of the FOUR features as liquid-glass cards (icon, tag, title, description,
   ArrowUpRight), staggered reveals.
6. Philosophy: a two-column "Built for Bharat's classrooms" section (LazyVideo + two text blocks on
   speaking the class's language and staying with students).
7. UseCases: two liquid-glass video cards ("Explain & visualise", "Assess & translate") linking into
   the app, with group-hover scale on the video.
8. Steps: the user flow (Speak → Transcribe → Detect intent → Project → Narrate) as 5 numbered
   liquid-glass cards.
9. Stats band: large Instrument-Serif figures (3 languages · 4 tools · 0 keyboards · Live).
10. FAQ: an accessible accordion (framer-motion height animation) — languages, no typing, hardware,
    data/privacy (no tracking), reuse/export.
11. CTA: a big closing liquid-glass panel with a faint grain texture and the launch button.
12. Footer: brand, product links, social buttons, back-to-top.

Build a reusable LazyVideo component (preload="none", muted, loop, playsInline; attaches src and
plays on intersection, pauses off-screen). Keep it highly responsive (fluid type, mobile stacking)
and run lint clean.
```

`▸ AFTER:` view on mobile + desktop; confirm only the in-view video plays and the hero crossfade
loops without flashing. Swap the placeholder video URLs for your own footage when available.

---

## Prompt 6 — The Smartboard: the voice-first core

`▸ DECIDE:` that **STT is browser-side** (Web Speech API, `hi-IN` for Hindi/Haryanvi else `en-IN`),
that a **central command bar routes by intent** while each tab also works standalone, and the
visual-aid/image policy: **lazy + cached per item** (one image per question / per activity step,
generated on demand) to control latency and cost.

```
Build the flagship app at app/smartboard/page.js (client component). Layout: AppNav, then a control
header with the Instrument-Serif brand + a LANGUAGE selector (from i18n LANGUAGES), then a tab bar
(Voice Command, Explain Concept, Quiz, Translate, Activity Guide), then a persistent voice/text
command bar, a status line, and the active panel. Everything is bg-black + liquid-glass. Localize ALL
chrome via tr(language); the language selector drives BOTH the UI strings AND the content language.

VOICE: build STT on window.SpeechRecognition || webkitSpeechRecognition (lang = hi-IN for hindi or
haryanvi, else en-IN; non-continuous). The mic button transcribes one utterance, fills the command
box, and calls runCommand(transcript). Show the detected intent. Route the {intent,data} response to
the matching panel. Each tab also has its own input that calls the specific endpoint directly.

TTS: a narrate(text) that calls fetchSpeech and plays the returned WAV via a hidden <audio>; use a
Devanagari-friendly voice for hindi/haryanvi.

PANELS:
- Explain Concept: explanation + numbered key points (left) and a "Visual Aid" panel (right) that
  renders the Mermaid `diagram` via a dynamically-imported, SSR-safe <Mermaid> component (mermaid.render
  to SVG, dark theme, graceful raw-source fallback). A Narrate button reads the explanation.
- Quiz: a 3-column layout — questions on the left (each clickable; answers hidden by default with a
  Reveal/Reveal-all toggle and a per-question read-aloud), and a sticky right-hand "Visual Aid" panel.
  Clicking a question LAZILY generates an illustration for THAT question via fetchImage (prompt =
  "simple colourful classroom illustration, minimal text, topic + question"), cached by index, with
  loading/error/Regenerate states. Free object URLs and reset on new quiz.
- Translate: a textarea + two side-by-side liquid-glass cards (English | हिन्दी), each with Read-aloud.
- Activity Guide: a hands-free experience. Show materials chips, step progress dots, and a big
  current-step card. To the right of the step, LAZILY generate a per-step illustration (a visual
  storyboard) via fetchImage, auto-drawing the current step as you navigate, with a "Visuals" toggle
  and per-step Regenerate. Add Previous / Repeat / Next controls. Build an imperative <ClassTimer>
  (forwardRef + useImperativeHandle exposing start/pause/reset) — an on-screen countdown for
  experiments. Add a hands-free mode: a continuous-ish recognizer that maps spoken "next"/"previous"/
  "repeat"/"start timer" (and Hindi cues दोबारा/पिछला/अगला) to navigation + timer control. CRITICAL:
  use refs (navModeRef, stepRef, stepsRef) mirrored from state so the SpeechRecognition callbacks never
  read stale closures, and auto-restart recognition in onend while hands-free is on.

Keep it responsive and projector-friendly (large type on the active step). Run lint clean.
```

`▸ AFTER:` test end-to-end with a mic in a Chromium browser: speak a command in each language,
confirm intent routing, Mermaid diagrams, per-question images, activity step images, the timer, and
hands-free "next/repeat" navigation.

---

## Prompt 7 — Quiz Studio, Test Generator, Dashboard hub & deployment

`▸ DECIDE:` the **deployment topology** — backend on a managed PaaS that injects `PORT` (e.g. Render),
web app on an edge/static host (e.g. Cloudflare Pages / Vercel) — and that the web app reaches the
API purely via `NEXT_PUBLIC_API_BASE_URL` (no localhost baked in for production). Also decide the
dashboard is a **useful hub** (links + real history feed), not mock analytics.

```
Build the remaining pages, a consistent shell, and ship it.

1. Quiz Studio (app/quiz/page.js, client): AppNav + a liquid-glass generator (topic, count, type,
   language incl. Hinglish/Haryanvi) calling quiz(...). Render an INTERACTIVE, auto-scored MCQ player:
   selectable options, Submit → highlight correct/incorrect + score, Retake.

2. Test Generator (app/test-generate/page.js, client): AppNav + generate short-answer questions via
   quiz(topic,n,"short",language); toggle answer visibility; EXPORT to PDF with jsPDF in two modes —
   a blank question paper and an answer key (paginate with splitTextToSize).

3. Dashboard (app/dashboard/, App Router layout + page): a clean hub styled EXACTLY like the landing
   (bg-black, liquid-glass, Instrument Serif) — NOT a mock analytics dashboard. The layout renders
   AppNav. The page shows a display heading, three tool cards (Smartboard, Quiz Studio, Test Generator),
   and a "Recent activity" feed fetched from getHistory() with graceful states for loading / DB-not-
   configured / empty. Do not build attendance/grades/videos/etc. — they are out of scope.

4. Metadata: set app title/description to the product; ensure the landing CTA, AppNav, and dashboard
   all interlink so a user can navigate back and forth with zero dead routes.

5. DEPLOYMENT:
   - Backend: ensure the entrypoint binds host 0.0.0.0 and reads PORT from env (default 10000).
     Document build = `pip install -r requirements.txt`, start = `python apiEndpoints.py`, and set
     GEMINI_API_KEY (+ optional model overrides + DATABASE_URL) as platform env vars. Run init_db.py
     once if using Neon. Keep CORS permissive (or restrict to the web origin for production).
   - Frontend: set NEXT_PUBLIC_API_BASE_URL to the deployed API origin (no trailing slash) as a
     build-time env var on the host. Remember NEXT_PUBLIC_* is inlined at build → redeploy after changes.
   - Write a README (setup, env, API reference, Swagger link) and a .env.example for each service.

6. VERIFY: run the frontend production build and ESLint clean; curl every backend route incl. /image
   and /tts; confirm /docs renders; confirm the deployed web app reaches the deployed API.
```

`▸ AFTER:` smoke-test the deployed URLs. Confirm the API key never appears in the browser bundle,
that `/history` shows entries once `DATABASE_URL` is set, and that swapping `GEMINI_IMAGE_MODEL` /
`GEMINI_TEXT_MODEL` in platform env (then redeploy) changes models with zero code edits.

---

## Appendix — Standing instructions to keep the agent on-rails

- **Provider discipline**: "Gemini only via `google-genai`. No OpenAI/Groq/LangChain, no embeddings,
  no vector DB, no RAG. If you need another capability, find the Gemini way."
- **Structured outputs**: "Generators must return strict JSON (`response_mime_type=application/json`)
  with a fenced-block fallback; never have the frontend parse prose."
- **Config & secrets**: "Every model id is an env var. The Gemini key is server-side only. The web
  app talks to the API solely through `NEXT_PUBLIC_API_BASE_URL`."
- **Graceful degradation**: "The app must run with no database and with voice unsupported (typed
  fallback). Persistence failures must never break a generation."
- **Verification gate**: "After each phase: lint clean, production build passes, and the new routes
  respond. Show me the diff and the verification output before moving on."
- **Scope guard**: "If a request implies attendance/grades/LMS/auth/analytics, stop and flag it as
  out of scope."