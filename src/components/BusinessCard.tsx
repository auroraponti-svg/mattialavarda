"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, UserPlus } from "lucide-react";

const T = 18; // spessore cartoncino in px
const R = 14; // border-radius biglietto in px — i bordi laterali devono stare dentro gli angoli

// Inclinazione a riposo: mostra il bordo superiore e quello sinistro
const REST   = "rotateX(14deg) rotateY(-8deg)";
// Dopo il flip: stessa inclinazione ma sul retro
const FLIPPED = "rotateX(14deg) rotateY(172deg)";

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

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy/80 backdrop-blur-sm p-6"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div className="flex flex-col items-center gap-10 w-full max-w-lg">

        {/* Ombra esterna — fuori dal contesto 3D per non rompere preserve-3d */}
        <div className="w-full" style={{ filter: "drop-shadow(0 40px 50px rgba(0,0,0,0.65))" }}>
          {/* Contenitore prospettica */}
          <div style={{ perspective: "800px", perspectiveOrigin: "50% 40%" }} className="w-full">
            {/* Carta 3D rotante */}
            <div
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? FLIPPED : REST,
                transition: "transform 1100ms cubic-bezier(0.4,0,0.2,1)",
                position: "relative",
                aspectRatio: "7/4",
              }}
            >
              {/* ══ FRONTE ══ */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/bdv-1.png"
                alt="Biglietto da visita fronte"
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover", display: "block",
                  borderRadius: 14,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: `translateZ(${T / 2}px)`,
                }}
              />

              {/* ══ RETRO ══ */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/bdv-2.png"
                alt="Biglietto da visita retro"
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover", display: "block",
                  borderRadius: 14,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: `rotateY(180deg) translateZ(${T / 2}px)`,
                }}
              />

              {/* ══ BORDO SUPERIORE — illuminato (chiaro) ══ */}
              <div style={{
                position: "absolute", top: 0,
                left: R, right: R,          // rientra degli angoli arrotondati
                height: `${T}px`,
                background: "linear-gradient(to right, #e8ecf4 0%, #f0f2f8 50%, #e2e6f0 100%)",
                transformOrigin: "center top",
                transform: `rotateX(90deg) translateZ(${T / 2}px)`,
              }} />

              {/* ══ BORDO INFERIORE — in ombra (scuro) ══ */}
              <div style={{
                position: "absolute", bottom: 0,
                left: R, right: R,
                height: `${T}px`,
                background: "linear-gradient(to right, #7c8298 0%, #6a6e84 50%, #7a7e94 100%)",
                transformOrigin: "center bottom",
                transform: `rotateX(-90deg) translateZ(${T / 2}px)`,
              }} />

              {/* ══ BORDO SINISTRO — luce laterale ══ */}
              <div style={{
                position: "absolute", left: 0,
                top: R, bottom: R,          // rientra degli angoli arrotondati
                width: `${T}px`,
                background: "linear-gradient(to bottom, #dce0ec 0%, #c8ccda 50%, #b8bccb 100%)",
                transformOrigin: "left center",
                transform: `rotateY(-90deg) translateZ(${T / 2}px)`,
              }} />

              {/* ══ BORDO DESTRO — in ombra ══ */}
              <div style={{
                position: "absolute", right: 0,
                top: R, bottom: R,
                width: `${T}px`,
                background: "linear-gradient(to bottom, #9ca0b2 0%, #888c9e 50%, #80849a 100%)",
                transformOrigin: "right center",
                transform: `rotateY(90deg) translateZ(${T / 2}px)`,
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
