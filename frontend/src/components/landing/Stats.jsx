"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { value: "3", label: "Languages — Hindi, English & Hinglish" },
  { value: "4", label: "Classroom tools in one voice" },
  { value: "0", label: "Keyboards needed to teach" },
  { value: "Live", label: "Generated on the board in real time" },
];

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-black px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="liquid-glass rounded-2xl p-6 md:p-8 text-center">
            <div className="font-display text-5xl md:text-7xl text-white leading-none mb-3">{s.value}</div>
            <p className="text-white/45 text-xs md:text-sm leading-relaxed">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
