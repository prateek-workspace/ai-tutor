"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, AudioLines } from "lucide-react";
import Link from "next/link";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-20 px-4 sm:px-6 py-6">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="liquid-glass rounded-full max-w-5xl mx-auto px-5 sm:px-6 py-3 flex items-center justify-between"
      >
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <AudioLines className="w-6 h-6 text-white" />
            <span className="text-white font-semibold text-lg tracking-tight">Sahayak</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 ml-8">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
            Dashboard
          </Link>
          <Link href="/smartboard"
            className="liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors">
            Launch Smartboard
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden liquid-glass rounded-3xl max-w-5xl mx-auto mt-3 p-5 flex flex-col gap-4"
          >
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white text-sm">{l.label}</a>
            ))}
            <Link href="/dashboard" onClick={() => setOpen(false)} className="text-white/80 text-sm">Dashboard</Link>
            <Link href="/smartboard" onClick={() => setOpen(false)}
              className="liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium text-center">
              Launch Smartboard
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
