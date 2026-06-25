"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, UserPlus } from "lucide-react";

export default function BusinessCard() {
  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) { setFlipped(false); setShowCta(false); return; }
    const t1 = setTimeout(() => setFlipped(true), 600);
    const t2 = setTimeout(() => setShowCta(true), 1800);
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
      <div className="flex flex-col items-center gap-8 w-full max-w-lg">
        {/* 3D card */}
        <div style={{ perspective: "1200px" }} className="w-full">
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
              <Image
                src="/bdv-1.png"
                alt="Biglietto da visita fronte"
                fill
                className="object-cover"
                sizes="(max-width:640px) calc(100vw - 48px), 512px"
              />
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
              <Image
                src="/bdv-2.png"
                alt="Biglietto da visita retro"
                fill
                className="object-cover"
                sizes="(max-width:640px) calc(100vw - 48px), 512px"
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            opacity: showCta ? 1 : 0,
            transform: showCta ? "translateY(0)" : "translateY(12px)",
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

      {/* Close */}
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
