"use client";

import Link from "next/link";
import { AudioLines } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 px-6 py-14">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-3">
            <AudioLines className="w-6 h-6 text-white" />
            <span className="text-white font-semibold text-lg">Sahayak</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">
            A voice-first AI teaching assistant for Hindi–English smart classrooms.
            Built to keep teachers with their students, not their keyboards.
          </p>
        </div>

        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-3">
            <span className="text-white/40 text-xs tracking-widest uppercase">Product</span>
            <Link href="/smartboard" className="text-white/70 hover:text-white">Smartboard</Link>
            <Link href="/quiz" className="text-white/70 hover:text-white">Quiz Studio</Link>
            <Link href="/test-generate" className="text-white/70 hover:text-white">Test Generator</Link>
            <Link href="/dashboard" className="text-white/70 hover:text-white">Dashboard</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-white/40 text-xs tracking-widest uppercase">For</span>
            <span className="text-white/70">Government schools</span>
            <span className="text-white/70">Bilingual classrooms</span>
            <span className="text-white/70">Primary & secondary</span>
          </div>
        </div>
      </div>
      <p className="max-w-6xl mx-auto mt-10 text-white/30 text-xs">
        © {new Date().getFullYear()} Sahayak · Powered by Gemini
      </p>
    </footer>
  );
}
