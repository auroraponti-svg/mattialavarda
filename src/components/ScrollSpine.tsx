"use client";

import { useEffect, useState } from "react";

export default function ScrollSpine() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? scrollTop / docH : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal spine top→bottom as user scrolls: clip from bottom shrinks
  const revealPct = Math.min(100, Math.max(0, progress * 120)); // slightly faster than full scroll

  return (
    <div
      className="fixed right-0 top-0 h-screen z-10 hidden lg:flex items-center pointer-events-none select-none"
      aria-hidden="true"
      style={{ width: 120 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/spine.png"
        alt=""
        style={{
          height: "88vh",
          width: "auto",
          objectFit: "contain",
          objectPosition: "center top",
          // invert dark→light so background becomes white, spine becomes dark
          filter: "invert(1) sepia(1) saturate(1.8) hue-rotate(185deg) brightness(0.75) opacity(0.22)",
          mixBlendMode: "multiply",
          // clip from bottom to reveal top→bottom on scroll
          clipPath: `inset(0 0 ${Math.max(0, 100 - revealPct)}% 0)`,
          transition: "clip-path 200ms linear",
        }}
      />
    </div>
  );
}
