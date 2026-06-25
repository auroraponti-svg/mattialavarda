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

  // Starts 40% visible, fully revealed as user scrolls
  const hidden = Math.max(0, 60 - progress * 80);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/spine.svg"
      alt=""
      aria-hidden="true"
      className="fixed pointer-events-none select-none hidden lg:block"
      style={{
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        height: "88vh",
        width: "auto",
        zIndex: 10,
        filter: "sepia(1) saturate(2) hue-rotate(195deg) brightness(0.7) opacity(0.28)",
        clipPath: `inset(0 0 ${hidden}% 0)`,
        willChange: "clip-path",
      }}
    />
  );
}
