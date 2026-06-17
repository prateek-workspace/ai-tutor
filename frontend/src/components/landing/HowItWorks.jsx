"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

const SHOWCASE_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4";

const STEPS = [
  "Activate voice input and speak a command",
  "Speech is converted to text on-device",
  "AI identifies the command intent",
  "Relevant content is generated and projected",
  "Sahayak optionally narrates it aloud",
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how" ref={ref} className="bg-black pt-6 md:pt-10 pb-24 md:pb-36 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="relative rounded-3xl overflow-hidden aspect-video">
          <video src={SHOWCASE_VIDEO} muted autoPlay loop playsInline preload="auto"
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
              <p className="text-white/50 text-xs tracking-widest uppercase mb-3">How it works</p>
              <ol className="space-y-2">
                {STEPS.map((s, i) => (
                  <li key={i} className="text-white text-sm md:text-base leading-relaxed flex gap-3">
                    <span className="text-white/40 font-display text-lg leading-none">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/smartboard"
                className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium inline-block">
                Try the smartboard
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
