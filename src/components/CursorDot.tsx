"use client";

import { useEffect, useRef } from "react";

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);
  const visible = useRef(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine) and (hover: hover)").matches) return;

    function onMove(e: MouseEvent) {
      target.current = { x: e.clientX, y: e.clientY };
      if (!visible.current) {
        current.current = { x: e.clientX, y: e.clientY };
        visible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
      }
    }

    function tick() {
      const lerp = 0.13;
      current.current.x += (target.current.x - current.current.x) * lerp;
      current.current.y += (target.current.y - current.current.y) * lerp;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${current.current.x - 5}px, ${current.current.y - 5}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{ willChange: "transform", opacity: 0, transition: "opacity 300ms ease" }}
      className="pointer-events-none fixed top-0 left-0 z-[9999] w-2.5 h-2.5 rounded-full bg-steel/50 mix-blend-multiply"
    />
  );
}
