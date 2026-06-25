import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
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
      <section className="bg-gradient-to-br from-mist to-white py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-navy mb-3">Contatti e prenotazioni</h1>
          <p className="text-navy/60 max-w-xl mx-auto">
            Prenota online scegliendo tra gli orari disponibili, oppure contattami direttamente.
          </p>
        </div>
      </section>

      {/* Prenotazione online */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-navy mb-2 text-center">Prenota il tuo appuntamento</h2>
          <p className="text-navy/60 text-center mb-8 max-w-2xl mx-auto">
            Il calendario mostra in tempo reale gli orari liberi. Riceverai una email di conferma con la
            possibilità di salvare l&apos;appuntamento nel tuo calendario.
          </p>
          <CalBooking />
        </div>
      </section>

      {/* Contatti diretti + form */}
      <section className="bg-mist py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Dove mi trovi</h2>
            <ul className="space-y-5 mb-8">
              <li className="flex items-start gap-3">
                <span className="w-10 h-10 bg-steel/10 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-steel" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-navy">{site.studio}</p>
                  <p className="text-sm text-navy/60">{site.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-10 h-10 bg-steel/10 rounded-lg flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-steel" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-navy">Telefono</p>
                  <a href={`tel:${site.phoneHref}`} className="text-sm text-navy/60 hover:text-steel transition-colors cursor-pointer">
                    {site.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-10 h-10 bg-steel/10 rounded-lg flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-steel" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-navy">Email</p>
                  <a href={`mailto:${site.email}`} className="text-sm text-navy/60 hover:text-steel transition-colors cursor-pointer break-all">
                    {site.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-10 h-10 bg-steel/10 rounded-lg flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-steel" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-navy">Orari</p>
                  <p className="text-sm text-navy/60">Su appuntamento. Gli orari verranno pubblicati a breve.</p>
                </div>
              </li>
            </ul>

            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-lg hover:brightness-95 transition cursor-pointer"
            >
              <MessageCircle size={18} aria-hidden="true" /> Scrivimi su WhatsApp
            </a>

            {/* Mappa */}
            <div className="mt-8 rounded-xl overflow-hidden border border-navy/10 shadow-sm">
              <iframe
                src={site.mapsEmbed}
                title="Mappa dello studio a Samarate"
                width="100%"
                height="300"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold text-navy mb-6">Scrivimi un messaggio</h2>
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-navy/10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
