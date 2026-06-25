"use client";

import { useState } from "react";
import { CalendarDays, MessageSquare } from "lucide-react";
import CalBooking from "@/components/CalBooking";
import ContactForm from "@/components/ContactForm";

type Tab = "book" | "write";

export default function ContactTabs() {
  const [tab, setTab] = useState<Tab>("book");

  return (
    <div className="bg-white rounded-2xl border border-navy/10 shadow-sm overflow-hidden">
      {/* Tab switch */}
      <div className="flex border-b border-navy/10" role="tablist" aria-label="Modalità di contatto">
        <button
          role="tab"
          aria-selected={tab === "book"}
          onClick={() => setTab("book")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
            tab === "book"
              ? "text-steel border-b-2 border-steel bg-steel/[0.04]"
              : "text-navy/50 hover:text-navy hover:bg-navy/[0.02]"
          }`}
        >
          <CalendarDays size={18} aria-hidden="true" /> Prenota online
        </button>
        <button
          role="tab"
          aria-selected={tab === "write"}
          onClick={() => setTab("write")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
            tab === "write"
              ? "text-steel border-b-2 border-steel bg-steel/[0.04]"
              : "text-navy/50 hover:text-navy hover:bg-navy/[0.02]"
          }`}
        >
          <MessageSquare size={18} aria-hidden="true" /> Scrivimi un messaggio
        </button>
      </div>

      {/* Panels */}
      <div className="p-5 sm:p-7">
        {tab === "book" ? (
          <div>
            <p className="text-navy/60 text-sm mb-5">
              Scegli giorno e orario tra le disponibilità. Riceverai una email di conferma con la possibilità
              di salvare l&apos;appuntamento nel tuo calendario.
            </p>
            <CalBooking />
          </div>
        ) : (
          <div>
            <p className="text-navy/60 text-sm mb-5">
              Hai una domanda prima di prenotare? Scrivimi e ti rispondo il prima possibile.
            </p>
            <ContactForm />
          </div>
        )}
      </div>
    </div>
  );
}
