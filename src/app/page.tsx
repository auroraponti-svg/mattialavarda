import Link from "next/link";
import { CheckCircle, Star, ArrowRight } from "lucide-react";

const servizi = [
  { titolo: "Dolori alla schiena", desc: "Trattamento di lombalgie, ernie e tensioni muscolari." },
  { titolo: "Cefalee e emicranie", desc: "Approccio cranio-sacrale per ridurre frequenza e intensità." },
  { titolo: "Dolori posturali", desc: "Correzione delle disfunzioni posturali e prevenzione." },
  { titolo: "Problemi articolari", desc: "Spalle, ginocchia, anche: recupero della mobilità." },
  { titolo: "Stress e tensioni", desc: "Tecniche osteopatiche per il rilascio delle tensioni profonde." },
  { titolo: "Osteopatia pediatrica", desc: "Trattamenti delicati e specifici per neonati e bambini." },
];

const recensioni = [
  { nome: "Marco B.", testo: "Professionista eccellente. Ho risolto un dolore alla schiena cronico in poche sedute.", stelle: 5 },
  { nome: "Giulia R.", testo: "Finalmente ho trovato sollievo alle mie emicranie. Lo consiglio a tutti!", stelle: 5 },
  { nome: "Luca T.", testo: "Ottimo approccio, molto attento e preciso. Studio accogliente a Gallarate.", stelle: 5 },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F0FDFA] to-[#CCFBF1] py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="inline-block bg-[#0891B2]/10 text-[#0891B2] text-sm font-semibold px-3 py-1 rounded-full mb-4">
              Studio Osteopatico a Gallarate
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#134E4A] leading-tight mb-6">
              Il tuo benessere<br />
              <span className="text-[#0891B2]">è la nostra priorità</span>
            </h1>
            <p className="text-[#134E4A]/70 text-lg leading-relaxed mb-8 max-w-lg">
              Trattamenti osteopatici personalizzati per dolori, postura e benessere generale.
              Un approccio professionale e umano al servizio della tua salute.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contatti"
                className="bg-[#22C55E] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#16a34a] transition-colors duration-200 cursor-pointer flex items-center gap-2"
              >
                Prenota una visita <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/chi-sono"
                className="bg-white text-[#0891B2] font-semibold px-6 py-3 rounded-lg border border-[#0891B2]/30 hover:border-[#0891B2] transition-colors duration-200 cursor-pointer"
              >
                Chi sono
              </Link>
            </div>
            <ul className="mt-8 flex flex-col sm:flex-row gap-3 text-sm text-[#134E4A]/70">
              {["Iscritto al ROI", "10+ anni di esperienza", "Primo colloquio gratuito"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#22C55E]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-2xl bg-[#0891B2]/10 flex items-center justify-center text-[#0891B2]/30 text-center text-sm border-2 border-dashed border-[#0891B2]/20">
              <span>Foto del professionista<br />(da inserire)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Servizi */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#134E4A] mb-3">I nostri trattamenti</h2>
            <p className="text-[#134E4A]/60 max-w-xl mx-auto">
              Ogni trattamento è studiato in base alle esigenze individuali del paziente.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servizi.map(({ titolo, desc }) => (
              <div
                key={titolo}
                className="bg-white rounded-xl p-6 shadow-sm border border-[#0891B2]/10 hover:border-[#0891B2]/30 hover:shadow-md transition-all duration-200 cursor-default"
              >
                <div className="w-10 h-10 bg-[#0891B2]/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle size={20} className="text-[#0891B2]" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-[#134E4A] mb-2">{titolo}</h3>
                <p className="text-sm text-[#134E4A]/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recensioni */}
      <section className="bg-[#F0FDFA] py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#134E4A] mb-3">Cosa dicono i pazienti</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recensioni.map(({ nome, testo, stelle }) => (
              <div key={nome} className="bg-white rounded-xl p-6 shadow-sm border border-[#0891B2]/10">
                <div className="flex gap-1 mb-3" aria-label={`${stelle} stelle su 5`}>
                  {Array.from({ length: stelle }).map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm text-[#134E4A]/70 leading-relaxed mb-4">&ldquo;{testo}&rdquo;</p>
                <p className="text-sm font-semibold text-[#134E4A]">{nome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 bg-[#0891B2]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pronto a stare meglio?</h2>
          <p className="text-white/80 mb-8">
            Prenota oggi stesso la tua prima visita. Il primo colloquio è gratuito.
          </p>
          <Link
            href="/contatti"
            className="bg-white text-[#0891B2] font-semibold px-8 py-3 rounded-lg hover:bg-[#F0FDFA] transition-colors duration-200 cursor-pointer inline-flex items-center gap-2"
          >
            Contattaci ora <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
