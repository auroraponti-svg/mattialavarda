import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Mattia Lavarda Osteopata",
  description: "Articoli e consigli su osteopatia, postura, movimento e benessere da Mattia Lavarda, osteopata a Samarate.",
};

const articoli = [
  {
    slug: "mal-di-schiena-cause-rimedi",
    titolo: "Mal di schiena: cause principali e come l'osteopatia può aiutarti",
    categoria: "Lombalgia",
    data: "15 Giugno 2025",
    lettura: "5 min",
    estratto:
      "Il mal di schiena è uno dei disturbi più diffusi. Le cause più comuni e come un trattamento osteopatico personalizzato può alleviare il dolore e prevenire le ricadute.",
  },
  {
    slug: "postura-corretta-lavoro",
    titolo: "Postura corretta al lavoro: i consigli dell'osteopata",
    categoria: "Postura",
    data: "2 Giugno 2025",
    lettura: "4 min",
    estratto:
      "Passare molte ore seduti può causare tensioni e dolori. Esercizi e accorgimenti per mantenere una postura corretta durante la giornata lavorativa.",
  },
  {
    slug: "movimento-prevenzione",
    titolo: "Il movimento come prevenzione: cosa dice la scienza",
    categoria: "Sport",
    data: "20 Maggio 2025",
    lettura: "6 min",
    estratto:
      "Un corpo che si muove bene è un corpo più sano. Come attività fisica e osteopatia lavorano insieme nella prevenzione degli infortuni.",
  },
];

const categorie = ["Tutti", "Lombalgia", "Postura", "Sport", "Benessere"];

export default function Blog() {
  return (
    <>
      <section className="bg-gradient-to-br from-mist to-white py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-steel/10 text-steel text-sm font-semibold px-3 py-1 rounded-full mb-4">
            Articoli e consigli
          </span>
          <h1 className="text-4xl font-bold text-navy mb-4">Blog</h1>
          <p className="text-navy/60 max-w-xl mx-auto">
            Approfondimenti su osteopatia, postura, movimento e benessere.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-10" role="list" aria-label="Filtra per categoria">
            {categorie.map((cat) => (
              <span
                key={cat}
                role="listitem"
                className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 ${
                  cat === "Tutti"
                    ? "bg-steel text-white"
                    : "bg-white border border-navy/15 text-navy hover:border-steel hover:text-steel"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articoli.map(({ slug, titolo, categoria, data, lettura, estratto }) => (
              <article
                key={slug}
                className="bg-white rounded-xl shadow-sm border border-navy/10 hover:shadow-md hover:border-steel/30 transition-all duration-200 flex flex-col"
              >
                <div className="h-40 bg-mist rounded-t-xl flex items-center justify-center text-steel/30 text-sm border-b border-navy/10">
                  Immagine articolo
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-steel bg-steel/10 px-2 py-0.5 rounded-full">{categoria}</span>
                    <span className="flex items-center gap-1 text-xs text-navy/40">
                      <Clock size={12} aria-hidden="true" /> {lettura}
                    </span>
                  </div>
                  <h2 className="font-bold text-navy mb-3 leading-snug">{titolo}</h2>
                  <p className="text-sm text-navy/60 leading-relaxed flex-1 mb-4">{estratto}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-navy/40">{data}</span>
                    <Link
                      href={`/blog/${slug}`}
                      className="text-sm font-semibold text-steel hover:text-navy transition-colors duration-200 cursor-pointer flex items-center gap-1"
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
