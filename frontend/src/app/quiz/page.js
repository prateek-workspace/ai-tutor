"use client";

import { useState } from "react";
import { Loader2, Sparkles, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import ToolHeader from "@/components/ToolHeader";
import { quiz as generateQuiz } from "@/lib/api";

export default function QuizStudio() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [language, setLanguage] = useState("english");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});   // index -> selected option
  const [submitted, setSubmitted] = useState(false);

  const reset = () => {
    setQuestions(null);
    setAnswers({});
    setSubmitted(false);
    setError("");
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    reset();
    try {
      const data = await generateQuiz(topic, Number(count), "mcq", language);
      setQuestions(data.questions || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const score = questions
    ? questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-black text-white dark-scroll">
      <ToolHeader title="Quiz Studio" subtitle="Generate a quiz on any topic and play it" />

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Generator */}
        <section className="liquid-glass rounded-3xl p-6 md:p-8">
          <h2 className="font-display text-3xl mb-5">Build a quiz</h2>
          <div className="flex flex-col gap-3">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Topic — e.g. The Water Cycle, Fractions, Photosynthesis"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm text-white/60">
                Questions
                <input type="number" min={1} max={20} value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center text-white" />
              </label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm">
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
              <button onClick={handleGenerate} disabled={loading}
                className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? "Generating…" : "Generate"}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        </section>

        {/* Quiz player */}
        {questions?.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl">{topic}</h2>
              {submitted && (
                <span className="liquid-glass rounded-full px-4 py-2 text-sm">
                  Score: <span className="font-semibold">{score}</span> / {questions.length}
                </span>
              )}
            </div>

            {questions.map((q, i) => (
              <div key={i} className="liquid-glass rounded-2xl p-5">
                <p className="text-lg font-medium mb-4">
                  <span className="text-white/40 font-display text-xl mr-2">{i + 1}.</span>
                  {q.question}
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {(q.options || []).map((opt, j) => {
                    const selected = answers[i] === opt;
                    const isCorrect = opt === q.answer;
                    let cls = "border-white/10 bg-white/5 hover:bg-white/10";
                    if (submitted) {
                      if (isCorrect) cls = "border-green-500/60 bg-green-500/10 text-green-300";
                      else if (selected) cls = "border-red-500/60 bg-red-500/10 text-red-300";
                      else cls = "border-white/10 bg-white/5 opacity-70";
                    } else if (selected) {
                      cls = "border-white/60 bg-white/15";
                    }
                    return (
                      <button key={j} disabled={submitted}
                        onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                        className={`text-left px-4 py-2.5 rounded-xl border transition flex items-center gap-2 ${cls}`}>
                        <span className="text-white/40">{String.fromCharCode(65 + j)}.</span>
                        <span className="flex-1">{opt}</span>
                        {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                        {submitted && selected && !isCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex gap-3">
              {!submitted ? (
                <button onClick={() => setSubmitted(true)}
                  className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90">
                  Submit answers
                </button>
              ) : (
                <button onClick={() => { setAnswers({}); setSubmitted(false); }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl liquid-glass hover:bg-white/10">
                  <RotateCcw className="w-4 h-4" /> Retake
                </button>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
