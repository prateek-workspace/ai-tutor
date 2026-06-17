"""
Gemini text-generation helpers for the Voice-Enabled AI Teaching Assistant.

Everything in this module is powered by Google Gemini through the unified
`google-genai` SDK. It implements the four scope.md features:

  1. Live Concept Simplification  -> simplify_concept()
  2. Voice-Triggered Quiz          -> generate_quiz()
  3. Bilingual Translation         -> translate_text()
  4. Hands-Free Activity Guide     -> generate_activity()

Plus voice command intent detection -> detect_intent(), which powers the
"AI identifies the command intent" step of the scope.md user flow.
"""

import os
import json

from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# The new SDK reads GEMINI_API_KEY (or GOOGLE_API_KEY) automatically, but we
# pass it explicitly so configuration is obvious and fails loudly if missing.
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
TEXT_MODEL = os.environ.get("GEMINI_TEXT_MODEL", "gemini-2.0-flash")

_client = None


def get_client():
    """Lazily create and cache a single Gemini client."""
    global _client
    if _client is None:
        if not GEMINI_API_KEY:
            raise RuntimeError(
                "GEMINI_API_KEY (or GOOGLE_API_KEY) is not set. Add it to backend/.env"
            )
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def _generate_text(prompt, system_instruction=None, temperature=0.7):
    """Plain text generation."""
    resp = get_client().models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=temperature,
        ),
    )
    return (resp.text or "").strip()


def _generate_json(prompt, system_instruction=None, temperature=0.4):
    """Generation constrained to a JSON response, parsed into Python."""
    resp = get_client().models.generate_content(
        model=TEXT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=temperature,
            response_mime_type="application/json",
        ),
    )
    raw = (resp.text or "").strip()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Best-effort: strip markdown fences if the model added them.
        cleaned = raw.strip().lstrip("`").rstrip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
        return json.loads(cleaned)


# ---------------------------------------------------------------------------
# 1. Live Concept Simplification
# ---------------------------------------------------------------------------
def simplify_concept(topic, language="hinglish", level="secondary"):
    """
    Generate a student-friendly explanation of a concept plus key points and a
    Mermaid diagram (concept map / flowchart) for the smartboard.

    Returns: { topic, language, explanation, key_points: [...], diagram: "<mermaid>" }
    """
    lang_instruction = {
        "hinglish": "conversational Hinglish (Hindi-English mix, written in Roman script)",
        "hindi": "simple Hindi (Devanagari script)",
        "english": "simple English",
    }.get(language, "conversational Hinglish")

    system = (
        "You are a friendly Indian government-school teacher's AI co-pilot. "
        "You explain concepts so a "
        f"{level}-level student understands instantly. Keep it warm and concrete, "
        "use everyday Indian classroom examples."
    )
    prompt = f"""Explain the topic "{topic}" for the classroom smartboard.

Respond ONLY as JSON with this exact shape:
{{
  "explanation": "a clear {lang_instruction} explanation, 4-7 short sentences",
  "key_points": ["3 to 6 short bullet points students should remember"],
  "diagram": "a valid Mermaid.js diagram (flowchart TD or mindmap) that visualises the concept. Use only ASCII, no markdown fences."
}}

The explanation MUST be in {lang_instruction}."""

    data = _generate_json(prompt, system_instruction=system)
    return {
        "topic": topic,
        "language": language,
        "explanation": data.get("explanation", ""),
        "key_points": data.get("key_points", []),
        "diagram": _clean_mermaid(data.get("diagram", "")),
    }


def _clean_mermaid(diagram):
    """Strip code fences the model sometimes wraps Mermaid in."""
    if not diagram:
        return ""
    d = diagram.strip()
    if d.startswith("```"):
        d = d.strip("`")
        if d.lower().startswith("mermaid"):
            d = d[len("mermaid"):]
    return d.strip()


# ---------------------------------------------------------------------------
# 2. Voice-Triggered Quiz Generation
# ---------------------------------------------------------------------------
def generate_quiz(topic, n=5, qtype="mcq", language="english"):
    """
    Generate `n` questions about `topic`.

    qtype: "mcq" -> multiple choice (4 options + answer)
           "short" -> short-answer questions (question + answer)

    Returns: { topic, type, language, questions: [...] }
    """
    if qtype == "short":
        shape = """[
  {"question": "the question", "answer": "the expected short answer"}
]"""
    else:
        shape = """[
  {"question": "the question",
   "options": ["option A", "option B", "option C", "option D"],
   "answer": "the exact text of the correct option"}
]"""

    system = "You are an exam-setter for Indian school classrooms. Questions are clear and unambiguous."
    prompt = f"""Generate exactly {n} {('short-answer' if qtype == 'short' else 'multiple-choice')} questions about "{topic}".
Write the questions in {language}.

Respond ONLY as a JSON array with this exact shape:
{shape}"""

    questions = _generate_json(prompt, system_instruction=system)
    if isinstance(questions, dict):  # model occasionally wraps in a key
        questions = questions.get("questions", [])
    return {"topic": topic, "type": qtype, "language": language, "questions": questions}


# ---------------------------------------------------------------------------
# 3. Bilingual Dictation & Translation
# ---------------------------------------------------------------------------
def translate_text(text):
    """
    Produce Hindi and English versions of the input text (whatever language it
    arrives in), for side-by-side smartboard display.

    Returns: { original, hindi, english }
    """
    system = "You are a precise bilingual (Hindi/English) classroom translator."
    prompt = f"""Take the following classroom content and produce faithful Hindi and English versions.

Content:
\"\"\"{text}\"\"\"

Respond ONLY as JSON:
{{
  "hindi": "the content in natural Hindi (Devanagari)",
  "english": "the content in natural English"
}}"""

    data = _generate_json(prompt, system_instruction=system, temperature=0.2)
    return {
        "original": text,
        "hindi": data.get("hindi", ""),
        "english": data.get("english", ""),
    }


# ---------------------------------------------------------------------------
# 4. Hands-Free Activity Guide
# ---------------------------------------------------------------------------
def generate_activity(topic, language="english"):
    """
    Generate step-by-step instructions for a classroom activity/experiment so a
    teacher can navigate them hands-free ("Next Step" / "Repeat Step").

    Returns: { topic, title, materials: [...], steps: [...] }
    """
    system = (
        "You design safe, low-cost, hands-on classroom activities for Indian "
        "government schools using easily available materials."
    )
    prompt = f"""Design a classroom activity/experiment for: "{topic}".
Write it in {language}.

Respond ONLY as JSON:
{{
  "title": "a short activity title",
  "materials": ["items needed, cheap and commonly available"],
  "steps": ["clear, ordered, one-action-each instructions a teacher reads aloud"]
}}"""

    data = _generate_json(prompt, system_instruction=system)
    return {
        "topic": topic,
        "title": data.get("title", topic),
        "materials": data.get("materials", []),
        "steps": data.get("steps", []),
    }


# ---------------------------------------------------------------------------
# Voice command intent detection
# ---------------------------------------------------------------------------
VALID_INTENTS = {"simplify", "quiz", "translate", "activity", "unknown"}


def detect_intent(transcript):
    """
    Classify a teacher's spoken command (Hindi/English/Hinglish) into an intent
    and extract its parameters.

    Returns: { intent, topic, text, n, qtype, language }
    """
    system = (
        "You route voice commands from a teacher to the correct classroom tool. "
        "The teacher may speak Hindi, English or Hinglish."
    )
    prompt = f"""A teacher said: "{transcript}"

Classify the command into exactly one intent and extract parameters.

Intents:
- "simplify": explain/teach a concept or topic.
- "quiz": make a quiz / questions / test on a topic.
- "translate": translate or convert some text/content between Hindi and English.
- "activity": create a classroom activity/experiment with steps.
- "unknown": none of the above.

Respond ONLY as JSON:
{{
  "intent": "simplify | quiz | translate | activity | unknown",
  "topic": "the subject/topic, empty string if none",
  "text": "the text to translate (only for translate intent), else empty string",
  "n": number of questions if a quiz is requested else 5,
  "qtype": "mcq or short (for quiz), else mcq",
  "language": "hinglish | hindi | english based on what the teacher wants, default hinglish"
}}"""

    data = _generate_json(prompt, system_instruction=system, temperature=0.1)
    intent = data.get("intent", "unknown")
    if intent not in VALID_INTENTS:
        intent = "unknown"
    return {
        "intent": intent,
        "topic": data.get("topic", "").strip(),
        "text": data.get("text", "").strip(),
        "n": int(data.get("n", 5) or 5),
        "qtype": data.get("qtype", "mcq"),
        "language": data.get("language", "hinglish"),
    }
