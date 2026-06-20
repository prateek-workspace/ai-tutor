"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Mic, MicOff, Volume2, Loader2, Sparkles, ListChecks,
  Languages, FlaskConical, ChevronLeft, ChevronRight, RotateCcw, Eye, EyeOff,
  Image as ImageIcon, RefreshCw,
} from "lucide-react";
import {
  runCommand, simplify, quiz, translate, activity, fetchSpeech, fetchImage,
} from "@/lib/api";
import ClassTimer from "@/components/ClassTimer";
import AppNav from "@/components/AppNav";
import { tr, LANGUAGES } from "@/lib/i18n";

const Mermaid = dynamic(() => import("@/components/Mermaid"), { ssr: false });

const TABS = [
  { id: "voice", key: "tab_voice", icon: Mic },
  { id: "simplify", key: "tab_simplify", icon: Sparkles },
  { id: "quiz", key: "tab_quiz", icon: ListChecks },
  { id: "translate", key: "tab_translate", icon: Languages },
  { id: "activity", key: "tab_activity", icon: FlaskConical },
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
  const timerRef = useRef(null); // imperative handle to the activity ClassTimer

  const T = tr(language);
  // Haryanvi & Hindi both transcribe best with hi-IN.
  const sttLang = (language === "hindi" || language === "haryanvi") ? "hi-IN" : "en-IN";

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
    else setError(T.notUnderstood);
  };

  // ---- Activity hands-free navigation keywords ----
  const handleNavCommand = (text) => {
    const t = text.toLowerCase();
    const steps = stepsRef.current;
    // Timer voice control takes priority (so "start timer" isn't read as a step).
    if (t.includes("timer")) {
      if (t.includes("start") || t.includes("resume") || t.includes("shuru")) timerRef.current?.start();
      else if (t.includes("pause") || t.includes("stop") || t.includes("rok")) timerRef.current?.pause();
      else if (t.includes("reset") || t.includes("restart")) timerRef.current?.reset();
      else timerRef.current?.toggle();
      return;
    }
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
      const url = await fetchSpeech(text, (language === "hindi" || language === "haryanvi") ? "Kore" : undefined);
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
      <AppNav />

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-3 flex items-center justify-between bg-black/70 backdrop-blur">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-white/60" />
          <p className="text-sm text-gray-400">{T.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{T.languageLabel}</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-sm [&>option]:text-black"
          >
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
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
              {T[t.key]}
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
          {listening ? T.listening : T.speak}
        </button>
        <input
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleVoiceCommand(transcript)}
          placeholder={T.cmdPlaceholder}
          className="flex-1 w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <button
          onClick={() => handleVoiceCommand(transcript)}
          className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-sm"
        >
          {T.run}
        </button>
      </div>

      {/* Status */}
      <div className="px-6 pt-3 min-h-[28px]">
        {loading && (
          <p className="text-sm text-white flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> {T.generating}
          </p>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {lastIntent && !loading && (
          <p className="text-xs text-gray-400">{T.detectedIntent} <span className="text-white">{lastIntent}</span></p>
        )}
      </div>

      {/* Main smartboard area */}
      <main className="flex-1 p-6">
        {tab === "simplify" && (
          <SimplifyView
            T={T}
            concept={concept}
            topicInput={topicInput}
            setTopicInput={setTopicInput}
            onGenerate={doSimplify}
            onNarrate={() => narrate(concept?.explanation)}
          />
        )}
        {tab === "quiz" && (
          <QuizView
            T={T}
            quizData={quizData}
            topicInput={topicInput}
            setTopicInput={setTopicInput}
            count={quizCount}
            setCount={setQuizCount}
            type={quizType}
            setType={setQuizType}
            onGenerate={doQuiz}
            onNarrate={narrate}
          />
        )}
        {tab === "translate" && (
          <TranslateView
            T={T}
            translation={translation}
            input={translateInput}
            setInput={setTranslateInput}
            onGenerate={doTranslate}
            onNarrate={narrate}
          />
        )}
        {tab === "activity" && (
          <ActivityView
            T={T}
            language={language}
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
            timerRef={timerRef}
          />
        )}
        {tab === "voice" && (
          <VoiceHelp T={T} onPick={(cmd) => { setTranscript(cmd); handleVoiceCommand(cmd); }} />
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

function SimplifyView({ T, concept, topicInput, setTopicInput, onGenerate, onNarrate }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Field value={topicInput} onChange={setTopicInput} onEnter={onGenerate}
          placeholder={T.simplifyPlaceholder} />
        <GenButton onClick={onGenerate}>{T.explain}</GenButton>
      </div>
      {concept && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="liquid-glass rounded-2xl p-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-3xl font-display text-white">{concept.topic}</h2>
              <button onClick={onNarrate} className="shrink-0 flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg">
                <Volume2 className="w-4 h-4" /> {T.narrate}
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
          <div className="liquid-glass rounded-2xl p-6">
            <h3 className="text-sm uppercase text-gray-400 mb-4">{T.visualAid}</h3>
            {concept.diagram ? <Mermaid chart={concept.diagram} /> : <p className="text-gray-500">{T.noDiagram}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function QuizView({ T, quizData, topicInput, setTopicInput, count, setCount, type, setType, onGenerate, onNarrate }) {
  // Answers stay hidden by default so a class can attempt them first.
  const [revealed, setRevealed] = useState({});
  // Per-question visual aid images (generated lazily on click).
  const [activeQ, setActiveQ] = useState(null);
  const [images, setImages] = useState({});     // index -> object URL
  const [loadingIdx, setLoadingIdx] = useState(null);
  const [errIdx, setErrIdx] = useState({});     // index -> message
  const questions = quizData?.questions || [];
  const topic = quizData?.topic || "";

  // Reset everything (and free old image URLs) whenever a fresh quiz arrives.
  useEffect(() => {
    setRevealed({}); setActiveQ(null); setLoadingIdx(null); setErrIdx({});
    setImages((old) => { Object.values(old).forEach(URL.revokeObjectURL); return {}; });
  }, [quizData]);

  const allShown = questions.length > 0 && questions.every((_, i) => revealed[i]);
  const toggleAll = () => {
    if (allShown) setRevealed({});
    else setRevealed(Object.fromEntries(questions.map((_, i) => [i, true])));
  };
  const readAloud = (q) => {
    const opts = q.options ? " Options: " + q.options.map((o, j) => `${String.fromCharCode(65 + j)}. ${o}.`).join(" ") : "";
    onNarrate?.(`${q.question}${opts}`);
  };

  const imagePrompt = (q) =>
    `A simple, colourful educational illustration for a school classroom smartboard that helps students understand this question. ` +
    `Clear, friendly, diagram-like, with little or no text. Topic: ${topic}. Question: ${q.question}`;

  const generateFor = async (i, { force = false } = {}) => {
    setActiveQ(i);
    if (!force && (images[i] || loadingIdx === i)) return;
    setErrIdx((e) => ({ ...e, [i]: undefined }));
    setLoadingIdx(i);
    try {
      const url = await fetchImage(imagePrompt(questions[i]));
      setImages((m) => ({ ...m, [i]: url }));
    } catch (e) {
      setErrIdx((er) => ({ ...er, [i]: e.message || T.imageError }));
    } finally {
      setLoadingIdx((cur) => (cur === i ? null : cur));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <Field value={topicInput} onChange={setTopicInput} onEnter={onGenerate}
          placeholder={T.quizPlaceholder} />
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 [&>option]:text-black">
          <option value="mcq">{T.mcq}</option>
          <option value="short">{T.shortAnswer}</option>
        </select>
        <input type="number" min={1} max={20} value={count}
          onChange={(e) => setCount(e.target.value)}
          className="w-20 bg-white/5 border border-white/10 rounded-lg px-4 text-center" />
        <GenButton onClick={onGenerate}>{T.generate}</GenButton>
      </div>

      {questions.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Questions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-white/50 text-sm">{questions.length} {T.questions} · {T.answersHidden}</p>
              <button onClick={toggleAll}
                className="shrink-0 flex items-center gap-2 text-sm liquid-glass rounded-lg px-4 py-2 hover:bg-white/10">
                {allShown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {allShown ? T.hideAll : T.revealAll}
              </button>
            </div>

            {questions.map((q, i) => {
              const show = !!revealed[i];
              const isActive = activeQ === i;
              return (
                <button key={i} type="button" onClick={() => generateFor(i)}
                  className={`w-full text-left liquid-glass rounded-2xl p-5 transition-colors ${
                    isActive ? "ring-2 ring-white/40" : "hover:bg-white/[0.04]"
                  }`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-lg font-semibold">
                      <span className="text-white/50">Q{i + 1}.</span> {q.question}
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="bg-white/10 p-2 rounded-lg" title={T.visualAid}>
                        {loadingIdx === i ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                      </span>
                      <span onClick={(e) => { e.stopPropagation(); readAloud(q); }}
                        role="button" aria-label="Read question aloud"
                        className="bg-white/10 hover:bg-white/20 p-2 rounded-lg cursor-pointer">
                        <Volume2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  {q.options && (
                    <div className="grid sm:grid-cols-2 gap-2">
                      {q.options.map((opt, j) => (
                        <div key={j}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            show && opt === q.answer
                              ? "border-green-500/60 bg-green-500/10 text-green-300"
                              : "border-white/10 bg-white/5"
                          }`}>
                          {String.fromCharCode(65 + j)}. {opt}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3">
                    {show ? (
                      <p className="text-sm text-green-300">{T.answerLabel} {q.answer}</p>
                    ) : (
                      <span onClick={(e) => { e.stopPropagation(); setRevealed((r) => ({ ...r, [i]: true })); }}
                        role="button"
                        className="text-sm text-white/60 hover:text-white underline underline-offset-4 cursor-pointer">
                        {T.revealOne}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Visual Aid panel */}
          <div className="lg:col-span-1">
            <div className="liquid-glass rounded-2xl p-5 lg:sticky lg:top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm uppercase text-gray-400">{T.visualAid}</h3>
                {activeQ !== null && images[activeQ] && (
                  <button onClick={() => generateFor(activeQ, { force: true })}
                    className="flex items-center gap-1 text-xs text-white/60 hover:text-white">
                    <RefreshCw className="w-3.5 h-3.5" /> {T.regenerate}
                  </button>
                )}
              </div>

              {activeQ === null ? (
                <div className="aspect-square rounded-xl border border-dashed border-white/15 flex flex-col items-center justify-center text-center p-6 text-white/40">
                  <ImageIcon className="w-8 h-8 mb-3" />
                  <p className="text-sm">{T.quizVisualHint}</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-white/50 mb-3">Q{activeQ + 1}. {questions[activeQ]?.question}</p>
                  {loadingIdx === activeQ ? (
                    <div className="aspect-square rounded-xl bg-white/5 flex flex-col items-center justify-center text-white/50">
                      <Loader2 className="w-7 h-7 animate-spin mb-3" />
                      <p className="text-sm">{T.drawing}</p>
                    </div>
                  ) : images[activeQ] ? (
                    <img src={images[activeQ]} alt={`Visual aid for question ${activeQ + 1}`}
                      className="w-full rounded-xl border border-white/10" />
                  ) : (
                    <div className="aspect-square rounded-xl bg-white/5 flex flex-col items-center justify-center text-center p-6">
                      <p className="text-sm text-red-300 mb-3">{errIdx[activeQ] || T.imageError}</p>
                      <button onClick={() => generateFor(activeQ, { force: true })}
                        className="flex items-center gap-2 text-sm bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90">
                        <RefreshCw className="w-4 h-4" /> {T.regenerate}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TranslateView({ T, translation, input, setInput, onGenerate, onNarrate }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          placeholder={T.translatePlaceholder}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30" />
        <div><GenButton onClick={onGenerate}>{T.translateBtn}</GenButton></div>
      </div>
      {translation && (
        <div className="grid md:grid-cols-2 gap-6">
          <LangCard T={T} title="English" text={translation.english} onNarrate={() => onNarrate(translation.english)} />
          <LangCard T={T} title="हिन्दी (Hindi)" text={translation.hindi} onNarrate={() => onNarrate(translation.hindi)} />
        </div>
      )}
    </div>
  );
}

function LangCard({ T, title, text, onNarrate }) {
  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-display text-white">{title}</h3>
        <button onClick={onNarrate} className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg">
          <Volume2 className="w-4 h-4" /> {T.read}
        </button>
      </div>
      <p className="text-lg leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}

function ActivityView({
  T, language, activityData, step, setStep, topicInput, setTopicInput, onGenerate, onNarrate,
  navMode, setNavMode, listening, startListening, stopListening, timerRef,
}) {
  const steps = activityData?.steps || [];
  const current = steps[step];

  // Per-step generated illustrations — a visual storyboard of the activity.
  const [showVisuals, setShowVisuals] = useState(true);
  const [stepImages, setStepImages] = useState({});
  const [stepLoading, setStepLoading] = useState(null);
  const [stepErr, setStepErr] = useState({});
  const imagesRef = useRef({});
  const loadingRef = useRef(null);

  // Reset (and free) images whenever a new activity arrives.
  useEffect(() => {
    Object.values(imagesRef.current).forEach(URL.revokeObjectURL);
    imagesRef.current = {};
    setStepImages({}); setStepErr({}); setStepLoading(null); loadingRef.current = null;
  }, [activityData]);

  const stepPrompt = (i) =>
    `A clear, simple, colourful illustration for a school classroom showing this step of a hands-on activity being performed. ` +
    `Friendly diagram/illustration style, minimal or no text. Activity: ${activityData?.title || ""}. Step ${i + 1}: ${steps[i]}`;

  const genStep = async (i, force = false) => {
    if (steps[i] == null) return;
    if (!force && (imagesRef.current[i] || loadingRef.current === i)) return;
    loadingRef.current = i; setStepLoading(i);
    setStepErr((e) => ({ ...e, [i]: undefined }));
    try {
      const url = await fetchImage(stepPrompt(i));
      imagesRef.current = { ...imagesRef.current, [i]: url };
      setStepImages(imagesRef.current);
    } catch (e) {
      setStepErr((er) => ({ ...er, [i]: e.message || T.imageError }));
    } finally {
      if (loadingRef.current === i) { loadingRef.current = null; setStepLoading(null); }
    }
  };

  // Auto-draw the current step's visual as the teacher walks through.
  useEffect(() => {
    if (showVisuals && steps.length) genStep(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, showVisuals, activityData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Field value={topicInput} onChange={setTopicInput} onEnter={onGenerate}
          placeholder={T.activityPlaceholder} />
        <GenButton onClick={onGenerate}>{T.buildActivity}</GenButton>
      </div>
      {activityData && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl font-display text-white">{activityData.title}</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowVisuals((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                  showVisuals ? "bg-white/10 hover:bg-white/20" : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}>
                <ImageIcon className="w-4 h-4" /> {T.visuals}
              </button>
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
                {navMode ? T.handsFreeOn : T.enableHandsFree}
              </button>
            </div>
          </div>

          {activityData.materials?.length > 0 && (
            <div className="liquid-glass rounded-2xl p-5">
              <h3 className="text-sm uppercase text-gray-400 mb-2">{T.materials}</h3>
              <div className="flex flex-wrap gap-2">
                {activityData.materials.map((m, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">{m}</span>
                ))}
              </div>
            </div>
          )}

          {/* Step progress dots */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} aria-label={`Go to step ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === step ? "w-8 bg-white" : "w-2 bg-white/25 hover:bg-white/50"
                }`} />
            ))}
          </div>

          {/* Big current step for the smartboard — text + generated visual */}
          <div className="liquid-glass bg-gradient-to-br from-white/[0.06] to-transparent rounded-2xl p-6 md:p-8">
            <div className={`grid gap-6 items-center ${showVisuals ? "md:grid-cols-2" : ""}`}>
              <div className="flex flex-col justify-center min-h-[160px]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-400">{T.step} {step + 1} {T.of} {steps.length}</p>
                  <button onClick={() => onNarrate(current)}
                    className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg">
                    <Volume2 className="w-4 h-4" /> {T.readAloud}
                  </button>
                </div>
                <p className="text-2xl md:text-3xl font-semibold leading-snug">{current}</p>
              </div>

              {showVisuals && (
                <div>
                  {stepLoading === step ? (
                    <div className="aspect-video rounded-xl bg-white/5 flex flex-col items-center justify-center text-white/50">
                      <Loader2 className="w-7 h-7 animate-spin mb-2" />
                      <p className="text-sm">{T.drawing}</p>
                    </div>
                  ) : stepImages[step] ? (
                    <div className="relative">
                      <img src={stepImages[step]} alt={`Step ${step + 1} illustration`}
                        className="w-full rounded-xl border border-white/10" />
                      <button onClick={() => genStep(step, true)} title={T.regenerate}
                        className="absolute top-2 right-2 liquid-glass rounded-full p-2 text-white/80 hover:text-white">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-video rounded-xl bg-white/5 flex flex-col items-center justify-center text-center p-4">
                      <p className="text-sm text-red-300 mb-2">{stepErr[step] || T.imageError}</p>
                      <button onClick={() => genStep(step, true)}
                        className="flex items-center gap-2 text-sm bg-white text-black px-3 py-1.5 rounded-lg hover:bg-white/90">
                        <RefreshCw className="w-4 h-4" /> {T.regenerate}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 md:gap-4">
            <NavBtn onClick={() => setStep(Math.max(step - 1, 0))} disabled={step === 0}>
              <ChevronLeft className="w-5 h-5" /> {T.previous}
            </NavBtn>
            <NavBtn onClick={() => onNarrate(current)}>
              <RotateCcw className="w-5 h-5" /> {T.repeat}
            </NavBtn>
            <NavBtn onClick={() => setStep(Math.min(step + 1, steps.length - 1))} disabled={step === steps.length - 1}>
              {T.next} <ChevronRight className="w-5 h-5" />
            </NavBtn>
          </div>

          {/* On-screen classroom timer (button + hands-free controlled) */}
          <ClassTimer ref={timerRef} lang={language} />
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

function VoiceHelp({ T, onPick }) {
  const examples = [
    { icon: Sparkles, cmd: T.ex_explain },
    { icon: ListChecks, cmd: T.ex_quiz },
    { icon: Languages, cmd: T.ex_translate },
    { icon: FlaskConical, cmd: T.ex_activity },
  ];
  return (
    <div className="max-w-2xl mx-auto text-center mt-8 md:mt-12">
      <h2 className="text-4xl md:text-5xl font-display mb-3">{T.voiceHelpTitle}</h2>
      <p className="text-gray-400 mb-8 leading-relaxed">{T.voiceHelpBody}</p>
      <div className="grid sm:grid-cols-2 gap-3 text-left">
        {examples.map((e, i) => {
          const Icon = e.icon;
          return (
            <button key={i} onClick={() => onPick?.(e.cmd)}
              className="liquid-glass rounded-xl p-4 flex gap-3 items-center text-left hover:bg-white/[0.06] transition-colors group">
              <Icon className="w-5 h-5 text-white/60 group-hover:text-white shrink-0 transition-colors" />
              <span className="text-gray-200 text-sm">&ldquo;{e.cmd}&rdquo;</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
