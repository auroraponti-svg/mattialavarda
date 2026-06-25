import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, type Post } from "@/lib/posts";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Blog | Mattia Lavarda Osteopata",
  description: "Articoli e consigli su osteopatia, postura, movimento e benessere da Mattia Lavarda, osteopata a Samarate.",
};

export const revalidate = 60;

export default async function Blog() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const articoli = (data ?? []) as Post[];

  return (
    <>
      <section className="bg-gradient-to-br from-mist to-white py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal delay={0}>
            <span className="inline-block bg-steel/10 text-steel text-sm font-semibold px-3 py-1 rounded-full mb-4">
              Articoli e consigli
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-4xl font-bold text-navy mb-4">Blog</h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-navy/60 max-w-xl mx-auto">
              Approfondimenti su osteopatia, postura, movimento e benessere.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {articoli.length === 0 ? (
            <Reveal delay={0}>
              <p className="text-center text-navy/50 py-12">
                Non ci sono ancora articoli pubblicati. Torna a trovarci presto!
              </p>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articoli.map((a, i) => (
                <Reveal key={a.id} delay={(i % 3) * 80} className="lift flex flex-col bg-white rounded-xl shadow-sm border border-navy/10 hover:shadow-md hover:border-steel/30 overflow-hidden">
                  <article className="flex flex-col flex-1">
                    <Link href={`/blog/${a.slug}`} className="block">
                      <div className="relative h-44 bg-mist">
                        {a.cover_image ? (
                          <Image src={a.cover_image} alt={a.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 22rem" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-steel/30 text-sm">
                            Mattia Lavarda · Osteopata
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-semibold text-steel bg-steel/10 px-2 py-0.5 rounded-full">{a.category}</span>
                        <span className="text-xs text-navy/40">{formatDate(a.created_at)}</span>
                      </div>
                      <h2 className="font-bold text-navy mb-3 leading-snug">
                        <Link href={`/blog/${a.slug}`} className="hover:text-steel transition-colors cursor-pointer">
                          {a.title}
                        </Link>
                      </h2>
                      <p className="text-sm text-navy/60 leading-relaxed flex-1 mb-4">{a.excerpt}</p>
                      <Link
                        href={`/blog/${a.slug}`}
                        className="text-sm font-semibold text-steel hover:text-navy transition-colors duration-200 cursor-pointer flex items-center gap-1 mt-auto"
                      >
                        Leggi l&apos;articolo <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
