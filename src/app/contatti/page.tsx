import type { Metadata } from "next";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { site } from "@/lib/site";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import BusinessCard from "@/components/BusinessCard";
import Reviews from "@/components/Reviews";

const title = "Contatti e Prenotazioni | Mattia Lavarda Osteopata";
const description = `Prenota una visita osteopatica a Samarate (VA) con Mattia Lavarda. Telefono, WhatsApp ed email.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contatti" },
  openGraph: {
    type: "website",
    url: "/contatti",
    title,
    description,
    images: ["/og-image.jpg"],
  },
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
              Per prenotare un trattamento, chiamami o scrivimi su WhatsApp: ti rispondo il prima possibile.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contatti */}
      <section className="px-4 sm:px-6 -mt-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
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

      {/* Come prenotare — telefono/WhatsApp (prenotazione online disattivata per ora) */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal delay={0}>
            <h2 className="text-2xl font-bold text-navy mb-3">Come prenotare</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-navy/60 mb-6">
              Per fissare un appuntamento chiamami o scrivimi su WhatsApp: ti rispondo il prima
              possibile per trovare insieme il giorno e l&apos;orario più comodi.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${site.phoneHref}`}
                className="press inline-flex items-center gap-2 bg-steel text-white font-semibold px-6 py-3 rounded-lg hover:bg-navy transition-colors cursor-pointer"
              >
                <Phone size={18} aria-hidden="true" /> Chiama
              </a>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-lg hover:brightness-95 transition cursor-pointer"
              >
                <MessageCircle size={18} aria-hidden="true" /> WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Reviews carousel />

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

      {/* Testo informativo in fondo — utile alla SEO, non invadente */}
      <section className="py-14 px-4 sm:px-6 border-t border-navy/10">
        <div className="max-w-3xl mx-auto text-sm text-navy/55 leading-relaxed space-y-3">
          <h2 className="text-base font-semibold text-navy/70">Osteopata a Samarate (VA)</h2>
          <p>
            Mattia Lavarda è osteopata e chinesiologo e riceve a Samarate, in provincia di Varese,
            a pochi minuti da Gallarate, Cardano al Campo, Ferno, Lonate Pozzolo e Busto Arsizio.
            L&apos;osteopatia è una disciplina a libero accesso: non serve l&apos;impegnativa del
            medico per prenotare una valutazione.
          </p>
          <p>
            In studio mi occupo di dolori muscoloscheletrici (mal di schiena, cervicale, lombalgia,
            dolori articolari), disfunzioni posturali, cefalee e tensioni, osteopatia sportiva,
            recupero funzionale dopo un infortunio e benessere generale. Ogni percorso parte da una
            valutazione accurata del movimento ed è costruito sulle esigenze della singola persona,
            con un approccio che unisce le tecniche manuali dell&apos;osteopatia alle scienze motorie
            e alla fisiologia dell&apos;esercizio.
          </p>
          <p>
            Per prenotare un trattamento o chiedere informazioni puoi chiamare, scrivere su WhatsApp
            o inviare un&apos;email: ti risponderò per fissare insieme il giorno e l&apos;orario più
            comodi. Se hai referti, esami o lastre recenti, portali con te alla prima seduta: aiutano
            a inquadrare meglio la tua situazione.
          </p>
        </div>
      </section>
    </>
  );
}
