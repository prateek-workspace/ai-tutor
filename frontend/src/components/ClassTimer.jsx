"use client";

import {
  forwardRef, useImperativeHandle, useEffect, useRef, useState,
} from "react";
import { Play, Pause, RotateCcw, Plus } from "lucide-react";
import { tr } from "@/lib/i18n";

const PRESETS = [
  { label: "30s", s: 30 },
  { label: "1m", s: 60 },
  { label: "2m", s: 120 },
  { label: "5m", s: 300 },
];

function fmt(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// A projector-friendly classroom timer. Teachers can drive it with the buttons,
// or hands-free via the imperative ref (start / pause / reset / addMinute).
const ClassTimer = forwardRef(function ClassTimer({ lang = "english" }, ref) {
  const T = tr(lang);
  const [initial, setInitial] = useState(120);
  const [left, setLeft] = useState(120);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const beep = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      [0, 0.35, 0.7].forEach((delay) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = "sine";
        o.frequency.value = 880;
        const t = ctx.currentTime + delay;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        o.start(t);
        o.stop(t + 0.26);
      });
    } catch {
      /* audio not available */
    }
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          beep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const start = () => {
    setLeft((l) => (l === 0 ? initial : l));
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setLeft(initial); };
  const choosePreset = (s) => { setRunning(false); setInitial(s); setLeft(s); };
  const addMinute = () => { setInitial((i) => i + 60); setLeft((l) => l + 60); };

  useImperativeHandle(ref, () => ({
    start, pause, reset, addMinute,
    toggle: () => (running ? pause() : start()),
  }), [running, initial, left]);

  const pct = initial > 0 ? (left / initial) * 100 : 0;
  const done = left === 0;

  return (
    <div className="liquid-glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/40 text-xs tracking-widest uppercase">{T.timerLabel}</span>
        <div className="flex gap-1.5">
          {PRESETS.map((p) => (
            <button key={p.s} onClick={() => choosePreset(p.s)}
              className={`text-xs px-2.5 py-1 rounded-full transition ${
                initial === p.s ? "bg-white text-black" : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className={`font-display tabular-nums leading-none text-6xl md:text-7xl ${done ? "text-amber-300 animate-pulse" : "text-white"}`}>
          {fmt(left)}
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div className={`h-full rounded-full transition-[width] duration-500 ${done ? "bg-amber-300" : "bg-white"}`}
              style={{ width: `${pct}%` }} />
          </div>
          <div className="flex gap-2">
            <button onClick={running ? pause : start}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90">
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {running ? T.pause : T.start}
            </button>
            <button onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">
              <RotateCcw className="w-4 h-4" /> {T.reset}
            </button>
            <button onClick={addMinute}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">
              <Plus className="w-4 h-4" /> {T.addMin}
            </button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-white/35 text-xs">{T.timerHint}</p>
    </div>
  );
});

export default ClassTimer;
