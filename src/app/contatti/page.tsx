import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle, CalendarDays } from "lucide-react";
import { site } from "@/lib/site";
import CalBooking from "@/components/CalBooking";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import BusinessCard from "@/components/BusinessCard";

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
          <Reveal delay={0}>
            <h1 className="text-4xl font-bold text-navy mb-3">Contatti e prenotazioni</h1>
          </Reveal>
          <Reveal delay={90}>
            <p className="text-navy/60 max-w-lg mx-auto">
              Tutti i riferimenti dello studio e la prenotazione online in un unico posto.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contatti */}
      <section className="px-4 sm:px-6 -mt-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              href: site.mapsLink,
              target: "_blank",
              icon: <MapPin size={22} className="text-steel mb-3" aria-hidden="true" />,
              label: "Dove",
              content: (
                <p className="text-sm text-navy/60 mt-1">{site.address}</p>
              ),
              delay: 0,
            },
            {
              href: `tel:${site.phoneHref}`,
              target: undefined,
              icon: <Phone size={22} className="text-steel mb-3" aria-hidden="true" />,
              label: "Telefono",
              content: <p className="text-sm text-navy/60 mt-1">{site.phone}</p>,
              delay: 70,
            },
            {
              href: `https://wa.me/${site.whatsapp}`,
              target: "_blank",
              icon: <MessageCircle size={22} className="text-[#25D366] mb-3" aria-hidden="true" />,
              label: "WhatsApp",
              content: <p className="text-sm text-navy/60 mt-1">Scrivimi un messaggio</p>,
              delay: 140,
            },
            {
              href: `mailto:${site.email}`,
              target: undefined,
              icon: <Mail size={22} className="text-steel mb-3" aria-hidden="true" />,
              label: "Email",
              content: <p className="text-sm text-navy/60 mt-1 break-all">{site.email}</p>,
              delay: 210,
            },
          ].map(({ href, target, icon, label, content, delay }) => (
            <Reveal key={label} delay={delay}>
              <a
                href={href}
                target={target}
                rel={target === "_blank" ? "noopener noreferrer" : undefined}
                className="lift block bg-white rounded-xl border border-navy/10 shadow-sm p-5 hover:border-steel/40 hover:shadow-md transition-all cursor-pointer h-full"
              >
                {icon}
                <p className="font-semibold text-navy text-sm">{label}</p>
                {content}
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Salva contatto */}
      <Reveal delay={0} className="px-4 sm:px-6 mt-6">
        <div className="max-w-6xl mx-auto">
          <BusinessCard />
        </div>
      </Reveal>

      {/* Mappa */}
      <Reveal delay={0} className="px-4 sm:px-6 mt-6">
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
      </Reveal>

      {/* Prenotazione */}
      <section id="prenotazione" className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal delay={0}>
            <div className="flex items-center gap-2 justify-center mb-2">
              <CalendarDays size={22} className="text-steel" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-navy text-center">Prenota online</h2>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-navy/60 text-center mb-8 max-w-xl mx-auto">
              Scegli giorno e orario tra le disponibilità. Riceverai una email di conferma con la possibilità
              di salvare l&apos;appuntamento nel tuo calendario.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <CalBooking />
          </Reveal>
        </div>
      </section>

      {/* Form */}
      <section className="bg-mist py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <Reveal delay={0}>
            <h2 className="text-2xl font-bold text-navy text-center mb-2">Preferisci scrivere?</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-navy/60 text-center mb-8">Inviami un messaggio e ti rispondo il prima possibile.</p>
          </Reveal>
          <Reveal delay={160} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-navy/10">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
