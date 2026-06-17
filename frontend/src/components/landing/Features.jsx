"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, ListChecks, Languages, FlaskConical, ArrowUpRight } from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    tag: "Explain",
    title: "Live Concept Simplification",
    desc: "Speak a topic and the smartboard shows a student-friendly Hinglish explanation, key points, and an auto-drawn concept map — with optional narration.",
  },
  {
    icon: ListChecks,
    tag: "Assess",
    title: "Voice-Triggered Quizzes",
    desc: "Ask for a quiz out loud. Sahayak generates topic-specific MCQs or short questions and projects them instantly for the class.",
  },
  {
    icon: Languages,
    tag: "Translate",
    title: "Bilingual Dictation & Translation",
    desc: "Dictate or paste any content and see faithful Hindi and English versions side-by-side — perfect for textbook excerpts and classroom notes.",
  },
  {
    icon: FlaskConical,
    tag: "Guide",
    title: "Hands-Free Activity Guide",
    desc: "Get step-by-step instructions for activities and experiments, and walk through them by saying “Next”, “Repeat”, or “Previous”.",
  },
];

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref}
      className="relative bg-black py-24 md:py-36 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.025)_0%,_transparent_60%)]" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-14 md:mb-20">
          <h2 className="text-white text-4xl md:text-6xl tracking-tight font-display">
            What it <span className="italic text-white/50">does</span>
          </h2>
          <span className="hidden md:block text-white/40 text-sm">Four classroom co-pilots</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.12 }}
                className="liquid-glass rounded-3xl p-7 md:p-9 group">
                <div className="flex items-start justify-between">
                  <span className="text-white/40 text-xs tracking-widest uppercase">{f.tag}</span>
                  <span className="liquid-glass rounded-full p-2 text-white/80 group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
                <Icon className="w-8 h-8 text-white mt-6 mb-5" strokeWidth={1.4} />
                <h3 className="text-white text-2xl md:text-3xl tracking-tight mb-3 font-display">{f.title}</h3>
                <p className="text-white/55 text-sm md:text-base leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
