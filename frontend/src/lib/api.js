// Central client for the Voice-Enabled AI Teaching Assistant backend.
// Override the base URL with NEXT_PUBLIC_API_BASE_URL when deploying.

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

async function postJSON(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || `Request to ${path} failed`);
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
  const res = await fetch(`${API_BASE}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice }),
  });
  if (!res.ok) throw new Error("TTS request failed");
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
