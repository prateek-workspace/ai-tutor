"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Which languages does it understand?",
    a: "Hindi, English, and natural Hinglish. You can speak however your classroom speaks, and choose the output language from the smartboard.",
  },
  {
    q: "Do teachers need to type anything?",
    a: "No. Sahayak is voice-first — speak a command and the content appears on the board. A text box is there as a fallback, but typing is optional.",
  },
  {
    q: "What hardware does a classroom need?",
    a: "A smartboard or projector connected to a computer with a microphone and internet, using a Chromium-based browser (Chrome or Edge) for voice input.",
  },
  {
    q: "Is student data collected or tracked?",
    a: "No. Sahayak generates lesson content on demand. There is no student performance tracking, attendance, or analytics — that is intentionally out of scope.",
  },
  {
    q: "Can I reuse what I generated?",
    a: "Quizzes can be exported as PDFs, and if a database is connected, generated content is saved to a history you can revisit later.",
  },
];

function Item({ faq, isOpen, onToggle }) {
  return (
    <div className="liquid-glass rounded-2xl">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
        aria-expanded={isOpen}>
        <span className="text-white text-base md:text-lg">{faq.q}</span>
        <Plus className={`w-5 h-5 text-white/60 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden">
            <p className="px-6 pb-5 text-white/55 text-sm md:text-base leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" ref={ref} className="bg-black py-24 md:py-36 px-6 overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-display text-4xl md:text-6xl text-white tracking-tight mb-12 text-center">
          Questions, <span className="italic text-white/50">answered</span>
        </motion.h2>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}>
              <Item faq={faq} isOpen={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
