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

  // Appare scrollando verso il basso, scompare verso il fondo
  const fadeIn  = Math.min(progress * 6, 1);                        // 0→1 nel primo 17%
  const fadeOut = Math.max(0, 1 - (progress - 0.60) * 3.5);        // 1→0 dall'60% al 89%
  const opacity = fadeIn * fadeOut * 0.30;

  // Clip dal basso: rivela la colonna dall'alto verso il basso mentre si scorre
  const clipBottom = Math.max(0, 90 - progress * 120);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/spine.svg"
      alt=""
      aria-hidden="true"
      className="fixed pointer-events-none select-none hidden lg:block"
      style={{
        right: "-60px",
        top: "50%",
        transform: "translateY(-50%)",
        height: "88vh",
        width: "auto",
        zIndex: 0,
        opacity,
        filter: "sepia(1) saturate(2) hue-rotate(195deg) brightness(0.7)",
        clipPath: `inset(0 0 ${clipBottom}% 0)`,
        willChange: "opacity, clip-path",
        transition: "opacity 300ms ease",
      }}
    />
  );
}
