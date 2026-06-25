"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, UserPlus } from "lucide-react";

// Spessore realistico cartoncino
const T = 10;
// Border radius biglietto
const R = 12;

// Tilt a riposo: si vede il bordo superiore e sinistro
const TILT_REST    = `rotateX(18deg) rotateY(-20deg)`;
// Dopo il flip: stesso tilt, lato opposto
const TILT_FLIPPED = `rotateX(18deg) rotateY(160deg)`;

// Colori bordi realistici cartoncino bianco/navy
const EDGE_TOP    = "#eef0f5";
const EDGE_BOTTOM = "#d0d3de";
const EDGE_LEFT   = "#2a2d52";   // navy, come la banda sinistra del biglietto
const EDGE_RIGHT  = "#eff1f7";   // bianco, come il lato destro

export default function BusinessCard() {
  const [open, setOpen]       = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) { setFlipped(false); setShowCta(false); return; }
    const t1 = setTimeout(() => setFlipped(true), 800);
    const t2 = setTimeout(() => setShowCta(true), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy/80 backdrop-blur-sm p-8"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div className="flex flex-col items-center gap-12 w-full max-w-md">

        {/* Ombra esterna — fuori dal contesto 3D */}
        <div
          className="w-full"
          style={{ filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.7))" }}
        >
          {/* Prospettiva */}
          <div style={{ perspective: "700px", perspectiveOrigin: "50% 50%" }}>
            {/* Biglietto 3D rotante */}
            <div
              style={{
                transformStyle: "preserve-3d",
                transform: flipped ? TILT_FLIPPED : TILT_REST,
                transition: "transform 1200ms cubic-bezier(0.4,0,0.2,1)",
                position: "relative",
                aspectRatio: "1.75",   // proporzione biglietto da visita standard
              }}
            >
              {/* ══ FRONTE ══ */}
              <div
                style={{
                  position: "absolute", inset: 0,
                  borderRadius: R,
                  backgroundImage: "url('/bdv-1.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: `translateZ(${T / 2}px)`,
                }}
              />

              {/* ══ RETRO ══ */}
              <div
                style={{
                  position: "absolute", inset: 0,
                  borderRadius: R,
                  backgroundImage: "url('/bdv-2.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: `rotateY(180deg) translateZ(${T / 2}px)`,
                }}
              />

              {/* ══ BORDO SUPERIORE ══ */}
              <div style={{
                position: "absolute",
                top: 0, left: R, right: R,
                height: T,
                background: EDGE_TOP,
                transformOrigin: "center top",
                transform: `rotateX(90deg) translateZ(${T / 2}px)`,
              }} />

              {/* ══ BORDO INFERIORE ══ */}
              <div style={{
                position: "absolute",
                bottom: 0, left: R, right: R,
                height: T,
                background: EDGE_BOTTOM,
                transformOrigin: "center bottom",
                transform: `rotateX(-90deg) translateZ(${T / 2}px)`,
              }} />

              {/* ══ BORDO SINISTRO (navy) ══ */}
              <div style={{
                position: "absolute",
                left: 0, top: R, bottom: R,
                width: T,
                background: EDGE_LEFT,
                transformOrigin: "left center",
                transform: `rotateY(-90deg) translateZ(${T / 2}px)`,
              }} />

              {/* ══ BORDO DESTRO (bianco) ══ */}
              <div style={{
                position: "absolute",
                right: 0, top: R, bottom: R,
                width: T,
                background: EDGE_RIGHT,
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
