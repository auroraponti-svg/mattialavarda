import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createPublicClient } from "@/lib/supabase/public";
import { formatDate, type Post } from "@/lib/posts";

export const revalidate = 60;

async function getPost(slug: string): Promise<Post | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return (data as Post) ?? null;
}

// Articoli correlati: prima quelli della stessa categoria, poi i più recenti,
// fino a 3. Serve anche a dare link interni a ogni articolo (SEO).
async function getRelated(currentId: string, category: string): Promise<Post[]> {
  const supabase = createPublicClient();
  const { data: same } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .eq("category", category)
    .neq("id", currentId)
    .order("created_at", { ascending: false })
    .limit(3);
  let related = (same ?? []) as Post[];

  if (related.length < 3) {
    const { data: more } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .neq("id", currentId)
      .order("created_at", { ascending: false })
      .limit(6);
    const extra = ((more ?? []) as Post[]).filter((p) => !related.some((r) => r.id === p.id));
    related = [...related, ...extra].slice(0, 3);
  }
  return related;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Articolo non trovato" };

  // Titolo senza suffisso lungo: i titoli degli articoli sono già descrittivi
  // e il suffisso faceva superare la lunghezza consigliata per il tag <title>.
  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || undefined;
  const url = `/blog/${slug}`;
  const ogImage = post.cover_image || "/og-image.jpg";

  return {
    title,
    description,
    keywords: post.keywords || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelated(post.id, post.category);

  // Il titolo della pagina è già in <h1>. Se il contenuto dell'articolo usa
  // titoli "# " (h1), si creerebbero più H1 nella stessa pagina (male per la
  // SEO): li abbassiamo a "## " (h2), lasciando intatti ## e ### esistenti.
  const content = post.content.replace(/^#(?!#)\s/gm, "## ");

  return (
    <article className="py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-steel hover:text-navy transition-colors cursor-pointer mb-8"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Tutti gli articoli
        </Link>

        <span className="inline-block text-xs font-semibold text-steel bg-steel/10 px-3 py-1 rounded-full mb-4">
          {post.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-navy leading-tight mb-3">{post.title}</h1>
        <p className="text-sm text-navy/40 mb-8">{formatDate(post.created_at)}</p>

        {post.cover_image && (
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-10 ring-1 ring-navy/10">
            <Image src={post.cover_image} alt={post.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 48rem" priority />
          </div>
        )}

        <div className="prose-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>

        {/* Articoli correlati — migliora navigazione e link interni */}
        {related.length > 0 && (
          <aside className="mt-16 pt-10 border-t border-navy/10">
            <h2 className="text-xl font-bold text-navy mb-6">Articoli correlati</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((a) => (
                <article
                  key={a.id}
                  className="lift flex flex-col bg-white rounded-xl shadow-sm border border-navy/10 hover:shadow-md hover:border-steel/30 overflow-hidden"
                >
                  <Link href={`/blog/${a.slug}`} className="block">
                    <div className="relative h-32 bg-mist">
                      {a.cover_image ? (
                        <Image
                          src={a.cover_image}
                          alt={a.title}
                          fill
                          className="object-cover"
                          sizes="(max-width:768px) 100vw, 15rem"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-steel/30 text-xs">
                          Mattia Lavarda · Osteopata
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-steel bg-steel/10 px-2 py-0.5 rounded-full w-fit mb-2">
                      {a.category}
                    </span>
                    <h3 className="font-semibold text-navy text-sm leading-snug mb-3">
                      <Link href={`/blog/${a.slug}`} className="hover:text-steel transition-colors cursor-pointer">
                        {a.title}
                      </Link>
                    </h3>
                    <Link
                      href={`/blog/${a.slug}`}
                      className="text-xs font-semibold text-steel hover:text-navy transition-colors flex items-center gap-1 mt-auto"
                    >
                      Leggi <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
