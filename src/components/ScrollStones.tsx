"use client";

import { useEffect, useState } from "react";

// [cx, cy, rx, ry, trigger]
const STONES: [number, number, number, number, number][] = [
  [50, 430, 43, 13, 0.04],
  [47, 385, 35, 11, 0.11],
  [53, 342, 39, 12, 0.18],
  [50, 298, 27,  9, 0.25],
  [48, 259, 33, 10, 0.32],
  [52, 223, 21,  7, 0.39],
  [50, 193, 15,  5, 0.46],
];

const DOTS = [450, 410, 367, 320, 278, 241, 210, 182];

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
        // stesso filtro colore della colonna vertebrale
        filter: "sepia(1) saturate(2) hue-rotate(195deg) brightness(0.7)",
      }}
    >
      <svg
        width="auto"
        height="88vh"
        viewBox="0 0 100 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: "88vh", width: "auto" }}
      >
        {/* Puntini centrali tra i sassi */}
        {DOTS.map((cy, i) => {
          const stoneIdx = Math.min(i, STONES.length - 1);
          const trigger = STONES[stoneIdx][4];
          const t = easeOut(Math.min(Math.max((progress - trigger) / 0.07, 0), 1));
          return (
            <circle
              key={cy}
              cx={50}
              cy={cy}
              r={2.5}
              fill="#373f5e"
              style={{ opacity: t * 0.7 }}
            />
          );
        })}

        {/* Sassi — solo contorno, come la colonna vertebrale */}
        {STONES.map(([cx, cy, rx, ry, trigger], i) => {
          const t = easeOut(Math.min(Math.max((progress - trigger) / 0.07, 0), 1));
          const translateY = (1 - t) * 22;

          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill="#373f5e"
              style={{
                opacity: t,
                transform: `translateY(${translateY}px)`,
                willChange: "transform, opacity",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
