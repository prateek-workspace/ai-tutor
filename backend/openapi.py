"""OpenAPI 3.0 spec for the Voice-Enabled AI Teaching Assistant API.

Served as JSON at /openapi.json and rendered by Swagger UI at /docs.
"""

OPENAPI_SPEC = {
    "openapi": "3.0.3",
    "info": {
        "title": "Voice-Enabled AI Teaching Assistant API",
        "version": "1.0.0",
        "description": (
            "Gemini-powered backend for a voice-first smart-classroom assistant. "
            "All content is generated live by Google Gemini; optional NeonDB stores history."
        ),
    },
    "servers": [{"url": "http://127.0.0.1:5000", "description": "Local development"}],
    "tags": [
        {"name": "Assistant", "description": "Core teaching features (scope.md)"},
        {"name": "Speech", "description": "Text-to-speech"},
        {"name": "System", "description": "History & health"},
    ],
    "paths": {
        "/command": {
            "post": {
                "tags": ["Assistant"],
                "summary": "Voice command router",
                "description": "Detect the intent of a spoken/typed command and run the matching feature.",
                "requestBody": {
                    "required": True,
                    "content": {"application/json": {"schema": {
                        "type": "object",
                        "required": ["transcript"],
                        "properties": {"transcript": {"type": "string", "example": "Explain photosynthesis in Hinglish"}},
                    }}},
                },
                "responses": {
                    "200": {"description": "Detected intent and generated content", "content": {"application/json": {"schema": {
                        "type": "object",
                        "properties": {
                            "intent": {"type": "string", "enum": ["simplify", "quiz", "translate", "activity", "unknown"]},
                            "transcript": {"type": "string"},
                            "data": {"type": "object"},
                        },
                    }}}},
                    "400": {"$ref": "#/components/responses/BadRequest"},
                    "500": {"$ref": "#/components/responses/ServerError"},
                },
            }
        },
        "/simplify": {
            "post": {
                "tags": ["Assistant"],
                "summary": "Live Concept Simplification",
                "description": "Explain a concept in Hinglish/Hindi/English with key points and a Mermaid diagram.",
                "requestBody": {"required": True, "content": {"application/json": {"schema": {
                    "type": "object",
                    "required": ["topic"],
                    "properties": {
                        "topic": {"type": "string", "example": "Photosynthesis"},
                        "language": {"type": "string", "enum": ["hinglish", "hindi", "english"], "default": "hinglish"},
                        "level": {"type": "string", "default": "secondary"},
                    },
                }}}},
                "responses": {
                    "200": {"description": "Concept explanation", "content": {"application/json": {"schema": {
                        "type": "object",
                        "properties": {
                            "topic": {"type": "string"},
                            "language": {"type": "string"},
                            "explanation": {"type": "string"},
                            "key_points": {"type": "array", "items": {"type": "string"}},
                            "diagram": {"type": "string", "description": "Mermaid.js source"},
                        },
                    }}}},
                    "400": {"$ref": "#/components/responses/BadRequest"},
                    "500": {"$ref": "#/components/responses/ServerError"},
                },
            }
        },
        "/quiz": {
            "post": {
                "tags": ["Assistant"],
                "summary": "Voice-Triggered Quiz Generation",
                "description": "Generate MCQ or short-answer questions on a topic.",
                "requestBody": {"required": True, "content": {"application/json": {"schema": {
                    "type": "object",
                    "required": ["topic"],
                    "properties": {
                        "topic": {"type": "string", "example": "The Water Cycle"},
                        "n": {"type": "integer", "default": 5},
                        "type": {"type": "string", "enum": ["mcq", "short"], "default": "mcq"},
                        "language": {"type": "string", "default": "english"},
                    },
                }}}},
                "responses": {
                    "200": {"description": "Generated questions", "content": {"application/json": {"schema": {
                        "type": "object",
                        "properties": {
                            "topic": {"type": "string"},
                            "type": {"type": "string"},
                            "language": {"type": "string"},
                            "questions": {"type": "array", "items": {"type": "object"}},
                        },
                    }}}},
                    "400": {"$ref": "#/components/responses/BadRequest"},
                    "500": {"$ref": "#/components/responses/ServerError"},
                },
            }
        },
        "/translate": {
            "post": {
                "tags": ["Assistant"],
                "summary": "Bilingual Dictation & Translation",
                "description": "Translate content into Hindi and English for side-by-side display.",
                "requestBody": {"required": True, "content": {"application/json": {"schema": {
                    "type": "object",
                    "required": ["text"],
                    "properties": {"text": {"type": "string", "example": "The mitochondria is the powerhouse of the cell."}},
                }}}},
                "responses": {
                    "200": {"description": "Hindi + English", "content": {"application/json": {"schema": {
                        "type": "object",
                        "properties": {
                            "original": {"type": "string"},
                            "hindi": {"type": "string"},
                            "english": {"type": "string"},
                        },
                    }}}},
                    "400": {"$ref": "#/components/responses/BadRequest"},
                    "500": {"$ref": "#/components/responses/ServerError"},
                },
            }
        },
        "/activity": {
            "post": {
                "tags": ["Assistant"],
                "summary": "Hands-Free Activity Guide",
                "description": "Generate a step-by-step classroom activity navigable by voice.",
                "requestBody": {"required": True, "content": {"application/json": {"schema": {
                    "type": "object",
                    "required": ["topic"],
                    "properties": {
                        "topic": {"type": "string", "example": "Show that air has weight"},
                        "language": {"type": "string", "default": "english"},
                    },
                }}}},
                "responses": {
                    "200": {"description": "Activity steps", "content": {"application/json": {"schema": {
                        "type": "object",
                        "properties": {
                            "topic": {"type": "string"},
                            "title": {"type": "string"},
                            "materials": {"type": "array", "items": {"type": "string"}},
                            "steps": {"type": "array", "items": {"type": "string"}},
                        },
                    }}}},
                    "400": {"$ref": "#/components/responses/BadRequest"},
                    "500": {"$ref": "#/components/responses/ServerError"},
                },
            }
        },
        "/tts": {
            "post": {
                "tags": ["Speech"],
                "summary": "Text-to-Speech (Gemini)",
                "description": "Synthesize speech and return WAV audio.",
                "requestBody": {"required": True, "content": {"application/json": {"schema": {
                    "type": "object",
                    "required": ["text"],
                    "properties": {
                        "text": {"type": "string", "example": "Namaste class"},
                        "voice": {"type": "string", "example": "Kore"},
                    },
                }}}},
                "responses": {
                    "200": {"description": "WAV audio", "content": {"audio/wav": {"schema": {"type": "string", "format": "binary"}}}},
                    "400": {"$ref": "#/components/responses/BadRequest"},
                    "500": {"$ref": "#/components/responses/ServerError"},
                },
            }
        },
        "/history": {
            "get": {
                "tags": ["System"],
                "summary": "Recent generated content",
                "description": "Returns recent generations from NeonDB (empty if no DB configured).",
                "parameters": [
                    {"name": "kind", "in": "query", "schema": {"type": "string", "enum": ["simplify", "quiz", "translate", "activity"]}},
                    {"name": "limit", "in": "query", "schema": {"type": "integer", "default": 20}},
                ],
                "responses": {"200": {"description": "History list", "content": {"application/json": {"schema": {
                    "type": "object",
                    "properties": {
                        "db_enabled": {"type": "boolean"},
                        "items": {"type": "array", "items": {"type": "object"}},
                    },
                }}}}},
            }
        },
        "/health": {
            "get": {
                "tags": ["System"],
                "summary": "Health check",
                "responses": {"200": {"description": "OK", "content": {"application/json": {"schema": {
                    "type": "object",
                    "properties": {"status": {"type": "string"}, "db_enabled": {"type": "boolean"}},
                }}}}},
            }
        },
    },
    "components": {
        "responses": {
            "BadRequest": {"description": "Missing or invalid input", "content": {"application/json": {"schema": {
                "type": "object", "properties": {"error": {"type": "string"}}}}}},
            "ServerError": {"description": "Generation/server error", "content": {"application/json": {"schema": {
                "type": "object", "properties": {"error": {"type": "string"}}}}}},
        }
    },
}
