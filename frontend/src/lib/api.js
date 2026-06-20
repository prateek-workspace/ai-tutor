// Central client for the Voice-Enabled AI Teaching Assistant backend.
// Override the base URL with NEXT_PUBLIC_API_BASE_URL when deploying.

// The backend defaults to port 10000 (see apiEndpoints.py: os.getenv("PORT", 10000)).
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || `https://127.0.0.1:10000`;

// Turns the browser's cryptic "Failed to fetch" into something a teacher can act on.
const UNREACHABLE = (path) =>
  `Cannot reach the backend at ${API_BASE}. ` +
  `Make sure the Flask server is running (in /backend: python apiEndpoints.py — it listens on port 10000), ` +
  `and that NEXT_PUBLIC_API_BASE_URL points to it.`;

async function safeFetch(path, options) {
  try {
    return await fetch(`${API_BASE}${path}`, options);
  } catch (e) {
    // A TypeError here means the request never reached the server (network/CORS/down).
    throw new Error(UNREACHABLE(path));
  }
}

async function postJSON(path, body) {
  const res = await safeFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`The backend returned an unexpected response (HTTP ${res.status}).`);
  }
  if (!res.ok || data.error) {
    throw new Error(data.error || `Request to ${path} failed (HTTP ${res.status}).`);
  }
  return data;
}

// ---- scope.md feature calls ----
export const runCommand = (transcript) => postJSON("/command", { transcript });
export const simplify = (topic, language = "hinglish") =>
  postJSON("/simplify", { topic, language });
export const quiz = (topic, n = 5, type = "mcq", language = "english") =>
  postJSON("/quiz", { topic, n, type, language });
export const translate = (text) => postJSON("/translate", { text });
export const activity = (topic, language = "english") =>
  postJSON("/activity", { topic, language });

// ---- Gemini text-to-speech: returns a playable object URL ----
export async function fetchSpeech(text, voice) {
  const res = await safeFetch("/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice }),
  });
  if (!res.ok) throw new Error(`Narration failed (HTTP ${res.status}).`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

// ---- Recent generated content (from NeonDB, if configured) ----
export async function getHistory(limit = 12, kind) {
  const q = kind ? `?kind=${encodeURIComponent(kind)}&limit=${limit}` : `?limit=${limit}`;
  const res = await safeFetch(`/history${q}`, { method: "GET" });
  if (!res.ok) throw new Error(`Could not load history (HTTP ${res.status}).`);
  return res.json();
}

// ---- Gemini image generation: returns a displayable object URL ----
export async function fetchImage(prompt) {
  const res = await safeFetch("/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) {
    let msg = `Image generation failed (HTTP ${res.status}).`;
    try { const d = await res.json(); if (d.error) msg = d.error; } catch {}
    throw new Error(msg);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
