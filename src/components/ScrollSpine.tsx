"use client";

import { useEffect, useState } from "react";

const VERTEBRAE = [
  { bw: 28, bh: 12, sp: 28 }, { bw: 30, bh: 13, sp: 30 }, { bw: 31, bh: 13, sp: 31 },
  { bw: 32, bh: 14, sp: 30 }, { bw: 32, bh: 14, sp: 29 }, { bw: 33, bh: 14, sp: 28 },
  { bw: 34, bh: 15, sp: 27 },
  { bw: 35, bh: 16, sp: 34 }, { bw: 36, bh: 16, sp: 36 }, { bw: 36, bh: 17, sp: 38 },
  { bw: 37, bh: 17, sp: 40 }, { bw: 37, bh: 17, sp: 41 }, { bw: 38, bh: 18, sp: 42 },
  { bw: 38, bh: 18, sp: 42 }, { bw: 39, bh: 18, sp: 40 }, { bw: 39, bh: 19, sp: 38 },
  { bw: 40, bh: 19, sp: 36 }, { bw: 40, bh: 19, sp: 34 }, { bw: 41, bh: 20, sp: 32 },
  { bw: 44, bh: 22, sp: 30 }, { bw: 46, bh: 23, sp: 29 }, { bw: 47, bh: 24, sp: 28 },
  { bw: 48, bh: 24, sp: 27 }, { bw: 49, bh: 25, sp: 25 },
];

const N = VERTEBRAE.length;

function curveOffset(i: number): number {
  const t = i / (N - 1);
  return Math.sin(t * Math.PI * 2.2 - 0.3) * 18 + Math.sin(t * Math.PI) * -8;
}

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

  const startY = 30;
  const positions: { y: number; bx: number }[] = [];
  let curY = startY;
  for (let i = 0; i < N; i++) {
    positions.push({ y: curY, bx: 55 + curveOffset(i) });
    curY += VERTEBRAE[i].bh + discH(i);
  }
  const totalH = curY + 20;

  return (
    <div
      className="fixed right-0 top-0 h-screen z-10 hidden lg:flex items-center pointer-events-none select-none"
      aria-hidden="true"
      style={{ width: 170 }}
    >
      <svg
        viewBox={`0 0 160 ${totalH}`}
        width={160}
        height="88vh"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        style={{ overflow: "visible" }}
      >
        {positions.map(({ y, bx }, i) => {
          const v = VERTEBRAE[i];
          const active = i < activeCount;
          const op = active ? 0.45 : 0.09;
          const stroke = "#2B2E54";
          const sw = active ? 1.1 : 0.7;
          const discY = y + v.bh;
          const nextY = i < N - 1 ? positions[i + 1].y : discY + discH(i);
          const nextBx = i < N - 1 ? positions[i + 1].bx : bx;
          const spTip = bx + v.bw / 2 + v.sp;
          const tpY1 = y + 3;
          const tpY2 = y + v.bh - 3;

          return (
            <g key={i} style={{ transition: "opacity 380ms cubic-bezier(0.23,1,0.32,1)", opacity: op }}>
              {i < N - 1 && (
                <path
                  d={`M ${bx - v.bw/2+3} ${discY} Q ${(bx+nextBx)/2} ${discY+1} ${nextBx-v.bw/2+3} ${nextY} L ${nextBx+v.bw/2-3} ${nextY} Q ${(bx+nextBx)/2} ${nextY-1} ${bx+v.bw/2-3} ${discY} Z`}
                  stroke={stroke} strokeWidth={sw * 0.7} fill="none" opacity={0.7}
                />
              )}
              <path
                d={`M ${bx-v.bw/2} ${y+3} Q ${bx} ${y-1} ${bx+v.bw/2} ${y+3} L ${bx+v.bw/2} ${y+v.bh-3} Q ${bx} ${y+v.bh+1} ${bx-v.bw/2} ${y+v.bh-3} Z`}
                stroke={stroke} strokeWidth={sw} fill="none"
              />
              <path d={`M ${bx+v.bw/2} ${tpY1} Q ${bx+v.bw/2+12} ${tpY1-2} ${bx+v.bw/2+14} ${y+v.bh/2-4}`} stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
              <path d={`M ${bx+v.bw/2} ${tpY2} Q ${bx+v.bw/2+12} ${tpY2+2} ${bx+v.bw/2+14} ${y+v.bh/2+4}`} stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
              <path d={`M ${bx+v.bw/2+14} ${y+v.bh/2-4} Q ${spTip-8} ${y+v.bh/2-7} ${spTip} ${y+v.bh/2-2} Q ${spTip+3} ${y+v.bh/2} ${spTip} ${y+v.bh/2+2} Q ${spTip-8} ${y+v.bh/2+7} ${bx+v.bw/2+14} ${y+v.bh/2+4}`} stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
              <circle cx={bx+v.bw/2+13} cy={tpY1-1} r={2.2} stroke={stroke} strokeWidth={sw*0.8} fill="none" />
              <circle cx={bx+v.bw/2+13} cy={tpY2+1} r={2.2} stroke={stroke} strokeWidth={sw*0.8} fill="none" />
            </g>
          );
        })}
        <polyline
          points={positions.map(({ y, bx }, i) => `${bx-VERTEBRAE[i].bw/2},${y+VERTEBRAE[i].bh/2}`).join(" ")}
          stroke="#3F6FA0" strokeWidth={0.5} strokeDasharray="3 6" fill="none" opacity={0.15}
        />
      </svg>
    </div>
  );
}
