"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AudioLines, Mic, ListChecks, FileText, LayoutDashboard, Home, Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/smartboard", label: "Smartboard", icon: Mic },
  { href: "/quiz", label: "Quiz Studio", icon: ListChecks },
  { href: "/test-generate", label: "Test Generator", icon: FileText },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

// Site-wide top navigation used on every app page (dashboard + tools).
export default function AppNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-6 py-3 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 text-white shrink-0">
          <AudioLines className="w-6 h-6" />
          <span className="font-display text-xl leading-none">Sahayak</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.slice(1).map((l) => {
            const Icon = l.icon;
            const active = isActive(l.href);
            return (
              <Link key={l.href} href={l.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                  active ? "bg-white text-black" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}>
                <Icon className="w-4 h-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button className="md:hidden text-white p-2" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden max-w-6xl mx-auto mt-3 grid grid-cols-2 gap-2">
          {LINKS.map((l) => {
            const Icon = l.icon;
            const active = isActive(l.href);
            return (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
                  active ? "bg-white text-black" : "liquid-glass text-white/80"
                }`}>
                <Icon className="w-4 h-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
