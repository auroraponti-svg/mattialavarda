import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle, CalendarDays } from "lucide-react";
import { site } from "@/lib/site";
import CalBooking from "@/components/CalBooking";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contatti e Prenotazioni | Mattia Lavarda Osteopata",
  description: `Prenota una visita osteopatica a Samarate (VA). Studio in ${site.address}. Telefono, WhatsApp ed email.`,
};

export default function Contatti() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-mist to-white py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-navy mb-3">Contatti e prenotazioni</h1>
          <p className="text-navy/60 max-w-lg mx-auto">
            Tutti i riferimenti dello studio e la prenotazione online in un unico posto.
          </p>
        </div>
      </section>

      {/* 1. CONTATTI in alto — subito visibili */}
      <section className="px-4 sm:px-6 -mt-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href={site.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl border border-navy/10 shadow-sm p-5 hover:border-steel/40 hover:shadow-md transition-all cursor-pointer"
          >
            <MapPin size={22} className="text-steel mb-3" aria-hidden="true" />
            <p className="font-semibold text-navy text-sm">Dove</p>
            <p className="text-sm text-navy/60 mt-1">{site.address}</p>
          </a>
          <a
            href={`tel:${site.phoneHref}`}
            className="bg-white rounded-xl border border-navy/10 shadow-sm p-5 hover:border-steel/40 hover:shadow-md transition-all cursor-pointer"
          >
            <Phone size={22} className="text-steel mb-3" aria-hidden="true" />
            <p className="font-semibold text-navy text-sm">Telefono</p>
            <p className="text-sm text-navy/60 mt-1">{site.phone}</p>
          </a>
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-xl border border-navy/10 shadow-sm p-5 hover:border-steel/40 hover:shadow-md transition-all cursor-pointer"
          >
            <MessageCircle size={22} className="text-[#25D366] mb-3" aria-hidden="true" />
            <p className="font-semibold text-navy text-sm">WhatsApp</p>
            <p className="text-sm text-navy/60 mt-1">Scrivimi un messaggio</p>
          </a>
          <a
            href={`mailto:${site.email}`}
            className="bg-white rounded-xl border border-navy/10 shadow-sm p-5 hover:border-steel/40 hover:shadow-md transition-all cursor-pointer"
          >
            <Mail size={22} className="text-steel mb-3" aria-hidden="true" />
            <p className="font-semibold text-navy text-sm">Email</p>
            <p className="text-sm text-navy/60 mt-1 break-all">{site.email}</p>
          </a>
        </div>
      </section>

      {/* Mappa */}
      <section className="px-4 sm:px-6 mt-6">
        <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden border border-navy/10 shadow-sm">
          <iframe
            src={site.mapsEmbed}
            title="Mappa dello studio a Samarate"
            width="100%"
            height="280"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
            className="block"
          />
        </div>
      </section>

      {/* 2. PRENOTAZIONE sotto */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 justify-center mb-2">
            <CalendarDays size={22} className="text-steel" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-navy text-center">Prenota online</h2>
          </div>
          <p className="text-navy/60 text-center mb-8 max-w-xl mx-auto">
            Scegli giorno e orario tra le disponibilità. Riceverai una email di conferma con la possibilità
            di salvare l&apos;appuntamento nel tuo calendario.
          </p>
          <CalBooking />
        </div>
      </section>

      {/* 3. Form messaggio in fondo */}
      <section className="bg-mist py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">Preferisci scrivere?</h2>
          <p className="text-navy/60 text-center mb-8">Inviami un messaggio e ti rispondo il prima possibile.</p>
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-navy/10">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
