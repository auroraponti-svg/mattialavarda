"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { site } from "@/lib/site";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const nome = data.get("nome");
    const messaggio = data.get("messaggio");
    const telefono = data.get("telefono");
    // Fallback senza backend: apre il client di posta precompilato.
    // Sostituibile in futuro con un endpoint (Formspree/EmailJS/API route).
    const body = `Nome: ${nome}%0ATelefono: ${telefono}%0A%0A${messaggio}`;
    window.location.href = `mailto:${site.email}?subject=Richiesta dal sito&body=${body}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-navy mb-1">
          Nome e cognome
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy focus:outline-none focus:ring-3 focus:ring-steel/40 focus:border-steel transition"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy focus:outline-none focus:ring-3 focus:ring-steel/40 focus:border-steel transition"
          />
        </div>
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-navy mb-1">
            Telefono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy focus:outline-none focus:ring-3 focus:ring-steel/40 focus:border-steel transition"
          />
        </div>
      </div>
      <div>
        <label htmlFor="messaggio" className="block text-sm font-medium text-navy mb-1">
          Messaggio
        </label>
        <textarea
          id="messaggio"
          name="messaggio"
          rows={4}
          required
          className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy focus:outline-none focus:ring-3 focus:ring-steel/40 focus:border-steel transition resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto bg-steel text-white font-semibold px-6 py-3 rounded-lg hover:bg-navy transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
      >
        <Send size={18} aria-hidden="true" /> Invia messaggio
      </button>
      {sent && (
        <p className="text-sm text-steel font-medium" role="status">
          Si aprirà il tuo programma di posta per completare l&apos;invio. In alternativa scrivi direttamente a {site.email}.
        </p>
      )}
    </form>
  );
}
