"use client";

import { useEffect, useRef } from "react";

// A background/decorative video that only plays while it is on screen.
// This keeps several gallery videos on the page without pinning the CPU/GPU.
export default function LazyVideo({ src, className = "", poster }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Honour reduced-motion: don't autoplay.
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduce) {
          // Lazily attach the source the first time it becomes visible.
          if (!el.src) el.src = src;
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.2 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      className={className}
    />
  );
}
