"use client";

import Link from "next/link";
import { AudioLines, Instagram, Twitter, Github, ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 px-6 pt-16 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-10">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <AudioLines className="w-6 h-6 text-white" />
              <span className="font-display text-2xl">Sahayak</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              A voice-first AI teaching assistant for Hindi–English smart classrooms.
              Built to keep teachers with their students, not their keyboards.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Github].map((Icon, i) => (
                <a key={i} href="#"
                  className="liquid-glass rounded-full p-3 text-white/80 hover:text-white hover:bg-white/5 transition-all"
                  aria-label="Social link">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-12 text-sm">
            <div className="flex flex-col gap-3">
              <span className="text-white/40 text-xs tracking-widest uppercase">Product</span>
              <Link href="/smartboard" className="text-white/70 hover:text-white transition-colors">Smartboard</Link>
              <Link href="/quiz" className="text-white/70 hover:text-white transition-colors">Quiz Studio</Link>
              <Link href="/test-generate" className="text-white/70 hover:text-white transition-colors">Test Generator</Link>
              <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors">Dashboard</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white/40 text-xs tracking-widest uppercase">Learn</span>
              <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
              <a href="#how" className="text-white/70 hover:text-white transition-colors">How it works</a>
              <a href="#faq" className="text-white/70 hover:text-white transition-colors">FAQ</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white/40 text-xs tracking-widest uppercase">For</span>
              <span className="text-white/70">Government schools</span>
              <span className="text-white/70">Bilingual classrooms</span>
              <span className="text-white/70">Primary &amp; secondary</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">© {new Date().getFullYear()} Sahayak · Powered by Gemini</p>
          <a href="#top"
            className="liquid-glass rounded-full px-4 py-2 text-white/70 hover:text-white text-xs flex items-center gap-2 transition-colors">
            Back to top <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
