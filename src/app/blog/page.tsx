import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | OsteoGallarate",
  description: "Articoli e consigli su osteopatia, postura e benessere dal tuo osteopata di Gallarate.",
};

const articoli = [
  {
    slug: "mal-di-schiena-cause-rimedi",
    titolo: "Mal di schiena: cause principali e come l'osteopatia può aiutarti",
    categoria: "Lombalgia",
    data: "15 Giugno 2025",
    lettura: "5 min",
    estratto:
      "Il mal di schiena è uno dei disturbi più diffusi. Scopri le cause più comuni e come un trattamento osteopatico personalizzato può alleviare il dolore e prevenire le ricadute.",
  },
  {
    slug: "postura-corretta-lavoro",
    titolo: "Postura corretta al lavoro: i consigli dell'osteopata",
    categoria: "Postura",
    data: "2 Giugno 2025",
    lettura: "4 min",
    estratto:
      "Passare molte ore seduti davanti al computer può causare tensioni e dolori. Ecco alcuni esercizi e accorgimenti per mantenere una postura corretta durante la giornata lavorativa.",
  },
  {
    slug: "emicrania-osteopatia",
    titolo: "Emicrania e cefalea: l'approccio osteopatico",
    categoria: "Cefalee",
    data: "20 Maggio 2025",
    lettura: "6 min",
    estratto:
      "Le cefalee ricorrenti possono avere origini muscoloscheletriche. L'osteopatia cranio-sacrale offre risultati concreti nel ridurre frequenza e intensità degli episodi.",
  },
  {
    slug: "osteopatia-bambini",
    titolo: "Osteopatia pediatrica: quando portare il tuo bambino",
    categoria: "Pediatria",
    data: "5 Maggio 2025",
    lettura: "5 min",
    estratto:
      "L'osteopatia può essere utile fin dai primi giorni di vita. Scopri in quali casi è indicata e cosa aspettarsi dalla prima visita per il tuo bambino.",
  },
  {
    slug: "stress-corpo-osteopatia",
    titolo: "Come lo stress si manifesta nel corpo e come trattarlo",
    categoria: "Benessere",
    data: "18 Aprile 2025",
    lettura: "4 min",
    estratto:
      "Lo stress cronico lascia tracce tangibili nel nostro corpo: tensioni muscolari, insonnia, problemi digestivi. L'osteopatia lavora per ripristinare l'equilibrio fisico ed emotivo.",
  },
  {
    slug: "prima-visita-osteopatica",
    titolo: "Cosa aspettarsi dalla prima visita osteopatica",
    categoria: "Info",
    data: "1 Aprile 2025",
    lettura: "3 min",
    estratto:
      "Non sai cosa succede durante una seduta di osteopatia? Ecco una guida completa alla prima visita: dall'anamnesi al trattamento, senza sorprese.",
  },
];

const categorie = ["Tutti", "Lombalgia", "Postura", "Cefalee", "Pediatria", "Benessere", "Info"];

export default function Blog() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#F0FDFA] to-[#CCFBF1] py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-[#0891B2]/10 text-[#0891B2] text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Articoli e consigli
          </span>
          <h1 className="text-4xl font-bold text-[#134E4A] mb-4">Blog</h1>
          <p className="text-[#134E4A]/60 max-w-xl mx-auto">
            Approfondimenti su osteopatia, postura e benessere scritti dal tuo specialista di Gallarate.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Filtri categoria */}
          <div className="flex flex-wrap gap-2 mb-10" role="list" aria-label="Filtra per categoria">
            {categorie.map((cat) => (
              <span
                key={cat}
                role="listitem"
                className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 ${
                  cat === "Tutti"
                    ? "bg-[#0891B2] text-white"
                    : "bg-white border border-[#0891B2]/20 text-[#134E4A] hover:border-[#0891B2] hover:text-[#0891B2]"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Articoli */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articoli.map(({ slug, titolo, categoria, data, lettura, estratto }) => (
              <article
                key={slug}
                className="bg-white rounded-xl shadow-sm border border-[#0891B2]/10 hover:shadow-md hover:border-[#0891B2]/30 transition-all duration-200 flex flex-col"
              >
                <div className="h-40 bg-[#0891B2]/5 rounded-t-xl flex items-center justify-center text-[#0891B2]/20 text-sm border-b border-[#0891B2]/10">
                  Immagine articolo
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-[#0891B2] bg-[#0891B2]/10 px-2 py-0.5 rounded-full">
                      {categoria}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#134E4A]/40">
                      <Clock size={12} aria-hidden="true" /> {lettura}
                    </span>
                  </div>
                  <h2 className="font-bold text-[#134E4A] mb-3 leading-snug">{titolo}</h2>
                  <p className="text-sm text-[#134E4A]/60 leading-relaxed flex-1 mb-4">{estratto}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-[#134E4A]/40">{data}</span>
                    <Link
                      href={`/blog/${slug}`}
                      className="text-sm font-semibold text-[#0891B2] hover:text-[#22D3EE] transition-colors duration-200 cursor-pointer flex items-center gap-1"
                    >
                      Leggi <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
