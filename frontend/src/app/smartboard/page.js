"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Mic, MicOff, Volume2, Loader2, Sparkles, ListChecks,
  Languages, FlaskConical, ChevronLeft, ChevronRight, RotateCcw,
} from "lucide-react";
import {
  runCommand, simplify, quiz, translate, activity, fetchSpeech,
} from "@/lib/api";

const Mermaid = dynamic(() => import("@/components/Mermaid"), { ssr: false });

const TABS = [
  { id: "voice", label: "Voice Command", icon: Mic },
  { id: "simplify", label: "Explain Concept", icon: Sparkles },
  { id: "quiz", label: "Quiz", icon: ListChecks },
  { id: "translate", label: "Translate", icon: Languages },
  { id: "activity", label: "Activity Guide", icon: FlaskConical },
];

export default function Smartboard() {
  const [tab, setTab] = useState("voice");
  const [language, setLanguage] = useState("hinglish");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastIntent, setLastIntent] = useState("");

  // results
  const [concept, setConcept] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [activityStep, setActivityStep] = useState(0);

  // text inputs for manual tabs
  const [topicInput, setTopicInput] = useState("");
  const [translateInput, setTranslateInput] = useState("");
  const [quizCount, setQuizCount] = useState(5);
  const [quizType, setQuizType] = useState("mcq");

  // voice
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [navMode, setNavMode] = useState(false); // hands-free activity navigation
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  // Refs mirror state so the speech-recognition callbacks never read stale values.
  const navModeRef = useRef(false);
  const stepRef = useRef(0);
  const stepsRef = useRef([]);

  const sttLang = language === "hindi" ? "hi-IN" : "en-IN";

  useEffect(() => { navModeRef.current = navMode; }, [navMode]);
  useEffect(() => { stepRef.current = activityStep; }, [activityStep]);
  useEffect(() => { stepsRef.current = activityData?.steps || []; }, [activityData]);

  // ---- Speech recognition setup ----
  const getRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = sttLang;
    return rec;
  }, [sttLang]);

  // ---- Generic runner ----
  const run = async (fn) => {
    setLoading(true);
    setError("");
    try {
      return await fn();
    } catch (e) {
      setError(e.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const showConcept = (data) => { setConcept(data); setTab("simplify"); };
  const showQuiz = (data) => { setQuizData(data); setTab("quiz"); };
  const showTranslation = (data) => { setTranslation(data); setTab("translate"); };
  const showActivity = (data) => { setActivityData(data); setActivityStep(0); setTab("activity"); };

  // ---- Voice command: detect intent on backend, then route ----
  const handleVoiceCommand = async (text) => {
    if (!text.trim()) return;
    setLastIntent("");
    const data = await run(() => runCommand(text));
    if (!data) return;
    setLastIntent(data.intent);
    if (data.intent === "simplify") showConcept(data.data);
    else if (data.intent === "quiz") showQuiz(data.data);
    else if (data.intent === "translate") showTranslation(data.data);
    else if (data.intent === "activity") showActivity(data.data);
    else setError("Could not understand the command. Please try rephrasing.");
  };

  // ---- Activity hands-free navigation keywords ----
  const handleNavCommand = (text) => {
    const t = text.toLowerCase();
    const steps = stepsRef.current;
    if (t.includes("next") || t.includes("aage"))
      setActivityStep((s) => Math.min(s + 1, Math.max(steps.length - 1, 0)));
    else if (t.includes("previous") || t.includes("back") || t.includes("pichla"))
      setActivityStep((s) => Math.max(s - 1, 0));
    else if (t.includes("repeat") || t.includes("dobara") || t.includes("phir"))
      narrate(steps[stepRef.current]);
  };

  const startListening = () => {
    const rec = getRecognition();
    if (!rec) { setError("Voice input needs a Chromium-based browser (Web Speech API)."); return; }
    recognitionRef.current = rec;
    setTranscript("");
    setListening(true);
    rec.onresult = (ev) => {
      const text = ev.results[0][0].transcript;
      setTranscript(text);
      if (navModeRef.current) handleNavCommand(text);
      else handleVoiceCommand(text);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => {
      // In hands-free mode keep listening (browser STT is one-shot, so restart).
      if (navModeRef.current) {
        try { rec.start(); return; } catch (e) { /* ignore re-start race */ }
      }
      setListening(false);
    };
    rec.start();
  };

  const stopListening = () => {
    navModeRef.current = false; // prevent the onend auto-restart loop
    recognitionRef.current?.stop();
    setListening(false);
  };

  // ---- TTS narration via Gemini ----
  const narrate = async (text) => {
    if (!text) return;
    try {
      const url = await fetchSpeech(text, language === "hindi" ? "Kore" : undefined);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    } catch (e) {
      setError("Narration failed: " + e.message);
    }
  };

  // ---- Manual tab actions ----
  const doSimplify = async () => {
    if (!topicInput.trim()) return;
    const data = await run(() => simplify(topicInput, language));
    if (data) showConcept(data);
  };
  const doQuiz = async () => {
    if (!topicInput.trim()) return;
    const data = await run(() => quiz(topicInput, Number(quizCount), quizType,
      language === "hinglish" ? "english" : language));
    if (data) showQuiz(data);
  };
  const doTranslate = async () => {
    if (!translateInput.trim()) return;
    const data = await run(() => translate(translateInput));
    if (data) showTranslation(data);
  };
  const doActivity = async () => {
    if (!topicInput.trim()) return;
    const data = await run(() => activity(topicInput,
      language === "hinglish" ? "english" : language));
    if (data) showActivity(data);
  };

  useEffect(() => () => recognitionRef.current?.abort?.(), []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col dark-scroll">
      <audio ref={audioRef} className="hidden" />

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between bg-black/70 backdrop-blur">
        <div className="flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-white/60" />
          <div>
            <h1 className="text-2xl font-display leading-none">Sahayak</h1>
            <p className="text-xs text-gray-400">Voice-first smartboard co-pilot</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Language</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="hinglish">Hinglish</option>
            <option value="hindi">Hindi</option>
            <option value="english">English</option>
          </select>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex gap-1 px-4 py-3 border-b border-white/10 overflow-x-auto bg-black/70 backdrop-blur">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                tab === t.id ? "bg-white text-black" : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </nav>

      {/* Voice command bar (always available) */}
      <div className="px-6 py-4 bg-white/[0.02] border-b border-white/10 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={listening ? stopListening : startListening}
          className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition ${
            listening ? "bg-red-600 animate-pulse" : "bg-white text-black hover:bg-white/90"
          }`}
        >
          {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          {listening ? "Listening…" : "Speak Command"}
        </button>
        <input
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleVoiceCommand(transcript)}
          placeholder='Or type a command — e.g. "Explain photosynthesis" / "Make a quiz on fractions"'
          className="flex-1 w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <button
          onClick={() => handleVoiceCommand(transcript)}
          className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-sm"
        >
          Run
        </button>
      </div>

      {/* Status */}
      <div className="px-6 pt-3 min-h-[28px]">
        {loading && (
          <p className="text-sm text-white flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Generating…
          </p>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {lastIntent && !loading && (
          <p className="text-xs text-gray-400">Detected intent: <span className="text-white">{lastIntent}</span></p>
        )}
      </div>

      {/* Main smartboard area */}
      <main className="flex-1 p-6">
        {tab === "simplify" && (
          <SimplifyView
            concept={concept}
            topicInput={topicInput}
            setTopicInput={setTopicInput}
            onGenerate={doSimplify}
            onNarrate={() => narrate(concept?.explanation)}
          />
        )}
        {tab === "quiz" && (
          <QuizView
            quizData={quizData}
            topicInput={topicInput}
            setTopicInput={setTopicInput}
            count={quizCount}
            setCount={setQuizCount}
            type={quizType}
            setType={setQuizType}
            onGenerate={doQuiz}
          />
        )}
        {tab === "translate" && (
          <TranslateView
            translation={translation}
            input={translateInput}
            setInput={setTranslateInput}
            onGenerate={doTranslate}
            onNarrate={narrate}
          />
        )}
        {tab === "activity" && (
          <ActivityView
            activityData={activityData}
            step={activityStep}
            setStep={setActivityStep}
            topicInput={topicInput}
            setTopicInput={setTopicInput}
            onGenerate={doActivity}
            onNarrate={narrate}
            navMode={navMode}
            setNavMode={setNavMode}
            listening={listening}
            startListening={startListening}
            stopListening={stopListening}
          />
        )}
        {tab === "voice" && (
          <VoiceHelp />
        )}
      </main>
    </div>
  );
}

/* ----------------------- Sub-views ----------------------- */

function Field({ value, onChange, placeholder, onEnter }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
      placeholder={placeholder}
      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30"
    />
  );
}

function GenButton({ onClick, children }) {
  return (
    <button onClick={onClick} className="px-6 py-3 rounded-lg bg-white text-black hover:bg-white/90 font-semibold">
      {children}
    </button>
  );
}

function SimplifyView({ concept, topicInput, setTopicInput, onGenerate, onNarrate }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Field value={topicInput} onChange={setTopicInput} onEnter={onGenerate}
          placeholder="Enter a concept to explain — e.g. Photosynthesis" />
        <GenButton onClick={onGenerate}>Explain</GenButton>
      </div>
      {concept && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="liquid-glass rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-3xl font-display text-white">{concept.topic}</h2>
              <button onClick={onNarrate} className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg">
                <Volume2 className="w-4 h-4" /> Narrate
              </button>
            </div>
            <p className="text-lg leading-relaxed text-gray-100">{concept.explanation}</p>
            {concept.key_points?.length > 0 && (
              <ul className="mt-5 space-y-2">
                {concept.key_points.map((p, i) => (
                  <li key={i} className="flex gap-3 text-gray-200">
                    <span className="text-white/60 font-bold">{i + 1}.</span>{p}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="liquid-glass rounded-2xl p-6 border border-white/10">
            <h3 className="text-sm uppercase text-gray-400 mb-4">Visual Aid</h3>
            {concept.diagram ? <Mermaid chart={concept.diagram} /> : <p className="text-gray-500">No diagram generated.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function QuizView({ quizData, topicInput, setTopicInput, count, setCount, type, setType, onGenerate }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <Field value={topicInput} onChange={setTopicInput} onEnter={onGenerate}
          placeholder="Quiz topic — e.g. The Water Cycle" />
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4">
          <option value="mcq">MCQ</option>
          <option value="short">Short answer</option>
        </select>
        <input type="number" min={1} max={20} value={count}
          onChange={(e) => setCount(e.target.value)}
          className="w-20 bg-white/5 border border-white/10 rounded-lg px-4 text-center" />
        <GenButton onClick={onGenerate}>Generate</GenButton>
      </div>
      {quizData?.questions?.length > 0 && (
        <div className="space-y-4">
          {quizData.questions.map((q, i) => (
            <div key={i} className="liquid-glass rounded-2xl p-5 border border-white/10">
              <p className="text-lg font-semibold mb-3">
                <span className="text-white/60">Q{i + 1}.</span> {q.question}
              </p>
              {q.options && (
                <div className="grid sm:grid-cols-2 gap-2">
                  {q.options.map((opt, j) => (
                    <div key={j}
                      className={`px-4 py-2 rounded-lg border ${
                        opt === q.answer
                          ? "border-green-500/60 bg-green-500/10 text-green-300"
                          : "border-white/10 bg-white/5"
                      }`}>
                      {String.fromCharCode(65 + j)}. {opt}
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-3 text-sm text-green-300">Answer: {q.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TranslateView({ translation, input, setInput, onGenerate, onNarrate }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Enter or dictate text to translate between Hindi and English…"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30" />
        <div><GenButton onClick={onGenerate}>Translate</GenButton></div>
      </div>
      {translation && (
        <div className="grid md:grid-cols-2 gap-6">
          <LangCard title="English" text={translation.english} onNarrate={() => onNarrate(translation.english)} />
          <LangCard title="हिन्दी (Hindi)" text={translation.hindi} onNarrate={() => onNarrate(translation.hindi)} />
        </div>
      )}
    </div>
  );
}

function LangCard({ title, text, onNarrate }) {
  return (
    <div className="liquid-glass rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-display text-white">{title}</h3>
        <button onClick={onNarrate} className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg">
          <Volume2 className="w-4 h-4" /> Read
        </button>
      </div>
      <p className="text-lg leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}

function ActivityView({
  activityData, step, setStep, topicInput, setTopicInput, onGenerate, onNarrate,
  navMode, setNavMode, listening, startListening, stopListening,
}) {
  const steps = activityData?.steps || [];
  const current = steps[step];
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Field value={topicInput} onChange={setTopicInput} onEnter={onGenerate}
          placeholder="Activity topic — e.g. Show that air has weight" />
        <GenButton onClick={onGenerate}>Build Activity</GenButton>
      </div>
      {activityData && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl font-display text-white">{activityData.title}</h2>
            <button
              onClick={() => {
                const next = !navMode;
                setNavMode(next);
                if (next && !listening) startListening();
                if (!next && listening) stopListening();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                navMode ? "bg-red-600" : "bg-white/10 hover:bg-white/20"
              }`}>
              <Mic className="w-4 h-4" />
              {navMode ? "Hands-free ON (say: next / repeat / previous)" : "Enable hands-free"}
            </button>
          </div>

          {activityData.materials?.length > 0 && (
            <div className="liquid-glass rounded-2xl p-5 border border-white/10">
              <h3 className="text-sm uppercase text-gray-400 mb-2">Materials</h3>
              <div className="flex flex-wrap gap-2">
                {activityData.materials.map((m, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">{m}</span>
                ))}
              </div>
            </div>
          )}

          {/* Big current step for the smartboard */}
          <div className="liquid-glass bg-gradient-to-br from-white/[0.06] to-transparent rounded-2xl p-10 min-h-[220px] flex flex-col justify-center">
            <p className="text-sm text-gray-400 mb-2">Step {step + 1} of {steps.length}</p>
            <p className="text-3xl font-semibold leading-snug">{current}</p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <NavBtn onClick={() => setStep(Math.max(step - 1, 0))} disabled={step === 0}>
              <ChevronLeft className="w-5 h-5" /> Previous
            </NavBtn>
            <NavBtn onClick={() => onNarrate(current)}>
              <RotateCcw className="w-5 h-5" /> Repeat
            </NavBtn>
            <NavBtn onClick={() => setStep(Math.min(step + 1, steps.length - 1))} disabled={step === steps.length - 1}>
              Next <ChevronRight className="w-5 h-5" />
            </NavBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function NavBtn({ onClick, disabled, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed font-semibold">
      {children}
    </button>
  );
}

function VoiceHelp() {
  const examples = [
    { icon: Sparkles, text: '"Explain Newton\'s third law in Hinglish"' },
    { icon: ListChecks, text: '"Make a 5 question quiz on the water cycle"' },
    { icon: Languages, text: '"Translate: The mitochondria is the powerhouse of the cell"' },
    { icon: FlaskConical, text: '"Create an activity to show that air has weight"' },
  ];
  return (
    <div className="max-w-2xl mx-auto text-center mt-10">
      <h2 className="text-4xl md:text-5xl font-display mb-3">Speak a command to begin</h2>
      <p className="text-gray-400 mb-8">
        Press <span className="text-white">Speak Command</span> above and talk naturally in Hindi, English or Hinglish.
        The assistant detects what you want and projects it on the smartboard.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 text-left">
        {examples.map((e, i) => {
          const Icon = e.icon;
          return (
            <div key={i} className="liquid-glass rounded-xl p-4 border border-white/10 flex gap-3 items-start">
              <Icon className="w-5 h-5 text-white/60 mt-0.5 shrink-0" />
              <span className="text-gray-200">{e.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
