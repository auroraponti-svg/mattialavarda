import { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/content";
import { site } from "@/lib/site";

// Calcolata a ogni richiesta: gli articoli si pubblicano dal pannello, quindi l'elenco
// non può restare quello fotografato al momento della costruzione del sito.
// I dati vengono comunque letti dalla cache (60 secondi), senza pesare sull'archivio.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/chi-sono`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contatti`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const posts = await getPublishedPosts();

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at ?? new Date()),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
