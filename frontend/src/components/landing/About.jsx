"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref}
      className="relative bg-black pt-32 md:pt-44 pb-10 md:pb-16 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04)_0%,_transparent_70%)]" />
      <div className="relative max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-white/40 text-sm tracking-widest uppercase mb-6">
          The problem
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-white text-3xl md:text-5xl lg:text-6xl leading-[1.12] tracking-tight">
          Teachers lose hours{" "}
          <span className="font-display italic text-white/60">writing explanations, translating content, and making quizzes</span>{" "}
          by hand —{" "}
          <span className="font-display italic text-white/60">while every digital tool still expects a keyboard.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 max-w-2xl text-white/60 text-base md:text-lg leading-relaxed">
          Sahayak turns the smartboard into a co-pilot you control with your voice. Speak a topic and
          it explains, quizzes, translates, and guides — so you can stay with your students, not the keyboard.
        </motion.p>
      </div>
    </section>
  );
}
