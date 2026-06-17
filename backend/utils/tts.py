"""
Text-to-speech using Google Gemini's native TTS models.

Gemini TTS returns raw 16-bit PCM audio (mono, 24 kHz). Browsers can't play
bare PCM, so we wrap it in a WAV container before sending it back.
"""

import io
import os
import wave

from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
TTS_MODEL = os.environ.get("GEMINI_TTS_MODEL", "gemini-2.5-flash-preview-tts")
# Prebuilt Gemini voices include: Kore, Puck, Charon, Aoede, Fenrir, Leda, etc.
TTS_VOICE = os.environ.get("GEMINI_TTS_VOICE", "Kore")

# Gemini TTS audio format constants.
SAMPLE_RATE = 24000
SAMPLE_WIDTH = 2  # 16-bit
CHANNELS = 1

_client = None


def get_client():
    global _client
    if _client is None:
        if not GEMINI_API_KEY:
            raise RuntimeError(
                "GEMINI_API_KEY (or GOOGLE_API_KEY) is not set. Add it to backend/.env"
            )
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def _pcm_to_wav(pcm_bytes):
    """Wrap raw PCM in a WAV container and return the bytes."""
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(SAMPLE_WIDTH)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(pcm_bytes)
    return buf.getvalue()


def text_to_speech(text, voice=None):
    """
    Synthesize speech for `text` using Gemini TTS.

    Returns WAV audio as bytes (mimetype: audio/wav).
    """
    voice = voice or TTS_VOICE
    resp = get_client().models.generate_content(
        model=TTS_MODEL,
        contents=text,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice)
                )
            ),
        ),
    )
    pcm = resp.candidates[0].content.parts[0].inline_data.data
    return _pcm_to_wav(pcm)
