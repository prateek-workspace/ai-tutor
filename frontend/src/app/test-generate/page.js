"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import { Loader2, FileText, Download, Eye, EyeOff } from "lucide-react";
import AppNav from "@/components/AppNav";
import { quiz as generateQuiz } from "@/lib/api";

export default function TestGenerator() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [language, setLanguage] = useState("english");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState(null);
  const [showAnswers, setShowAnswers] = useState(true);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setQuestions(null);
    try {
      // Short-answer questions = a written test / question paper.
      const data = await generateQuiz(topic, Number(count), "short", language);
      setQuestions(data.questions || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = (withAnswers) => {
    if (!questions) return;
    const doc = new jsPDF();
    const margin = 15;
    let y = 20;
    doc.setFontSize(16);
    doc.text(`Test: ${topic}`, margin, y);
    y += 10;
    doc.setFontSize(11);
    questions.forEach((q, i) => {
      const qLines = doc.splitTextToSize(`${i + 1}. ${q.question}`, 180);
      if (y + qLines.length * 7 > 280) { doc.addPage(); y = 20; }
      doc.text(qLines, margin, y);
      y += qLines.length * 7;
      if (withAnswers) {
        const aLines = doc.splitTextToSize(`Ans: ${q.answer}`, 175);
        if (y + aLines.length * 6 > 280) { doc.addPage(); y = 20; }
        doc.setTextColor(90);
        doc.text(aLines, margin + 5, y);
        doc.setTextColor(0);
        y += aLines.length * 6 + 4;
      } else {
        y += 12; // blank space for the student to answer
      }
    });
    doc.save(`${topic.replace(/\s+/g, "_")}_test${withAnswers ? "_key" : ""}.pdf`);
  };

  return (
    <div className="min-h-screen bg-black text-white dark-scroll">
      <AppNav />

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <section className="liquid-glass rounded-3xl p-6 md:p-8">
          <h2 className="font-display text-3xl mb-5">Generate a test</h2>
          <div className="flex flex-col gap-3">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Topic — e.g. The French Revolution, Newton's Laws"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm text-white/60">
                Questions
                <input type="number" min={1} max={25} value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center text-white" />
              </label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm [&>option]:text-black">
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="hinglish">Hinglish</option>
                <option value="haryanvi">Haryanvi</option>
              </select>
              <button onClick={handleGenerate} disabled={loading}
                className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                {loading ? "Generating…" : "Generate"}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        </section>

        {questions?.length > 0 && (
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-3xl">{topic}</h2>
              <div className="flex gap-2">
                <button onClick={() => setShowAnswers((s) => !s)}
                  className="flex items-center gap-2 text-sm liquid-glass rounded-xl px-4 py-2 hover:bg-white/10">
                  {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showAnswers ? "Hide answers" : "Show answers"}
                </button>
                <button onClick={() => exportPDF(false)}
                  className="flex items-center gap-2 text-sm liquid-glass rounded-xl px-4 py-2 hover:bg-white/10">
                  <Download className="w-4 h-4" /> Paper
                </button>
                <button onClick={() => exportPDF(true)}
                  className="flex items-center gap-2 text-sm rounded-xl px-4 py-2 bg-white text-black hover:bg-white/90">
                  <Download className="w-4 h-4" /> With key
                </button>
              </div>
            </div>

            {questions.map((q, i) => (
              <div key={i} className="liquid-glass rounded-2xl p-5">
                <p className="text-lg font-medium">
                  <span className="text-white/40 font-display text-xl mr-2">{i + 1}.</span>
                  {q.question}
                </p>
                {showAnswers && (
                  <p className="mt-3 text-white/60 text-sm border-l-2 border-white/15 pl-3">
                    {q.answer}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
