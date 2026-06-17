"use client";

import Link from "next/link";
import { AudioLines, ArrowLeft } from "lucide-react";

// Minimal top bar shared by the standalone tool pages (quiz, test generator).
export default function ToolHeader({ title, subtitle }) {
  return (
    <header className="border-b border-white/10 bg-black/70 backdrop-blur sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <AudioLines className="w-5 h-5" />
          <span className="font-semibold">Sahayak</span>
        </Link>
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-display leading-none">{title}</h1>
          {subtitle && <p className="text-xs text-white/40 mt-1">{subtitle}</p>}
        </div>
        <Link href="/smartboard"
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Smartboard
        </Link>
      </div>
    </header>
  );
}
