"use client";

import Link from "next/link";
import { AudioLines, ArrowLeft } from "lucide-react";

// Minimal top bar shared by the standalone tool pages (quiz, test generator).
export default function ToolHeader({ title, subtitle }) {
  return (
    <header className="border-b border-white/10 bg-black/70 backdrop-blur sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors shrink-0">
          <AudioLines className="w-5 h-5" />
          <span className="font-display text-lg hidden sm:inline">Sahayak</span>
        </Link>
        <div className="text-center min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-display leading-none truncate">{title}</h1>
          {subtitle && <p className="text-[11px] sm:text-xs text-white/40 mt-1 hidden sm:block">{subtitle}</p>}
        </div>
        <Link href="/smartboard"
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors shrink-0">
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Smartboard</span>
        </Link>
      </div>
    </header>
  );
}
