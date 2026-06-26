import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Microscope, HandHeart, ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";
import Reviews from "@/components/Reviews";

export const metadata: Metadata = {
  title: "Chi Sono | Mattia Lavarda Osteopata",
  description:
    "Mattia Lavarda, osteopata e chinesiologo a Samarate. Formazione in Scienze Motorie e ricerca nella fisiologia dell'esercizio fisico.",
};

const valori = [
  {
    icon: HandHeart,
    titolo: "Ascolto e personalizzazione",
    desc: "Ogni persona è diversa. Dedico tempo a comprendere la storia, le abitudini e gli obiettivi di chi ho di fronte prima di impostare il trattamento.",
  },
  {
    icon: Microscope,
    titolo: "Approccio scientifico",
    desc: "Il mio lavoro come ricercatore nella fisiologia dell'esercizio guida ogni scelta: tecniche basate sull'evidenza e sul funzionamento reale del corpo.",
  },
  {
    icon: GraduationCap,
    titolo: "Formazione continua",
    desc: "Tra università italiane ed estere, aggiorno costantemente le mie competenze tra osteopatia, scienze motorie e preparazione atletica.",
  },
];

const formazione = [
  { anno: "2019 – 2020", titolo: "Master of Research in Health and Life Science", luogo: "University of the West of Scotland" },
  { anno: "2016 – 2018", titolo: "Laurea Magistrale in Scienza, Tecnica e Didattica dello Sport", luogo: "Università degli Studi di Milano" },
  { anno: "2012 – 2015", titolo: "Laurea in Scienze Motorie, Sport e Salute", luogo: "Università degli Studi di Milano" },
];

const esperienza = [
  { titolo: "Osteopata", luogo: `Studio a Samarate (VA)`, periodo: "Attività attuale" },
  { titolo: "Personal Trainer", luogo: "FitActive", periodo: "2020 – oggi" },
  { titolo: "Track & Field Coach", luogo: "A.S.D. Atletica Gallaratese", periodo: "2015 – oggi" },
  { titolo: "Research Assistant", luogo: "Consiglio Nazionale delle Ricerche (CNR)", periodo: "2017 – 2020" },
  { titolo: "Strength & Conditioning Coach", luogo: "Azalee Calcio Femminile", periodo: "2018 – 2019" },
];

export default function ChiSono() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-mist to-white py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <Reveal delay={0} className="flex-1 flex justify-center order-2 md:order-1">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-xl ring-1 ring-navy/10">
              <Image src="/mattia.jpg" alt="Mattia Lavarda nel suo studio di osteopatia" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 24rem" />
            </div>
          </Reveal>
          <div className="flex-1 order-1 md:order-2">
            <Reveal delay={0}>
              <span className="inline-block bg-steel/10 text-steel text-sm font-semibold px-3 py-1 rounded-full mb-4">
                Il tuo osteopata
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-4xl font-bold text-navy mb-4">
                Mattia <span className="text-steel">Lavarda</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-navy/70 leading-relaxed mb-4">
                Sono osteopata e chinesiologo. Dopo la laurea in Scienze Motorie, Sport e Salute e la magistrale
                in Scienza, Tecnica e Didattica dello Sport all&apos;Università degli Studi di Milano, ho approfondito
                il mio percorso con un Master of Research in Scozia e con anni di esperienza nella ricerca sulla
                fisiologia dell&apos;esercizio fisico.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <p className="text-navy/70 leading-relaxed">
                Questo background mi ha insegnato a guardare al corpo come a un sistema unico e interconnesso.
                Nel mio studio di Samarate accompagno le persone — dagli sportivi a chi convive con dolori
                quotidiani — verso un migliore equilibrio, una postura più sana e una ritrovata libertà di movimento.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Valori */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal delay={0}>
            <h2 className="text-3xl font-bold text-navy text-center mb-12">Il mio approccio</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valori.map(({ icon: Icon, titolo, desc }, i) => (
              <Reveal key={titolo} delay={i * 90} className="lift bg-white rounded-xl p-8 shadow-sm border border-navy/10 text-center hover:border-steel/40 hover:shadow-md">
                <div className="w-14 h-14 bg-steel/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-steel" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-navy text-lg mb-3">{titolo}</h3>
                <p className="text-sm text-navy/60 leading-relaxed">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Formazione + Esperienza */}
      <section className="bg-mist py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <Reveal delay={0}>
              <h2 className="text-2xl font-bold text-navy mb-8">Formazione</h2>
            </Reveal>
            <ol className="relative border-l-2 border-steel/20 space-y-8 pl-8">
              {formazione.map(({ anno, titolo, luogo }, i) => (
                <Reveal key={titolo} delay={i * 100} className="relative">
                  <span className="absolute -left-[41px] w-5 h-5 rounded-full bg-steel border-4 border-mist" aria-hidden="true" />
                  <span className="text-xs font-bold text-steel uppercase tracking-wide">{anno}</span>
                  <p className="mt-1 text-navy font-medium leading-snug">{titolo}</p>
                  <p className="text-sm text-navy/60">{luogo}</p>
                </Reveal>
              ))}
            </ol>
          </div>
          <div>
            <Reveal delay={0}>
              <h2 className="text-2xl font-bold text-navy mb-8">Esperienza</h2>
            </Reveal>
            <ul className="space-y-5">
              {esperienza.map(({ titolo, luogo, periodo }, i) => (
                <Reveal key={titolo + periodo} delay={i * 80} className="lift bg-white rounded-xl p-5 shadow-sm border border-navy/10 hover:border-steel/40 hover:shadow-md">
                  <p className="font-semibold text-navy">{titolo}</p>
                  <p className="text-sm text-navy/60">{luogo}</p>
                  <p className="text-xs text-steel font-medium mt-1">{periodo}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Reviews />

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-navy">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal delay={0}>
            <h2 className="text-3xl font-bold text-white mb-4">Parliamo del tuo benessere</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-white/80 mb-8">Prenota una visita allo studio di {site.addressShort}.</p>
          </Reveal>
          <Reveal delay={180}>
            <Link
              href="/contatti#prenotazione"
              className="press bg-white text-navy font-semibold px-8 py-3 rounded-lg hover:bg-mist transition-colors duration-200 cursor-pointer inline-flex items-center gap-2"
            >
              Prenota ora <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
