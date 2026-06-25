"use client";

import { useEffect, useState } from "react";

// Ogni sasso: [cx, cy, rx, ry, colore, inclinazione rx-skew, progressione trigger]
// Disposti dal basso verso l'alto come nel logo
const STONES: [number, number, number, number, string, number, number][] = [
  [50, 236, 43, 13, "#2B2E54", -3,  0.04],
  [47, 210, 35, 11, "#3F6FA0",  2,  0.11],
  [53, 185, 39, 12, "#2B2E54", -2,  0.18],
  [50, 160, 27,  9, "#7FB1DC",  3,  0.25],
  [48, 137, 33, 10, "#2B2E54", -1,  0.32],
  [52, 117, 21,  7, "#AFD2EF",  2,  0.39],
  [50, 100, 15,  5, "#2B2E54",  0,  0.46],
];

// Puntini vertebra tra i sassi
const DOTS = [247, 225, 200, 174, 150, 128, 109, 96];

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

  // Globale: compare presto, scompare verso il fondo
  const fadeIn  = Math.min(progress * 8, 1);
  const fadeOut = Math.max(0, 1 - (progress - 0.62) * 3.5);
  const globalOpacity = fadeIn * fadeOut * 0.28;

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none"
      style={{
        opacity: globalOpacity,
        zIndex: 10,
        transition: "opacity 300ms ease",
      }}
    >
      <svg
        width="90"
        height="270"
        viewBox="0 0 100 270"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Ombra per ogni sasso */}
          <filter id="stone-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#0a0e1a" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Puntini vertebra — compaiono con il sasso sotto di loro */}
        {DOTS.map((cy, i) => {
          const stoneIdx = Math.min(i, STONES.length - 1);
          const trigger = STONES[stoneIdx][6];
          const t = easeOut(Math.min(Math.max((progress - trigger) / 0.07, 0), 1));
          return (
            <circle
              key={cy}
              cx={50}
              cy={cy}
              r={2.2}
              fill="#AFD2EF"
              style={{
                opacity: t * 0.6,
                transition: "opacity 200ms",
              }}
            />
          );
        })}

        {/* Sassi — dal basso verso l'alto */}
        {STONES.map(([cx, cy, rx, ry, fill, _skew, trigger], i) => {
          const t = easeOut(Math.min(Math.max((progress - trigger) / 0.07, 0), 1));
          const translateY = (1 - t) * 18;

          return (
            <g
              key={i}
              style={{
                opacity: t,
                transform: `translateY(${translateY}px)`,
                transition: "none",
                willChange: "transform, opacity",
              }}
            >
              {/* Ombra sotto il sasso */}
              <ellipse
                cx={cx + 1}
                cy={cy + ry + 2}
                rx={rx * 0.85}
                ry={3}
                fill="#0a0e1a"
                opacity={0.18 * t}
              />
              {/* Sasso principale */}
              <ellipse
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                fill={fill}
                filter="url(#stone-shadow)"
              />
              {/* Riflesso luminoso in alto */}
              <ellipse
                cx={cx - rx * 0.25}
                cy={cy - ry * 0.3}
                rx={rx * 0.45}
                ry={ry * 0.35}
                fill="white"
                opacity={0.10}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
