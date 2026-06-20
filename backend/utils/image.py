"""
Image generation for classroom "visual aids" using Google Gemini.

Uses the Gemini image model (default: gemini-2.5-flash-image) to produce a
PNG illustration for a quiz question / concept. Returns raw image bytes.
"""

import os

from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
IMAGE_MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "imagen-3.0-generate-001")

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


def generate_image(prompt):
    """
    Generate an illustration for `prompt`.

    Returns (image_bytes, mime_type). Raises if no image was produced.
    """
    client = get_client()
    if "imagen" in IMAGE_MODEL.lower():
        resp = client.models.generate_images(
            model=IMAGE_MODEL,
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                output_mime_type="image/jpeg",
            )
        )
        if not resp.generated_images:
            raise RuntimeError("The image model did not return an image.")
        img = resp.generated_images[0].image
        return img.image_bytes, (img.mime_type or "image/jpeg")
    else:
        resp = client.models.generate_content(
            model=IMAGE_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
        )
        parts = resp.candidates[0].content.parts if resp.candidates else []
        for part in parts:
            inline = getattr(part, "inline_data", None)
            if inline and inline.data:
                return inline.data, (inline.mime_type or "image/png")
        raise RuntimeError("The image model did not return an image.")
