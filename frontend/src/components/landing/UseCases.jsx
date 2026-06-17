"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import LazyVideo from "@/components/landing/LazyVideo";

const CARDS = [
  {
    tag: "Explain & visualise",
    title: "Turn a topic into a lesson",
    desc: "Say a concept and get a Hinglish explanation, the key points to remember, and a concept map drawn on the board — ready to narrate aloud.",
    href: "/smartboard",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4",
  },
  {
    tag: "Assess & translate",
    title: "Check understanding instantly",
    desc: "Generate a quiz or a short-answer test on the spot, or show any passage in Hindi and English side-by-side for the whole class.",
    href: "/quiz",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4",
  },
];

export default function UseCases() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative bg-black py-24 md:py-36 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]" />
      <div ref={ref} className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-6xl text-white tracking-tight">
            What teachers <span className="italic text-white/50">do</span>
          </h2>
          <span className="hidden md:block text-white/40 text-sm">Two ways to start</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="liquid-glass rounded-3xl overflow-hidden group">
              <Link href={c.href} className="block">
                <div className="relative aspect-video overflow-hidden">
                  <LazyVideo src={c.video}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between">
                    <span className="text-white/40 text-xs tracking-widest uppercase">{c.tag}</span>
                    <span className="liquid-glass rounded-full p-2 text-white/80 group-hover:text-white transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl text-white mt-4 mb-3 tracking-tight">{c.title}</h3>
                  <p className="text-white/50 text-sm md:text-base leading-relaxed">{c.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
