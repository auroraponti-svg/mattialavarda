import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
// L'analisi di Google può richiedere parecchi secondi: alziamo il limite.
export const maxDuration = 60;

// Categorie Lighthouse che chiediamo a Google.
const CATEGORIES = ["performance", "seo", "accessibility", "best-practices"] as const;

// Etichette leggibili per i suggerimenti raggruppati.
const CAT_LABEL: Record<string, string> = { seo: "SEO", performance: "Performance" };

type AuditRef = { id: string; weight?: number };

// GET /api/seo-audit?url=...&strategy=mobile|desktop
// Chiama la PageSpeed Insights API di Google e restituisce punteggi + suggerimenti.
// La chiave sta in GOOGLE_PAGESPEED_API_KEY (variabile d'ambiente, non nel codice).
export async function GET(request: Request) {
  const key = process.env.GOOGLE_PAGESPEED_API_KEY?.trim();
  if (!key) {
    // Nessuna chiave configurata: il pannello mostra le istruzioni.
    return NextResponse.json({ configured: false });
  }

  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url")?.trim();
  if (!target) {
    return NextResponse.json({ error: "Parametro 'url' mancante." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "URL non valido." }, { status: 400 });
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return NextResponse.json({ error: "URL non valido." }, { status: 400 });
  }

  const strategy = searchParams.get("strategy") === "desktop" ? "desktop" : "mobile";

  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", parsed.toString());
  api.searchParams.set("key", key);
  api.searchParams.set("strategy", strategy);
  api.searchParams.set("locale", "it");
  for (const c of CATEGORIES) api.searchParams.append("category", c);

  let res: Response;
  try {
    res = await fetch(api.toString(), { cache: "no-store" });
  } catch {
    return NextResponse.json({ error: "Impossibile contattare Google PageSpeed." }, { status: 502 });
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    const msg = data?.error?.message || `Errore PageSpeed (${res.status}).`;
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const lh = data.lighthouseResult;
  if (!lh) {
    return NextResponse.json({ error: "Nessun risultato da PageSpeed." }, { status: 502 });
  }

  const scoreOf = (id: string): number | null => {
    const s = lh.categories?.[id]?.score;
    return typeof s === "number" ? Math.round(s * 100) : null;
  };

  const scores = {
    performance: scoreOf("performance"),
    seo: scoreOf("seo"),
    accessibility: scoreOf("accessibility"),
    bestPractices: scoreOf("best-practices"),
  };

  // Suggerimenti: audit non superati o migliorabili (score < 0.9) delle categorie
  // SEO e Performance, ordinati per peso (prima i più importanti).
  const audits = lh.audits ?? {};
  const seen = new Set<string>();
  const suggestions: { title: string; category: string; displayValue?: string }[] = [];
  for (const cat of ["seo", "performance"]) {
    const refs: AuditRef[] = lh.categories?.[cat]?.auditRefs ?? [];
    const failing = refs
      .map((r) => ({ ref: r, audit: audits[r.id] }))
      .filter(({ audit }) => audit && typeof audit.score === "number" && audit.score < 0.9)
      .sort((a, b) => (b.ref.weight ?? 0) - (a.ref.weight ?? 0));
    for (const { audit } of failing) {
      if (seen.has(audit.title)) continue;
      seen.add(audit.title);
      suggestions.push({
        title: audit.title,
        category: CAT_LABEL[cat],
        displayValue: audit.displayValue || undefined,
      });
    }
  }

  return NextResponse.json({
    configured: true,
    url: parsed.toString(),
    strategy,
    scores,
    suggestions: suggestions.slice(0, 12),
    fetchedAt: new Date().toISOString(),
  });
}
