"""
Voice-Enabled AI Teaching Assistant — Flask API.

Powered entirely by Google Gemini (text + native TTS), with optional NeonDB
persistence for a history of generated content.

Endpoints (see README.md for full docs):
    POST /command    -> detect intent from a voice transcript and run it
    POST /simplify    -> Live Concept Simplification (Hinglish + diagram)
    POST /quiz        -> Voice-Triggered Quiz Generation
    POST /translate   -> Bilingual Dictation & Translation (Hindi/English)
    POST /activity    -> Hands-Free Activity Guide (step-by-step)
    POST /tts         -> Text-to-speech (Gemini), returns WAV audio
    GET  /history     -> recent generated content (from NeonDB, if configured)
    GET  /health      -> health/config check
"""
import os
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from dotenv import load_dotenv

from utils.gemini import (
    simplify_concept,
    generate_quiz,
    translate_text,
    generate_activity,
    detect_intent,
)
from utils.tts import text_to_speech
from utils import db
from openapi import OPENAPI_SPEC

load_dotenv()

app = Flask(__name__)
CORS(app)

# ---- Swagger UI (interactive API docs at /docs) ----
SWAGGER_URL = "/docs"
API_SPEC_URL = "/openapi.json"
app.register_blueprint(
    get_swaggerui_blueprint(
        SWAGGER_URL,
        API_SPEC_URL,
        config={"app_name": "AI Teaching Assistant API"},
    ),
    url_prefix=SWAGGER_URL,
)


@app.route(API_SPEC_URL)
def openapi_spec():
    return jsonify(OPENAPI_SPEC)


# ---------------------------------------------------------------------------
# 1. Live Concept Simplification
# ---------------------------------------------------------------------------
@app.route("/simplify", methods=["POST"])
def simplify():
    data = request.get_json(silent=True) or {}
    topic = (data.get("topic") or "").strip()
    language = data.get("language", "hinglish")
    level = data.get("level", "secondary")
    if not topic:
        return jsonify({"error": "topic is required"}), 400
    try:
        result = simplify_concept(topic, language=language, level=level)
        db.save_generation("simplify", result, topic=topic, language=language)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------------------------
# 2. Voice-Triggered Quiz Generation
# ---------------------------------------------------------------------------
@app.route("/quiz", methods=["POST"])
def quiz():
    data = request.get_json(silent=True) or {}
    topic = (data.get("topic") or "").strip()
    n = data.get("n", 5)
    qtype = data.get("type", "mcq")
    language = data.get("language", "english")
    if not topic:
        return jsonify({"error": "topic is required"}), 400
    try:
        n = int(n)
    except (TypeError, ValueError):
        n = 5
    try:
        result = generate_quiz(topic, n=n, qtype=qtype, language=language)
        db.save_generation("quiz", result, topic=topic, language=language)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------------------------
# 3. Bilingual Dictation & Translation
# ---------------------------------------------------------------------------
@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    if not text:
        return jsonify({"error": "text is required"}), 400
    try:
        result = translate_text(text)
        db.save_generation("translate", result, topic=text[:80])
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------------------------
# 4. Hands-Free Activity Guide
# ---------------------------------------------------------------------------
@app.route("/activity", methods=["POST"])
def activity():
    data = request.get_json(silent=True) or {}
    topic = (data.get("topic") or "").strip()
    language = data.get("language", "english")
    if not topic:
        return jsonify({"error": "topic is required"}), 400
    try:
        result = generate_activity(topic, language=language)
        db.save_generation("activity", result, topic=topic, language=language)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------------------------
# Central voice-command router (the scope.md "identify intent" step)
# ---------------------------------------------------------------------------
@app.route("/command", methods=["POST"])
def command():
    data = request.get_json(silent=True) or {}
    transcript = (data.get("transcript") or "").strip()
    if not transcript:
        return jsonify({"error": "transcript is required"}), 400
    try:
        parsed = detect_intent(transcript)
        intent = parsed["intent"]

        if intent == "simplify":
            result = simplify_concept(parsed["topic"] or transcript, language=parsed["language"])
            db.save_generation("simplify", result, topic=parsed["topic"], language=parsed["language"])
        elif intent == "quiz":
            result = generate_quiz(
                parsed["topic"] or transcript,
                n=parsed["n"], qtype=parsed["qtype"], language=parsed["language"],
            )
            db.save_generation("quiz", result, topic=parsed["topic"], language=parsed["language"])
        elif intent == "translate":
            result = translate_text(parsed["text"] or parsed["topic"] or transcript)
            db.save_generation("translate", result, topic=(parsed["text"] or transcript)[:80])
        elif intent == "activity":
            result = generate_activity(parsed["topic"] or transcript, language=parsed["language"])
            db.save_generation("activity", result, topic=parsed["topic"], language=parsed["language"])
        else:
            return jsonify({"intent": "unknown", "transcript": transcript,
                            "message": "Could not understand the command."})

        return jsonify({"intent": intent, "transcript": transcript, "data": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------------------------
# Text-to-speech
# ---------------------------------------------------------------------------
@app.route("/tts", methods=["POST"])
def tts():
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    voice = data.get("voice")
    if not text:
        return jsonify({"error": "text is required"}), 400
    try:
        audio = text_to_speech(text, voice=voice)
        return Response(audio, mimetype="audio/wav")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------------------------------
# History (optional, requires NeonDB)
# ---------------------------------------------------------------------------
@app.route("/history", methods=["GET"])
def history():
    kind = request.args.get("kind")
    try:
        limit = int(request.args.get("limit", 20))
    except (TypeError, ValueError):
        limit = 20
    return jsonify({"db_enabled": db.is_enabled(),
                    "items": db.recent_generations(kind=kind, limit=limit)})


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "db_enabled": db.is_enabled()})

if __name__ == "__main__":
    port = int(os.getenv("PORT", 10000))
    app.run(host="0.0.0.0", port=port)