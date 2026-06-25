import Link from "next/link";
import Image from "next/image";
import { Activity, Brain, PersonStanding, Dumbbell, HeartPulse, Baby, CheckCircle, ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";
import HeroBackground from "@/components/HeroBackground";

const trattamenti = [
  { icon: Activity, titolo: "Dolori muscoloscheletrici", desc: "Cervicalgie, lombalgie, dolori articolari e tensioni muscolari trattati con tecniche manuali mirate." },
  { icon: PersonStanding, titolo: "Disfunzioni posturali", desc: "Valutazione e correzione degli squilibri posturali, con un approccio che integra osteopatia e scienze motorie." },
  { icon: Brain, titolo: "Cefalee e tensioni", desc: "Trattamento delle cefalee tensive e dello stress accumulato attraverso tecniche dolci e cranio-sacrali." },
  { icon: Dumbbell, titolo: "Osteopatia sportiva", desc: "Preparazione, recupero e prevenzione degli infortuni per atleti e sportivi di ogni livello." },
  { icon: HeartPulse, titolo: "Recupero funzionale", desc: "Percorsi di recupero del movimento dopo infortuni o periodi di inattività, basati sull'evidenza." },
  { icon: Baby, titolo: "Benessere generale", desc: "Trattamenti per migliorare mobilità, respirazione e qualità della vita quotidiana." },
];

const punti = ["Osteopata e Chinesiologo", "Background scientifico in Scienze Motorie", "Approccio basato sull'evidenza"];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-mist to-white py-20 px-4 sm:px-6">
        <HeroBackground />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <Reveal delay={0}>
              <span className="inline-block bg-steel/10 text-steel text-sm font-semibold px-3 py-1 rounded-full mb-4">
                Studio a {site.addressShort}
              </span>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="text-4xl sm:text-5xl font-bold text-navy leading-tight mb-6">
                Il movimento è salute,<br />
                <span className="text-steel">l&apos;equilibrio è benessere</span>
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="text-navy/70 text-lg leading-relaxed mb-8 max-w-lg">
                Sono <strong className="text-navy">Mattia Lavarda</strong>, osteopata e chinesiologo.
                Aiuto le persone a ritrovare equilibrio e libertà di movimento attraverso trattamenti
                osteopatici personalizzati e un approccio scientifico al corpo.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contatti"
                  className="press bg-steel text-white font-semibold px-6 py-3 rounded-lg hover:bg-navy cursor-pointer flex items-center gap-2"
                >
                  Prenota una visita <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  href="/chi-sono"
                  className="press bg-white text-steel font-semibold px-6 py-3 rounded-lg border border-steel/30 hover:border-steel cursor-pointer"
                >
                  Scopri chi sono
                </Link>
              </div>
            </Reveal>
            <Reveal delay={340}>
              <ul className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3 text-sm text-navy/70">
                {punti.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-steel" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="flex-1 flex justify-center">
            <Reveal delay={200} className="w-full max-w-md">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl ring-1 ring-navy/10">
                <Image src="/mattia.jpg" alt="Mattia Lavarda, osteopata, nel suo studio" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 28rem" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Trattamenti */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy mb-3">Di cosa mi occupo</h2>
            <p className="text-navy/60 max-w-xl mx-auto">
              Ogni trattamento parte da una valutazione accurata ed è studiato sulle esigenze della singola persona.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trattamenti.map(({ icon: Icon, titolo, desc }, i) => (
              <Reveal
                key={titolo}
                delay={(i % 3) * 70}
                className="lift bg-white rounded-xl p-6 shadow-sm border border-navy/10 hover:border-steel/40 hover:shadow-md"
              >
                <div className="w-11 h-11 bg-steel/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={22} className="text-steel" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-navy mb-2">{titolo}</h3>
                <p className="text-sm text-navy/60 leading-relaxed">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Approccio / banda */}
      <section className="bg-mist py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">Un approccio che unisce mani e scienza</h2>
          <p className="text-navy/70 leading-relaxed text-lg">
            La mia formazione in osteopatia si intreccia con un solido background in Scienze Motorie e nella
            ricerca sulla fisiologia dell&apos;esercizio. Questo mi permette di leggere il corpo nel suo insieme:
            non solo il sintomo, ma la causa, il movimento e l&apos;equilibrio complessivo della persona.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-navy">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pronto a stare meglio?</h2>
          <p className="text-white/80 mb-8">
            Prenota il tuo appuntamento allo studio di Samarate. Scegli giorno e orario in base alle disponibilità.
          </p>
          <Link
            href="/contatti"
            className="press bg-white text-navy font-semibold px-8 py-3 rounded-lg hover:bg-mist cursor-pointer inline-flex items-center gap-2"
          >
            Prenota ora <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
