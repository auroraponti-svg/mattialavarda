"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
  // Per i contenuti sopra la piega (hero): rende l'elemento già visibile dal
  // primo paint lato server, senza aspettare l'idratazione del JavaScript.
  // Evita il ritardo di rendering dell'elemento LCP su mobile.
  immediate?: boolean;
};

export default function Reveal({ children, delay = 0, className = "", as = "div", immediate = false }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [show, setShow] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;

    let observer: IntersectionObserver;
    let fallback: ReturnType<typeof setTimeout>;

    // Dopo il primo paint: controlla subito se l'elemento è già nel viewport.
    // Su iOS Safari l'IntersectionObserver non si attiva per elementi già visibili
    // al momento di observe(), quindi questo check esplicito è necessario.
    const raf = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        setShow(true);
        return;
      }

      // Elemento fuori schermo: usa IntersectionObserver per il trigger scroll
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShow(true);
            observer.disconnect();
            clearTimeout(fallback);
          }
        },
        { threshold: 0.05, rootMargin: "0px" }
      );
      observer.observe(el);

      // Fallback: mostra comunque dopo 1.5s (evita elementi bloccati a opacity:0)
      fallback = setTimeout(() => {
        setShow(true);
        observer?.disconnect();
      }, 1500);
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      clearTimeout(fallback);
    };
  }, [immediate]);

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
