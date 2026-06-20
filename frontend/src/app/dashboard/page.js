"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mic, ListChecks, FileText, ArrowUpRight, Sparkles, Languages,
  FlaskConical, Clock, Loader2,
} from "lucide-react";
import { getHistory } from "@/lib/api";

const TOOLS = [
  {
    href: "/smartboard",
    icon: Mic,
    tag: "Voice-first",
    title: "Smartboard",
    desc: "Speak a command — explain a concept, make a quiz, translate, or run an activity, hands-free.",
  },
  {
    href: "/quiz",
    icon: ListChecks,
    tag: "Assess",
    title: "Quiz Studio",
    desc: "Generate a topic quiz, add a visual aid per question, and play it interactively with the class.",
  },
  {
    href: "/test-generate",
    icon: FileText,
    tag: "Paperwork",
    title: "Test Generator",
    desc: "Build a short-answer question paper and export it to PDF — blank paper or answer key.",
  },
];

const KIND_META = {
  simplify: { icon: Sparkles, label: "Concept" },
  quiz: { icon: ListChecks, label: "Quiz" },
  translate: { icon: Languages, label: "Translation" },
  activity: { icon: FlaskConical, label: "Activity" },
};

function timeAgo(iso) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [dbEnabled, setDbEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getHistory(12);
        if (!alive) return;
        setHistory(data.items || []);
        setDbEnabled(data.db_enabled);
      } catch (e) {
        if (alive) setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-16">
      {/* Heading */}
      <section>
        <p className="text-white/40 text-sm tracking-widest uppercase mb-4">Dashboard</p>
        <h1 className="font-display text-5xl md:text-7xl tracking-tight text-balance">
          Your classroom, <span className="italic text-white/50">in one place</span>
        </h1>
        <p className="mt-5 max-w-2xl text-white/60 text-base md:text-lg leading-relaxed">
          Jump into any tool below. Everything you generate is voice-driven, bilingual, and ready for the smartboard.
        </p>
      </section>

      {/* Tools */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.href} href={t.href}
              className="liquid-glass rounded-3xl p-7 group flex flex-col">
              <div className="flex items-start justify-between">
                <span className="text-white/40 text-xs tracking-widest uppercase">{t.tag}</span>
                <span className="liquid-glass rounded-full p-2 text-white/80 group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <Icon className="w-8 h-8 text-white mt-6 mb-4" strokeWidth={1.4} />
              <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-2">{t.title}</h2>
              <p className="text-white/55 text-sm leading-relaxed">{t.desc}</p>
            </Link>
          );
        })}
      </section>

      {/* Recent activity */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-white/60" />
          <h2 className="font-display text-3xl">Recent activity</h2>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : error ? (
          <div className="liquid-glass rounded-2xl p-6 text-white/60 text-sm">{error}</div>
        ) : !dbEnabled ? (
          <div className="liquid-glass rounded-2xl p-6 text-white/55 text-sm">
            History isn&apos;t being saved — connect a NeonDB <code className="text-white/70">DATABASE_URL</code> on the
            backend to keep a record of everything you generate.
          </div>
        ) : history.length === 0 ? (
          <div className="liquid-glass rounded-2xl p-6 text-white/55 text-sm">
            Nothing yet. Head to the <Link href="/smartboard" className="text-white underline underline-offset-4">Smartboard</Link> and generate something.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {history.map((item) => {
              const meta = KIND_META[item.kind] || { icon: Sparkles, label: item.kind };
              const Icon = meta.icon;
              return (
                <div key={item.id} className="liquid-glass rounded-2xl p-4 flex items-center gap-4">
                  <span className="liquid-glass rounded-xl p-3 shrink-0"><Icon className="w-5 h-5 text-white/80" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-white truncate">{item.topic || meta.label}</p>
                    <p className="text-white/40 text-xs">{meta.label}{item.language ? ` · ${item.language}` : ""}</p>
                  </div>
                  <span className="text-white/35 text-xs shrink-0">{timeAgo(item.created_at)}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
