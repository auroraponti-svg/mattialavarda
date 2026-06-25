"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** Ritardo in ms per effetto stagger tra elementi vicini */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
};

export default function Reveal({ children, delay = 0, className = "", as = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      data-show={show}
      style={{ transitionDelay: show ? `${delay}ms` : "0ms" }}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
