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

  // Clip from bottom: at scroll 0% → hidden 100% (nothing visible)
  // at scroll 100% → hidden 0% (fully visible)
  const hidden = Math.max(0, 100 - progress * 140);

  return (
    <div
      className="fixed right-0 top-0 h-screen z-10 hidden xl:block pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
      style={{ width: 160 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/spine.svg"
        alt=""
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: "92vh",
          width: "auto",
          maxWidth: "none",
          filter:
            "invert(1) sepia(1) saturate(2) hue-rotate(185deg) brightness(0.65) opacity(0.28)",
          mixBlendMode: "multiply",
          clipPath: `inset(0 0 ${hidden}% 0)`,
        }}
      />
    </div>
  );
}
