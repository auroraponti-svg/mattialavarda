"use client";

import { useEffect, useState } from "react";

const N = 13;

export default function ScrollSpine() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeCount = Math.round(progress * N);
  const stepY = 46;
  const startY = 34;
  const totalH = startY * 2 + (N - 1) * stepY;

  return (
    <div
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-1 pointer-events-none select-none"
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 80 ${totalH}`}
        width={44}
        style={{ height: totalH * 0.88 }}
        fill="none"
      >
        {Array.from({ length: N }).map((_, i) => {
          const y = startY + i * stepY;
          const active = i < activeCount;
          const cx = 40 + Math.sin(i / 2.4) * 7;
          const discCx = 40 + Math.sin((i + 0.5) / 2.4) * 7;

          return (
            <g
              key={i}
              style={{
                transition: "opacity 350ms cubic-bezier(0.23,1,0.32,1), transform 350ms cubic-bezier(0.23,1,0.32,1)",
                opacity: active ? 1 : 0.18,
                transform: active ? "none" : "translateX(5px)",
                transformBox: "fill-box",
              }}
            >
              {/* intervertebral disc */}
              {i < N - 1 && (
                <ellipse
                  cx={discCx}
                  cy={y + stepY / 2}
                  rx="12"
                  ry="4.5"
                  fill="#AFD2EF"
                  opacity={active ? 0.75 : 0.3}
                  style={{ transition: "opacity 350ms ease" }}
                />
              )}
              {/* vertebral body */}
              <rect
                x={cx - 16}
                y={y - 11}
                width="32"
                height="22"
                rx="9"
                fill={active ? "#3F6FA0" : "#C8DFF2"}
                style={{ transition: "fill 350ms ease" }}
              />
              {/* lateral processes */}
              <ellipse
                cx={cx - 25}
                cy={y}
                rx="5"
                ry="3.5"
                fill={active ? "#7FB1DC" : "#DEEDF8"}
                style={{ transition: "fill 350ms ease" }}
              />
              <ellipse
                cx={cx + 25}
                cy={y}
                rx="5"
                ry="3.5"
                fill={active ? "#7FB1DC" : "#DEEDF8"}
                style={{ transition: "fill 350ms ease" }}
              />
              {/* spinous process */}
              <circle
                cx={cx}
                cy={y - 16}
                r="4"
                fill={active ? "#2B2E54" : "#AFD2EF"}
                opacity={active ? 0.65 : 0.35}
                style={{ transition: "fill 350ms ease, opacity 350ms ease" }}
              />
            </g>
          );
        })}
      </svg>

      {/* progress label */}
      <span
        className="text-[9px] font-semibold tracking-widest uppercase"
        style={{
          color: "#3F6FA0",
          opacity: progress > 0.05 ? 0.7 : 0,
          transition: "opacity 500ms ease",
          writingMode: "vertical-rl",
          letterSpacing: "0.18em",
        }}
      >
        {Math.round(progress * 100)}%
      </span>
    </div>
  );
}
