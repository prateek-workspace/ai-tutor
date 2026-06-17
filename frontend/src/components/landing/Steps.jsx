"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mic, FileText, Sparkles, MonitorPlay, Volume2 } from "lucide-react";

const STEPS = [
  { icon: Mic, title: "Speak", desc: "Tap the mic and say what you need — in Hindi, English, or Hinglish." },
  { icon: FileText, title: "Transcribe", desc: "Your speech becomes text instantly, right in the browser." },
  { icon: Sparkles, title: "Understand", desc: "Gemini detects the intent — explain, quiz, translate, or activity." },
  { icon: MonitorPlay, title: "Project", desc: "The generated content appears on the smartboard, ready for class." },
  { icon: Volume2, title: "Narrate", desc: "Optionally, Sahayak reads it aloud so every student follows along." },
];

export default function Steps() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how" ref={ref} className="bg-black py-24 md:py-36 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 md:mb-20">
          <p className="text-white/40 text-sm tracking-widest uppercase mb-4">The flow</p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-white tracking-tight text-balance">
            From a spoken word to the board <span className="italic text-white/50">in seconds</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="liquid-glass rounded-2xl p-6 flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                  <Icon className="w-6 h-6 text-white" strokeWidth={1.4} />
                  <span className="font-display text-3xl text-white/25">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <h3 className="text-white text-lg font-medium mb-1.5">{s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
