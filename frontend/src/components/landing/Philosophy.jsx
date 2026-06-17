"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import LazyVideo from "@/components/landing/LazyVideo";

const VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4";

export default function Philosophy() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-black py-24 md:py-36 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-14 md:mb-20 text-balance">
          Built for <span className="italic text-white/40">Bharat&apos;s</span> classrooms
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="rounded-3xl overflow-hidden aspect-[4/3] grain">
            <LazyVideo src={VIDEO} className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8">
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Speak the language of your class</p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Most digital tools assume a keyboard and English. Sahayak assumes a teacher, a voice,
                and a mixed-language room. Talk in Hindi, English, or natural Hinglish — it understands
                and responds the way your students actually speak.
              </p>
            </div>
            <div className="w-full h-px bg-white/10" />
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Stay with your students</p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Every minute spent writing on the board or hunting for an example is a minute away from
                the class. Sahayak generates, projects, and narrates in seconds, so the teacher stays
                in front of the room — not behind a screen.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
