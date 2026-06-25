"use client";

import { useEffect, useState } from "react";

const N = 24; // total vertebrae (cervical + thoracic + lumbar)

// S-curve offset: natural spine curvature (cervical lordosis, thoracic kyphosis, lumbar lordosis)
function spineX(i: number): number {
  const t = i / (N - 1); // 0..1 top to bottom
  // cervical: lean right, thoracic: lean left, lumbar: lean right
  return (
    Math.sin(t * Math.PI * 2.1 - 0.4) * 22 +
    Math.sin(t * Math.PI * 0.9) * 10
  );
}

// Vertebra height varies: cervical small, thoracic medium, lumbar large
function vertebraH(i: number): number {
  if (i < 7) return 14;       // cervical
  if (i < 19) return 17;      // thoracic
  return 22;                  // lumbar
}

// Transverse process width varies
function processW(i: number): number {
  if (i < 7) return 18;
  if (i < 19) return 26;
  return 22;
}

export default function ScrollSpine() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeCount = Math.round(progress * N);

  // Layout
  const gapY = 28;
  const startY = 40;
  const centerX = 70;
  const totalH = startY + (N - 1) * gapY + 60;

  return (
    <div
      className="fixed right-0 top-0 h-full z-10 hidden lg:flex items-center pointer-events-none select-none"
      aria-hidden="true"
      style={{ width: 160 }}
    >
      <svg
        viewBox={`0 0 140 ${totalH}`}
        width={140}
        height="85vh"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        style={{ overflow: "visible" }}
      >
        {Array.from({ length: N }).map((_, i) => {
          const y = startY + i * gapY;
          const dx = spineX(i);
          const cx = centerX + dx;
          const h = vertebraH(i);
          const pw = processW(i);
          const discH = i < N - 1 ? 5 : 0;

          // Active = lit up as you scroll
          const active = i < activeCount;
          const opacity = active ? 0.55 : 0.13;
          const strokeColor = active ? "#3F6FA0" : "#2B2E54";
          const strokeW = active ? 1.2 : 0.8;

          // Next vertebra center for disc
          const nextDx = i < N - 1 ? spineX(i + 1) : dx;
          const nextCx = centerX + nextDx;
          const discCx = (cx + nextCx) / 2;

          return (
            <g
              key={i}
              style={{
                transition: "opacity 400ms cubic-bezier(0.23,1,0.32,1)",
                opacity,
              }}
            >
              {/* Vertebral body — rounded rect outline */}
              <rect
                x={cx - 16}
                y={y - h / 2}
                width={32}
                height={h}
                rx={5}
                stroke={strokeColor}
                strokeWidth={strokeW}
                fill="none"
                style={{ transition: "stroke 400ms ease" }}
              />

              {/* Spinous process (posterior — right side) */}
              <path
                d={`M ${cx + 16} ${y} Q ${cx + 28} ${y - 4} ${cx + pw - 4} ${y - 2}`}
                stroke={strokeColor}
                strokeWidth={strokeW * 0.9}
                strokeLinecap="round"
                fill="none"
              />
              <circle
                cx={cx + pw - 2}
                cy={y - 2}
                r={2.2}
                stroke={strokeColor}
                strokeWidth={strokeW * 0.8}
                fill="none"
              />

              {/* Transverse process (anterior — left side) */}
              <path
                d={`M ${cx - 16} ${y} Q ${cx - 26} ${y - 3} ${cx - pw + 6} ${y + 1}`}
                stroke={strokeColor}
                strokeWidth={strokeW * 0.9}
                strokeLinecap="round"
                fill="none"
              />
              <circle
                cx={cx - pw + 4}
                cy={y + 1}
                r={2}
                stroke={strokeColor}
                strokeWidth={strokeW * 0.8}
                fill="none"
              />

              {/* Intervertebral disc */}
              {i < N - 1 && (
                <ellipse
                  cx={discCx}
                  cy={y + gapY / 2}
                  rx={13}
                  ry={discH / 2}
                  stroke={strokeColor}
                  strokeWidth={strokeW * 0.7}
                  fill="none"
                  opacity={0.6}
                />
              )}

              {/* Spinal canal (central vertical line hint) */}
              {i === 0 && (
                <line
                  x1={cx}
                  y1={y - h / 2}
                  x2={cx}
                  y2={y}
                  stroke={strokeColor}
                  strokeWidth={0.5}
                  strokeDasharray="2 2"
                  opacity={0.4}
                />
              )}
            </g>
          );
        })}

        {/* Continuous canal line behind all vertebrae */}
        <polyline
          points={Array.from({ length: N }, (_, i) => {
            const y = startY + i * gapY;
            const cx = centerX + spineX(i);
            return `${cx},${y}`;
          }).join(" ")}
          stroke="#3F6FA0"
          strokeWidth={0.6}
          strokeDasharray="3 5"
          fill="none"
          opacity={0.18}
        />
      </svg>
    </div>
  );
}
