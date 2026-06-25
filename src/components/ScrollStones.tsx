"use client";

import { useEffect, useState } from "react";

// Sassi impilati: cy calcolato così che ogni sasso tocchi quello sotto
// bottom→top: cy[n] = cy[n-1] - ry[n-1] - ry[n]
const STONES: { cx: number; cy: number; rx: number; ry: number; trigger: number }[] = [
  { cx: 50, cy: 197, rx: 43, ry: 13, trigger: 0.04 }, // fondo
  { cx: 47, cy: 171, rx: 35, ry: 11, trigger: 0.11 }, // cy = 197-13-11 = 173... slight overlap
  { cx: 53, cy: 148, rx: 39, ry: 12, trigger: 0.18 },
  { cx: 50, cy: 127, rx: 27, ry:  9, trigger: 0.25 },
  { cx: 48, cy: 108, rx: 33, ry: 10, trigger: 0.32 },
  { cx: 52, cy:  91, rx: 21, ry:  7, trigger: 0.39 },
  { cx: 50, cy:  79, rx: 15, ry:  5, trigger: 0.46 },
];

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ScrollStones() {
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

  const fadeIn  = Math.min(progress * 8, 1);
  const fadeOut = Math.max(0, 1 - (progress - 0.62) * 3.5);
  const globalOpacity = fadeIn * fadeOut * 0.30;

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none"
      style={{
        opacity: globalOpacity,
        zIndex: 10,
        transition: "opacity 300ms ease",
        filter: "sepia(1) saturate(2) hue-rotate(195deg) brightness(0.7)",
      }}
    >
      <svg
        viewBox="0 0 100 215"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: "88vh", width: "auto" }}
      >
        {STONES.map(({ cx, cy, rx, ry, trigger }, i) => {
          const t = easeOut(Math.min(Math.max((progress - trigger) / 0.07, 0), 1));
          const dropY = (1 - t) * 20;

          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill="none"
              stroke="#373f5e"
              strokeWidth="1.2"
              style={{
                opacity: t,
                transform: `translateY(${dropY}px)`,
                willChange: "transform, opacity",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
