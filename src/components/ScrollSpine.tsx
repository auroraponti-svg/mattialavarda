"use client";

import { useEffect, useState } from "react";

// Lateral (side) view of the spine — 24 vertebrae
// Drawn from the right side: bodies on left, spinous processes on right
// S-curve: cervical lordosis → thoracic kyphosis → lumbar lordosis

const VERTEBRAE = [
  // [bodyW, bodyH, spinousLen, label] — size increases cervical→lumbar
  // Cervical C1-C7
  { bw: 28, bh: 12, sp: 28, tp: 10 },
  { bw: 30, bh: 13, sp: 30, tp: 11 },
  { bw: 31, bh: 13, sp: 31, tp: 11 },
  { bw: 32, bh: 14, sp: 30, tp: 12 },
  { bw: 32, bh: 14, sp: 29, tp: 12 },
  { bw: 33, bh: 14, sp: 28, tp: 12 },
  { bw: 34, bh: 15, sp: 27, tp: 13 },
  // Thoracic T1-T12
  { bw: 35, bh: 16, sp: 34, tp: 14 },
  { bw: 36, bh: 16, sp: 36, tp: 14 },
  { bw: 36, bh: 17, sp: 38, tp: 15 },
  { bw: 37, bh: 17, sp: 40, tp: 15 },
  { bw: 37, bh: 17, sp: 41, tp: 15 },
  { bw: 38, bh: 18, sp: 42, tp: 16 },
  { bw: 38, bh: 18, sp: 42, tp: 16 },
  { bw: 39, bh: 18, sp: 40, tp: 16 },
  { bw: 39, bh: 19, sp: 38, tp: 16 },
  { bw: 40, bh: 19, sp: 36, tp: 17 },
  { bw: 40, bh: 19, sp: 34, tp: 17 },
  { bw: 41, bh: 20, sp: 32, tp: 17 },
  // Lumbar L1-L5
  { bw: 44, bh: 22, sp: 30, tp: 20 },
  { bw: 46, bh: 23, sp: 29, tp: 21 },
  { bw: 47, bh: 24, sp: 28, tp: 21 },
  { bw: 48, bh: 24, sp: 27, tp: 22 },
  { bw: 49, bh: 25, sp: 25, tp: 22 },
];

const N = VERTEBRAE.length;

// S-curve: bodyX offset from center line
// Positive = anterior (left in view), negative = posterior
function curveOffset(i: number): number {
  const t = i / (N - 1);
  // cervical lordosis (forward), thoracic kyphosis (back), lumbar lordosis (forward)
  return (
    Math.sin(t * Math.PI * 2.2 - 0.3) * 18 +
    Math.sin(t * Math.PI) * -8
  );
}

// Gap between vertebrae (disc space) — increases toward lumbar
function discH(i: number): number {
  if (i < 7) return 6;
  if (i < 19) return 7;
  return 9;
}

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

  const activeCount = Math.round(progress * N);

  // Build layout: compute Y positions
  const startY = 30;
  const positions: { y: number; bx: number }[] = [];
  let curY = startY;
  for (let i = 0; i < N; i++) {
    const bx = 55 + curveOffset(i); // body center X
    positions.push({ y: curY, bx });
    curY += VERTEBRAE[i].bh + discH(i);
  }
  const totalH = curY + 20;
  const viewW = 160;

  return (
    <div
      className="fixed right-0 top-0 h-screen z-10 hidden lg:block pointer-events-none select-none"
      aria-hidden="true"
      style={{ width: viewW + 20 }}
    >
      <div className="h-full flex items-center">
        <svg
          viewBox={`0 0 ${viewW} ${totalH}`}
          width={viewW}
          height="90vh"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          style={{ overflow: "visible" }}
        >
          {positions.map(({ y, bx }, i) => {
            const v = VERTEBRAE[i];
            const active = i < activeCount;
            const op = active ? 0.42 : 0.09;
            const stroke = "#2B2E54";
            const sw = active ? 1.1 : 0.7;
            const discY = y + v.bh;
            const nextY = i < N - 1 ? positions[i + 1].y : discY + discH(i);
            const nextBx = i < N - 1 ? positions[i + 1].bx : bx;

            // Spinous process tip X
            const spTip = bx + v.bw / 2 + v.sp;
            // Transverse process (superior/inferior articulating facets as dots)
            const tpY1 = y + 3;
            const tpY2 = y + v.bh - 3;

            return (
              <g
                key={i}
                style={{
                  transition: "opacity 380ms cubic-bezier(0.23,1,0.32,1)",
                  opacity: op,
                }}
              >
                {/* Intervertebral disc */}
                {i < N - 1 && (
                  <path
                    d={`
                      M ${bx - v.bw / 2 + 3} ${discY}
                      Q ${(bx + nextBx) / 2} ${discY + 1}
                        ${nextBx - v.bw / 2 + 3} ${nextY}
                      L ${nextBx + v.bw / 2 - 3} ${nextY}
                      Q ${(bx + nextBx) / 2} ${nextY - 1}
                        ${bx + v.bw / 2 - 3} ${discY}
                      Z
                    `}
                    stroke={stroke}
                    strokeWidth={sw * 0.7}
                    fill="none"
                    opacity={0.7}
                  />
                )}

                {/* Vertebral body — slightly concave top/bottom (endplates) */}
                <path
                  d={`
                    M ${bx - v.bw / 2} ${y + 3}
                    Q ${bx} ${y - 1} ${bx + v.bw / 2} ${y + 3}
                    L ${bx + v.bw / 2} ${y + v.bh - 3}
                    Q ${bx} ${y + v.bh + 1} ${bx - v.bw / 2} ${y + v.bh - 3}
                    Z
                  `}
                  stroke={stroke}
                  strokeWidth={sw}
                  fill="none"
                />

                {/* Pedicle — connects body posterior wall to posterior arch */}
                <path
                  d={`M ${bx + v.bw / 2} ${tpY1} Q ${bx + v.bw / 2 + 12} ${tpY1 - 2} ${bx + v.bw / 2 + 14} ${y + v.bh / 2 - 4}`}
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d={`M ${bx + v.bw / 2} ${tpY2} Q ${bx + v.bw / 2 + 12} ${tpY2 + 2} ${bx + v.bw / 2 + 14} ${y + v.bh / 2 + 4}`}
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Lamina — from pedicle junction to spinous process */}
                <path
                  d={`
                    M ${bx + v.bw / 2 + 14} ${y + v.bh / 2 - 4}
                    Q ${spTip - 8} ${y + v.bh / 2 - 7} ${spTip} ${y + v.bh / 2 - 2}
                    Q ${spTip + 3} ${y + v.bh / 2} ${spTip} ${y + v.bh / 2 + 2}
                    Q ${spTip - 8} ${y + v.bh / 2 + 7} ${bx + v.bw / 2 + 14} ${y + v.bh / 2 + 4}
                  `}
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Superior articular facet */}
                <circle
                  cx={bx + v.bw / 2 + 13}
                  cy={tpY1 - 1}
                  r={2.2}
                  stroke={stroke}
                  strokeWidth={sw * 0.8}
                  fill="none"
                />
                {/* Inferior articular facet */}
                <circle
                  cx={bx + v.bw / 2 + 13}
                  cy={tpY2 + 1}
                  r={2.2}
                  stroke={stroke}
                  strokeWidth={sw * 0.8}
                  fill="none"
                />
              </g>
            );
          })}

          {/* Anterior longitudinal ligament hint — gentle curve along bodies */}
          <polyline
            points={positions.map(({ y, bx }, i) => `${bx - VERTEBRAE[i].bw / 2},${y + VERTEBRAE[i].bh / 2}`).join(" ")}
            stroke="#3F6FA0"
            strokeWidth={0.5}
            strokeDasharray="3 6"
            fill="none"
            opacity={0.15}
          />
        </svg>
      </div>
    </div>
  );
}
