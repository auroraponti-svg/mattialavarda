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

  // Reveal top→bottom: clip from bottom shrinks as you scroll
  // Use 130% so the reveal finishes before reaching the very bottom
  const revealed = Math.min(100, progress * 130);
  const hidden = Math.max(0, 100 - revealed);

  return (
    <div
      className="fixed right-0 top-0 h-screen z-10 hidden lg:flex items-center pointer-events-none select-none"
      aria-hidden="true"
      style={{ width: 110 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/spine.svg"
        alt=""
        style={{
          height: "86vh",
          width: "auto",
          objectFit: "contain",
          objectPosition: "top center",
          // invert (white lines on dark → dark lines on white) then tint to brand blue
          filter:
            "invert(1) sepia(1) saturate(2) hue-rotate(185deg) brightness(0.7) opacity(0.18)",
          mixBlendMode: "multiply",
          // reveal from top as user scrolls
          clipPath: `inset(0 0 ${hidden}% 0)`,
          transition: "clip-path 180ms linear",
        }}
      />
    </div>
  );
}
