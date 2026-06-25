"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, UserPlus } from "lucide-react";

const T = 14; // spessore cartoncino in px

export default function BusinessCard() {
  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) { setFlipped(false); setShowCta(false); return; }
    const t1 = setTimeout(() => setFlipped(true), 600);
    const t2 = setTimeout(() => setShowCta(true), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy/80 backdrop-blur-sm p-6"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div className="flex flex-col items-center gap-10 w-full max-w-lg">

        {/* Ombra esterna — FUORI dal contesto 3D, altrimenti annulla preserve-3d */}
        <div style={{ filter: "drop-shadow(0 28px 44px rgba(0,0,0,0.60))" }} className="w-full">
        {/* Wrapper prospettica */}
        <div style={{ perspective: "900px", perspectiveOrigin: "50% 45%" }} className="w-full">
          {/* Carta rotante — NO filter qui */}
          <div
            style={{
              transformStyle: "preserve-3d",
              transform: flipped
                ? `rotateX(8deg) rotateY(180deg)`
                : `rotateX(8deg) rotateY(0deg)`,
              transition: "transform 1050ms cubic-bezier(0.4,0,0.2,1)",
              position: "relative",
              aspectRatio: "7/4",
            }}
          >
            {/* ── FRONTE ── */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bdv-1.png"
              alt="Biglietto da visita fronte"
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover", display: "block",
                borderRadius: 16,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: `translateZ(${T / 2}px)`,
              }}
            />

            {/* ── RETRO ── */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bdv-2.png"
              alt="Biglietto da visita retro"
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover", display: "block",
                borderRadius: 16,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: `rotateY(180deg) translateZ(${T / 2}px)`,
              }}
            />

            {/* ── BORDO SINISTRO ── */}
            <div style={{
              position: "absolute", top: 0, left: 0,
              width: `${T}px`, height: "100%",
              background: "linear-gradient(to bottom, #dde0ea, #b0b4c4)",
              transformOrigin: "left center",
              transform: "rotateY(-90deg)",
              borderRadius: "4px 0 0 4px",
            }} />

            {/* ── BORDO DESTRO ── */}
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: `${T}px`, height: "100%",
              background: "linear-gradient(to bottom, #9ea3b5, #7a7e90)",
              transformOrigin: "right center",
              transform: "rotateY(90deg)",
              borderRadius: "0 4px 4px 0",
            }} />

            {/* ── BORDO SUPERIORE ── */}
            <div style={{
              position: "absolute", top: 0, left: 0,
              width: "100%", height: `${T}px`,
              background: "linear-gradient(to right, #dde0ea, #c8ccd8, #dde0ea)",
              transformOrigin: "top center",
              transform: "rotateX(90deg)",
            }} />

            {/* ── BORDO INFERIORE ── */}
            <div style={{
              position: "absolute", bottom: 0, left: 0,
              width: "100%", height: `${T}px`,
              background: "linear-gradient(to right, #888ca0, #6e7284, #888ca0)",
              transformOrigin: "bottom center",
              transform: "rotateX(-90deg)",
            }} />
          </div>
        </div>
        </div>

        {/* CTA */}
        <div
          style={{
            opacity: showCta ? 1 : 0,
            transform: showCta ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 500ms ease, transform 500ms ease",
            pointerEvents: showCta ? "auto" : "none",
          }}
          className="flex flex-col items-center gap-2"
        >
          <a
            href="/mattia-lavarda.vcf"
            download="Mattia Lavarda Osteopata.vcf"
            className="press inline-flex items-center gap-2.5 bg-steel text-white font-semibold px-7 py-3 rounded-xl hover:bg-navy transition-colors cursor-pointer shadow-lg"
          >
            <UserPlus size={18} aria-hidden="true" />
            Salva il mio contatto
          </a>
          <p className="text-white/50 text-xs">Si aggiunge direttamente alla rubrica del tuo telefono</p>
        </div>
      </div>

      {/* Chiudi */}
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
