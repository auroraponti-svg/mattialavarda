"use client";

import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
};

export default function MagneticButton({ children, className = "", strength = 0.3 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * strength;
    const y = (e.clientY - top - height / 2) * strength;
    el.style.transition = "transform 100ms ease-out";
    el.style.transform = `translate(${x}px, ${y}px)`;
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    if (reset.current) clearTimeout(reset.current);
    el.style.transition = "transform 400ms cubic-bezier(0.23, 1, 0.32, 1)";
    el.style.transform = "translate(0px, 0px)";
    reset.current = setTimeout(() => {
      if (el) el.style.transition = "";
    }, 400);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`inline-block ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}
