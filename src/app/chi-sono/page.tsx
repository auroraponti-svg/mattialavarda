import type { Metadata } from "next";
import { GraduationCap, Award, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Chi Sono | OsteoGallarate",
  description: "Scopri la formazione e l'approccio del tuo osteopata di fiducia a Gallarate.",
};

const percorso = [
  { anno: "2010", evento: "Laurea in Osteopatia presso il Collegio Italiano di Osteopatia" },
  { anno: "2012", evento: "Specializzazione in Osteopatia Cranio-Sacrale" },
  { anno: "2014", evento: "Master in Osteopatia Pediatrica" },
  { anno: "2015", evento: "Apertura dello studio a Gallarate" },
  { anno: "Oggi", evento: "Oltre 10 anni di esperienza al servizio dei pazienti" },
];

const valori = [
  {
    icon: Heart,
    titolo: "Ascolto",
    desc: "Ogni paziente è unico. Dedico tempo all'ascolto per comprendere la storia e le esigenze di ognuno.",
  },
  {
    icon: GraduationCap,
    titolo: "Formazione continua",
    desc: "Mi aggiorno costantemente con corsi e congressi nazionali e internazionali.",
  },
  {
    icon: Award,
    titolo: "Professionalità",
    desc: "Iscritto al Registro degli Osteopati d'Italia (ROI), garanzia di qualità e deontologia.",
  },
];

export default function ChiSono() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F0FDFA] to-[#CCFBF1] py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl bg-[#0891B2]/10 flex items-center justify-center text-[#0891B2]/30 text-center text-sm border-2 border-dashed border-[#0891B2]/20">
              <span>Foto del professionista<br />(da inserire)</span>
            </div>
          </div>
          <div className="flex-1">
            <span className="inline-block bg-[#0891B2]/10 text-[#0891B2] text-sm font-semibold px-3 py-1 rounded-full mb-4">
              Il tuo osteopata
            </span>
            <h1 className="text-4xl font-bold text-[#134E4A] mb-4">
              Dott. <span className="text-[#0891B2]">Nome Cognome</span>
            </h1>
            <p className="text-[#134E4A]/70 leading-relaxed mb-4">
              Sono un osteopata con oltre 10 anni di esperienza nel trattamento di dolori muscoloscheletrici,
              disfunzioni posturali e problematiche legate allo stress. Il mio studio si trova nel cuore di Gallarate,
              facilmente raggiungibile da tutta la provincia di Varese.
            </p>
            <p className="text-[#134E4A]/70 leading-relaxed">
              Credo in un approccio olistico alla salute: il corpo è un sistema interconnesso e ogni trattamento
              deve tenere conto della persona nella sua interezza — fisicamente ed emotivamente.
            </p>
          </div>
        </div>
      </section>

      {/* Valori */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#134E4A] text-center mb-12">Il mio approccio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valori.map(({ icon: Icon, titolo, desc }) => (
              <div key={titolo} className="bg-white rounded-xl p-8 shadow-sm border border-[#0891B2]/10 text-center">
                <div className="w-14 h-14 bg-[#0891B2]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-[#0891B2]" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-[#134E4A] text-lg mb-3">{titolo}</h3>
                <p className="text-sm text-[#134E4A]/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Percorso */}
      <section className="bg-[#F0FDFA] py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#134E4A] text-center mb-12">Percorso formativo</h2>
          <ol className="relative border-l-2 border-[#0891B2]/20 space-y-8 pl-8">
            {percorso.map(({ anno, evento }) => (
              <li key={anno} className="relative">
                <span className="absolute -left-[41px] w-5 h-5 rounded-full bg-[#0891B2] border-4 border-[#F0FDFA]" aria-hidden="true" />
                <span className="text-xs font-bold text-[#0891B2] uppercase tracking-wide">{anno}</span>
                <p className="mt-1 text-[#134E4A] leading-relaxed">{evento}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
