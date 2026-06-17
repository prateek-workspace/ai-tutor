"use client";

import { useEffect, useRef, useState } from "react";

// Renders a Mermaid.js diagram string. Mermaid is imported dynamically so it
// never runs during SSR.
export default function Mermaid({ chart }) {
  const ref = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!chart) return;

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: "dark", securityLevel: "loose" });
        const id = "mmd-" + Math.random().toString(36).slice(2);
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setError(false);
        }
      } catch (e) {
        console.error("Mermaid render failed:", e);
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    // Fall back to showing the raw diagram source.
    return (
      <pre className="text-xs text-gray-400 whitespace-pre-wrap overflow-auto">
        {chart}
      </pre>
    );
  }

  return <div ref={ref} className="flex justify-center [&_svg]:max-w-full" />;
}
