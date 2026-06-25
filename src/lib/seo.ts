import type { Post } from "@/lib/posts";

export type SeoLevel = "red" | "orange" | "green";

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function containsKeyword(text: string, kws: string[]): boolean {
  const lower = text.toLowerCase();
  return kws.some((kw) => lower.includes(kw.toLowerCase().trim()));
}

export type SeoCheck = {
  level: SeoLevel;
  message: string;
};

export function analyzeSeo({
  title,
  metaTitle,
  metaDescription,
  keywords,
  excerpt,
  content,
}: {
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  excerpt: string;
  content: string;
}): SeoCheck[] {
  const checks: SeoCheck[] = [];
  const kws = keywords.split(",").map((k) => k.trim()).filter(Boolean);
  const effectiveTitle = metaTitle || title;
  const words = wordCount(content);

  if (!title.trim()) {
    checks.push({ level: "red", message: "Il titolo dell'articolo è obbligatorio." });
  } else if (title.length < 20) {
    checks.push({ level: "orange", message: "Il titolo è molto corto (almeno 20 caratteri)." });
  } else {
    checks.push({ level: "green", message: "Titolo articolo presente." });
  }

  if (words < 100) {
    checks.push({ level: "red", message: `Contenuto troppo corto (${words} parole). Punta ad almeno 300.` });
  } else if (words < 300) {
    checks.push({ level: "orange", message: `Contenuto di ${words} parole. Meglio oltre 300.` });
  } else {
    checks.push({ level: "green", message: `Contenuto ottimo: ${words} parole.` });
  }

  const mt = metaTitle.trim();
  if (!mt) {
    checks.push({ level: "orange", message: "Meta title non impostato: verrà usato il titolo dell'articolo." });
  } else if (mt.length < 30) {
    checks.push({ level: "orange", message: `Meta title corto (${mt.length}/60).` });
  } else if (mt.length > 60) {
    checks.push({ level: "red", message: `Meta title troppo lungo (${mt.length}/60). Google lo tronca.` });
  } else {
    checks.push({ level: "green", message: `Meta title ottimale (${mt.length}/60).` });
  }

  const md = metaDescription.trim();
  if (!md) {
    checks.push({ level: "orange", message: "Meta description non impostata." });
  } else if (md.length < 80) {
    checks.push({ level: "orange", message: `Meta description corta (${md.length}/160).` });
  } else if (md.length > 160) {
    checks.push({ level: "red", message: `Meta description troppo lunga (${md.length}/160).` });
  } else {
    checks.push({ level: "green", message: `Meta description ottimale (${md.length}/160).` });
  }

  if (!excerpt.trim()) {
    checks.push({ level: "orange", message: "Estratto mancante." });
  } else {
    checks.push({ level: "green", message: "Estratto presente." });
  }

  if (kws.length === 0) {
    checks.push({ level: "orange", message: "Nessuna parola chiave inserita." });
  } else {
    if (!containsKeyword(effectiveTitle, kws)) {
      checks.push({ level: "orange", message: `Parola chiave non nel titolo.` });
    } else {
      checks.push({ level: "green", message: "Parola chiave nel titolo." });
    }
    if (content.trim() && !containsKeyword(content, kws)) {
      checks.push({ level: "orange", message: "Parola chiave non nel contenuto." });
    } else if (content.trim()) {
      checks.push({ level: "green", message: "Parola chiave nel contenuto." });
    }
    if (md && !containsKeyword(md, kws)) {
      checks.push({ level: "orange", message: "Parola chiave non nella meta description." });
    } else if (md) {
      checks.push({ level: "green", message: "Parola chiave nella meta description." });
    }
  }

  return checks;
}

export function getSeoLevel(post: Post): SeoLevel {
  const checks = analyzeSeo({
    title: post.title ?? "",
    metaTitle: post.meta_title ?? "",
    metaDescription: post.meta_description ?? "",
    keywords: post.keywords ?? "",
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
  });
  const reds = checks.filter((c) => c.level === "red").length;
  const oranges = checks.filter((c) => c.level === "orange").length;
  if (reds > 0) return "red";
  if (oranges > 2) return "red";
  if (oranges > 0) return "orange";
  return "green";
}

export const seoColors: Record<SeoLevel, string> = {
  red: "#DC2626",
  orange: "#D97706",
  green: "#16A34A",
};

export const seoLabels: Record<SeoLevel, string> = {
  red: "SEO critica",
  orange: "SEO migliorabile",
  green: "SEO ottima",
};
