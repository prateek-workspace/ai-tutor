"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Mic } from "lucide-react";

export default function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black px-6 pb-24 md:pb-36 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
        className="liquid-glass grain rounded-[2rem] max-w-5xl mx-auto px-8 py-16 md:py-24 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.05)_0%,_transparent_65%)] rounded-[2rem]" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 liquid-glass rounded-full px-4 py-2 text-white/70 text-xs mb-8">
            <Mic className="w-4 h-4" /> Voice-first · Hindi · English · Hinglish
          </span>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] text-balance">
            Teach with your voice.
            <br />
            <span className="italic text-white/50">Leave the keyboard behind.</span>
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-white/60 text-base md:text-lg leading-relaxed">
            Open the smartboard, speak a topic, and watch your classroom come alive — explanations,
            quizzes, translations, and activities, all hands-free.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/smartboard"
              className="bg-white text-black rounded-full pl-7 pr-2 py-2 flex items-center gap-3 text-sm font-medium hover:bg-white/90 transition-colors">
              Launch the Smartboard
              <span className="bg-black rounded-full p-2.5 text-white">
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
            <Link href="/dashboard"
              className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
              Explore the dashboard
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
