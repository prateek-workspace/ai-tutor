"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Mic, Languages, FlaskConical } from "lucide-react";
import Navbar from "@/components/Navbar";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4";

export default function Hero() {
  const videoRef = useRef(null);

  // Smooth crossfade-to-black loop (vanilla rAF, no CSS transitions).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fade = (from, to, ms, done) => {
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / ms, 1);
        video.style.opacity = String(from + (to - from) * p);
        if (p < 1) requestAnimationFrame(tick);
        else done?.();
      };
      requestAnimationFrame(tick);
    };

    const onCanPlay = () => {
      video.play().catch(() => {});
      fade(0, 1, 500);
    };
    const onTimeUpdate = () => {
      if (video.duration - video.currentTime <= 0.55) {
        fade(parseFloat(video.style.opacity || "1"), 0, 500);
      }
    };
    const onEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        fade(0, 1, 500);
      }, 100);
    };

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        muted
        autoPlay
        playsInline
        preload="auto"
        style={{ opacity: 0 }}
        className="absolute inset-0 w-full h-full object-cover object-bottom"
      />
      {/* darken for legibility */}
      <div className="absolute inset-0 bg-black/40" />

      <Navbar />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[6%]">
        <h1 className="font-display text-white tracking-tight text-6xl md:text-8xl lg:text-9xl leading-[0.95]">
          The classroom that <em className="italic">listens</em>.
        </h1>

        <p className="mt-6 max-w-2xl text-white/80 text-base md:text-lg leading-relaxed px-4">
          A voice-first AI co-pilot for smart classrooms. Speak in Hindi, English, or Hinglish —
          and project explanations, quizzes, translations, and activities on the smartboard in real time.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link href="/smartboard"
            className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
            Start teaching hands-free
            <span className="bg-white rounded-full p-2.5 text-black">
              <ArrowRight className="w-5 h-5" />
            </span>
          </Link>
          <a href="#features"
            className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
            See what it does
          </a>
        </div>

        <div className="mt-10 flex items-center gap-3 text-white/70 text-xs">
          <span className="liquid-glass rounded-full px-3 py-2 flex items-center gap-2"><Mic className="w-4 h-4" /> Voice commands</span>
          <span className="liquid-glass rounded-full px-3 py-2 flex items-center gap-2"><Languages className="w-4 h-4" /> Hindi · English · Hinglish</span>
          <span className="liquid-glass rounded-full px-3 py-2 hidden sm:flex items-center gap-2"><FlaskConical className="w-4 h-4" /> Activity guides</span>
        </div>
      </div>

      <p className="relative z-10 text-center text-white/40 text-xs pb-8 px-6">
        Built for government smart classrooms · primary & secondary education
      </p>
    </section>
  );
}
