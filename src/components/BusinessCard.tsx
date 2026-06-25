"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, UserPlus } from "lucide-react";

export default function BusinessCard() {
  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    if (!open) { setFlipped(false); setShowCta(false); return; }
    // auto-flip after 600ms, show CTA after full spin
    const t1 = setTimeout(() => setFlipped(true), 600);
    const t2 = setTimeout(() => setShowCta(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="press inline-flex items-center gap-2 bg-white text-steel font-semibold px-5 py-2.5 rounded-lg border border-steel/30 hover:border-steel hover:text-navy transition-colors cursor-pointer text-sm"
      >
        <CardIcon />
        Biglietto da visita
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/70 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="flex flex-col items-center gap-8 w-full max-w-lg">
            {/* 3D card */}
            <div style={{ perspective: "1000px" }} className="w-full">
              <div
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 900ms cubic-bezier(0.4,0,0.2,1)",
                  position: "relative",
                  aspectRatio: "7/4",
                }}
              >
                {/* Front */}
                <div
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                  className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image src="/bdv-1.png" alt="Biglietto da visita fronte" fill className="object-cover" sizes="(max-width:640px) 100vw, 512px" />
                </div>
                {/* Back */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                  className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image src="/bdv-2.png" alt="Biglietto da visita retro" fill className="object-cover" sizes="(max-width:640px) 100vw, 512px" />
                </div>
              </div>
            </div>

            {/* CTA */}
            <div
              style={{
                opacity: showCta ? 1 : 0,
                transform: showCta ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 500ms ease, transform 500ms ease",
              }}
              className="flex flex-col items-center gap-3"
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

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white"
            aria-label="Chiudi"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </>
  );
}

function CardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
