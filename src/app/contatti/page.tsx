"use client";

import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";

const orari = [
  { giorno: "Lunedì – Venerdì", ore: "9:00 – 13:00 / 15:00 – 19:00" },
  { giorno: "Sabato", ore: "9:00 – 13:00" },
  { giorno: "Domenica", ore: "Chiuso" },
];

export default function Contatti() {
  const [inviato, setInviato] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefono: "", messaggio: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInviato(true);
  }

  return (
    <>
      <section className="bg-gradient-to-br from-[#F0FDFA] to-[#CCFBF1] py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-[#0891B2]/10 text-[#0891B2] text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Siamo qui per te
          </span>
          <h1 className="text-4xl font-bold text-[#134E4A] mb-4">Contatti</h1>
          <p className="text-[#134E4A]/60 max-w-xl mx-auto">
            Prenota una visita o scrivici per qualsiasi informazione. Il primo colloquio è gratuito.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#134E4A] mb-6">Informazioni</h2>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0891B2]/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-[#0891B2]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#134E4A]">Indirizzo</p>
                    <p className="text-sm text-[#134E4A]/60">Via Roma 1, 21013 Gallarate (VA)</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0891B2]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-[#0891B2]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#134E4A]">Telefono</p>
                    <a href="tel:+390000000000" className="text-sm text-[#0891B2] hover:text-[#22D3EE] transition-colors duration-200 cursor-pointer">
                      +39 000 000 0000
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0891B2]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-[#0891B2]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#134E4A]">Email</p>
                    <a href="mailto:info@osteogallarate.it" className="text-sm text-[#0891B2] hover:text-[#22D3EE] transition-colors duration-200 cursor-pointer">
                      info@osteogallarate.it
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-[#0891B2]" aria-hidden="true" />
                <h3 className="font-bold text-[#134E4A]">Orari di apertura</h3>
              </div>
              <ul className="space-y-2">
                {orari.map(({ giorno, ore }) => (
                  <li key={giorno} className="flex justify-between text-sm">
                    <span className="text-[#134E4A]/70">{giorno}</span>
                    <span className="font-medium text-[#134E4A]">{ore}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mappa placeholder */}
            <div className="rounded-xl overflow-hidden border border-[#0891B2]/10 h-48 bg-[#0891B2]/5 flex items-center justify-center text-[#0891B2]/30 text-sm">
              Mappa Google Maps (da integrare)
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#0891B2]/10 p-8">
            <h2 className="text-2xl font-bold text-[#134E4A] mb-6">Inviaci un messaggio</h2>
            {inviato ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#134E4A] text-lg mb-2">Messaggio inviato!</h3>
                <p className="text-[#134E4A]/60 text-sm">Ti risponderemo il prima possibile.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-[#134E4A] mb-1">
                    Nome e cognome <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id="nome"
                    type="text"
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#0891B2]/20 focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20 outline-none transition-all duration-200 text-sm"
                    placeholder="Mario Rossi"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#134E4A] mb-1">
                    Email <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#0891B2]/20 focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20 outline-none transition-all duration-200 text-sm"
                    placeholder="mario@email.it"
                  />
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-[#134E4A] mb-1">
                    Telefono
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#0891B2]/20 focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20 outline-none transition-all duration-200 text-sm"
                    placeholder="+39 333 000 0000"
                  />
                </div>
                <div>
                  <label htmlFor="messaggio" className="block text-sm font-medium text-[#134E4A] mb-1">
                    Messaggio <span aria-hidden="true" className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="messaggio"
                    required
                    rows={4}
                    value={form.messaggio}
                    onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#0891B2]/20 focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20 outline-none transition-all duration-200 text-sm resize-none"
                    placeholder="Descrivi il tuo problema o la tua richiesta..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#22C55E] text-white font-semibold py-3 rounded-lg hover:bg-[#16a34a] transition-colors duration-200 cursor-pointer"
                >
                  Invia messaggio
                </button>
                <p className="text-xs text-[#134E4A]/40 text-center">
                  I campi con * sono obbligatori. I tuoi dati sono al sicuro.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
