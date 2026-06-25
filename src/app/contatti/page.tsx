import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { site } from "@/lib/site";
import ContactTabs from "@/components/ContactTabs";

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
          <h1 className="text-4xl font-bold text-navy mb-3">Prenota o contattami</h1>
          <p className="text-navy/60 max-w-lg mx-auto">
            Fissa il tuo appuntamento online in pochi clic, oppure scrivimi per qualsiasi informazione.
          </p>
        </div>
      </section>

      {/* Main: azione principale + sidebar contatti */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 items-start">
          {/* Azione principale */}
          <ContactTabs />

          {/* Sidebar compatta */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-navy/10 shadow-sm p-6">
              <h2 className="font-bold text-navy mb-4">Lo studio</h2>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-steel mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="text-navy/70">
                    <span className="block font-medium text-navy">{site.studio}</span>
                    {site.address}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-steel shrink-0" aria-hidden="true" />
                  <a href={`tel:${site.phoneHref}`} className="text-navy/70 hover:text-steel transition-colors cursor-pointer">
                    {site.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-steel shrink-0" aria-hidden="true" />
                  <a href={`mailto:${site.email}`} className="text-navy/70 hover:text-steel transition-colors cursor-pointer break-all">
                    {site.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={18} className="text-steel mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="text-navy/70">Solo su appuntamento</span>
                </li>
              </ul>

              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-4 py-2.5 rounded-lg hover:brightness-95 transition cursor-pointer"
              >
                <MessageCircle size={18} aria-hidden="true" /> Scrivimi su WhatsApp
              </a>
            </div>

            {/* Mappa */}
            <a
              href={site.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden border border-navy/10 shadow-sm group"
              aria-label="Apri la mappa dello studio su Google Maps"
            >
              <iframe
                src={site.mapsEmbed}
                title="Mappa dello studio a Samarate"
                width="100%"
                height="220"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, pointerEvents: "none" }}
                className="block"
              />
              <span className="flex items-center justify-center gap-1.5 text-sm font-medium text-steel bg-white py-2.5 group-hover:text-navy transition-colors">
                <MapPin size={15} aria-hidden="true" /> Apri in Google Maps
              </span>
            </a>
          </aside>
        </div>
      </section>
    </>
  );
}
