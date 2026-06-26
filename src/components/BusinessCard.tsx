"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, UserPlus } from "lucide-react";

// Misure
const T = 8;   // spessore cartoncino px
const R = 12;  // border-radius px

// Inclinazione a riposo: si vedono bordo alto e sinistro
const REST    = "rotateX(20deg) rotateY(-22deg)";
// Dopo il flip: specchiato sull'altro lato
const FLIPPED = "rotateX(20deg) rotateY(158deg)";

export default function BusinessCard() {
  const [open, setOpen]       = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) { setFlipped(false); setShowCta(false); return; }
    const t1 = setTimeout(() => setFlipped(true), 700);
    const t2 = setTimeout(() => setShowCta(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Stile base per le facce — usa clip-path invece di overflow:hidden
  // così i border-radius non rompono il contesto preserve-3d
  const faceBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    clipPath: `inset(0 round ${R}px)`,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy/85 backdrop-blur-sm p-8"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div className="flex flex-col items-center gap-12 w-full max-w-md">

        {/* Ombra — FUORI dal contesto 3D (filter rompe preserve-3d) */}
        <div className="w-full" style={{ filter: "drop-shadow(0 50px 70px rgba(0,0,0,0.8))" }}>
          {/* Prospettiva */}
          <div style={{ perspective: "700px", perspectiveOrigin: "50% 50%" }}>
            {/* Carta 3D */}
            <div
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? FLIPPED : REST,
                transition: "transform 1200ms cubic-bezier(0.4,0,0.2,1)",
                position: "relative",
                aspectRatio: "1.75",
              }}
            >
              {/* ══ FRONTE ══ */}
              <div
                style={{
                  ...faceBase,
                  backgroundImage: "url('/bdv-1.png')",
                  transform: `translateZ(${T / 2}px)`,
                }}
              />

              {/* ══ RETRO ══ */}
              <div
                style={{
                  ...faceBase,
                  backgroundImage: "url('/bdv-2.png')",
                  transform: `rotateY(180deg) translateZ(${T / 2}px)`,
                }}
              />

            </div>
          </div>
        </div>

        {/* CTA — appare dopo il flip */}
        <div
          style={{
            opacity: showCta ? 1 : 0,
            transform: showCta ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 500ms ease, transform 500ms ease",
            pointerEvents: showCta ? "auto" : "none",
          }}
          className="flex flex-col items-center gap-2"
        >
          <a
            href="/mattia-lavarda.vcf"
            download="Mattia Lavarda Osteopata.vcf"
            className="press inline-flex items-center gap-2.5 bg-steel text-white font-semibold px-8 py-3 rounded-xl hover:bg-navy transition-colors cursor-pointer shadow-lg text-base"
          >
            <UserPlus size={18} aria-hidden="true" />
            Salva il mio contatto
          </a>
          <p className="text-white/50 text-xs">Si aggiunge direttamente alla rubrica del tuo telefono</p>
        </div>
      </div>

      <button
        onClick={() => setOpen(false)}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white"
        aria-label="Chiudi"
      >
        <X size={20} />
      </button>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="press flex items-center justify-center gap-3 w-full bg-steel text-white font-semibold py-4 rounded-xl hover:bg-navy transition-colors cursor-pointer text-base shadow-sm"
      >
        <UserPlus size={20} aria-hidden="true" />
        Salva il mio contatto
      </button>

      {mounted && open && createPortal(modal, document.body)}
    </>
  );
}
