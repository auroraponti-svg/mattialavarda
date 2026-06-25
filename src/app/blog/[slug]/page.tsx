import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/server";
import { formatDate, type Post } from "@/lib/posts";

export const revalidate = 60;

async function getPost(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return (data as Post) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Articolo non trovato" };
  return {
    title: `${post.title} | Blog Mattia Lavarda`,
    description: post.excerpt,
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
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
