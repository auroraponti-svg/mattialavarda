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

  // Start 40% visible, complete reveal as user scrolls
  const hidden = Math.max(0, 60 - progress * 80);

  return (
    <div
      className="fixed right-0 top-0 h-screen z-10 hidden lg:flex items-center pointer-events-none select-none"
      aria-hidden="true"
      style={{ width: 200 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/spine.svg"
        alt=""
        style={{
          display: "block",
          height: "90vh",
          width: "auto",
          maxWidth: "none",
          filter:
            "sepia(1) saturate(2) hue-rotate(195deg) brightness(0.7) opacity(0.30)",
          clipPath: `inset(0 0 ${hidden}% 0)`,
        }}
      />
    </div>
  );
}
