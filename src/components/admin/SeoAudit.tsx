"use client";

import { useState } from "react";
import { Gauge, RefreshCw, ExternalLink, Smartphone, Monitor } from "lucide-react";
import { site } from "@/lib/site";

// Pagine principali da analizzare (relative al dominio del sito).
const PAGES = [
  { path: "/", label: "Home" },
  { path: "/chi-sono", label: "Chi Sono" },
  { path: "/blog", label: "Blog" },
  { path: "/contatti", label: "Contatti" },
];

type Scores = {
  performance: number | null;
  seo: number | null;
  accessibility: number | null;
  bestPractices: number | null;
};
type Suggestion = { title: string; category: string; displayValue?: string };
type Result =
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "done"; scores: Scores; suggestions: Suggestion[]; fetchedAt: string };

function scoreColor(v: number | null) {
  if (v === null) return "#94A3B8";
  if (v >= 90) return "#16A34A";
  if (v >= 50) return "#D97706";
  return "#DC2626";
}

function ScoreBadge({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2"
        style={{ color: scoreColor(value), borderColor: scoreColor(value) }}
      >
        {value ?? "—"}
      </div>
      <span className="text-[11px] text-navy/50 text-center leading-tight">{label}</span>
    </div>
  );
}

export default function SeoAudit({ configured }: { configured: boolean }) {
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [results, setResults] = useState<Record<string, Result>>({});

  async function analyze(path: string) {
    const full = site.url.replace(/\/$/, "") + path;
    setResults((r) => ({ ...r, [path]: { state: "loading" } }));
    try {
      const res = await fetch(
        `/api/seo-audit?url=${encodeURIComponent(full)}&strategy=${strategy}`
      );
      const data = await res.json();
      if (!res.ok || data.error) {
        setResults((r) => ({
          ...r,
          [path]: { state: "error", message: data.error || "Errore durante l'analisi." },
        }));
        return;
      }
      setResults((r) => ({
        ...r,
        [path]: {
          state: "done",
          scores: data.scores,
          suggestions: data.suggestions ?? [],
          fetchedAt: data.fetchedAt,
        },
      }));
    } catch {
      setResults((r) => ({
        ...r,
        [path]: { state: "error", message: "Connessione fallita." },
      }));
    }
  }

  if (!configured) {
    return (
      <div className="bg-white rounded-xl border border-navy/10 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-navy flex items-center gap-2 mb-2">
          <Gauge size={15} className="text-steel" /> Analisi SEO Google (PageSpeed)
        </h3>
        <p className="text-sm text-navy/60 leading-relaxed">
          Per attivare l&apos;analisi reale di Google, aggiungi la variabile d&apos;ambiente{" "}
          <code className="bg-mist px-1.5 py-0.5 rounded text-navy font-mono text-xs">
            GOOGLE_PAGESPEED_API_KEY
          </code>{" "}
          su Vercel (Settings → Environment Variables) con la tua chiave API PageSpeed, poi
          esegui un nuovo deploy.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-navy/10 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h3 className="text-sm font-semibold text-navy flex items-center gap-2">
          <Gauge size={15} className="text-steel" /> Analisi SEO Google (PageSpeed)
        </h3>
        {/* Scelta dispositivo */}
        <div className="flex items-center gap-1 bg-mist rounded-lg p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setStrategy("mobile")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              strategy === "mobile" ? "bg-white text-navy shadow-sm" : "text-navy/50"
            }`}
          >
            <Smartphone size={12} /> Mobile
          </button>
          <button
            type="button"
            onClick={() => setStrategy("desktop")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              strategy === "desktop" ? "bg-white text-navy shadow-sm" : "text-navy/50"
            }`}
          >
            <Monitor size={12} /> Desktop
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {PAGES.map(({ path, label }) => {
          const r = results[path];
          return (
            <div key={path} className="border border-navy/10 rounded-lg p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy">{label}</p>
                  <p className="text-xs text-navy/40 truncate">
                    {site.url.replace(/\/$/, "") + path}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => analyze(path)}
                  disabled={r?.state === "loading"}
                  className="shrink-0 inline-flex items-center gap-1.5 bg-steel text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-navy transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={12} className={r?.state === "loading" ? "animate-spin" : ""} />
                  {r?.state === "loading" ? "Analisi…" : r ? "Rianalizza" : "Analizza"}
                </button>
              </div>

              {r?.state === "error" && (
                <p className="text-xs text-red-600 mt-2">{r.message}</p>
              )}

              {r?.state === "done" && (
                <div className="mt-3">
                  <div className="flex items-center justify-around bg-mist/50 rounded-lg py-2">
                    <ScoreBadge label="SEO" value={r.scores.seo} />
                    <ScoreBadge label="Performance" value={r.scores.performance} />
                    <ScoreBadge label="Accessibilità" value={r.scores.accessibility} />
                    <ScoreBadge label="Best Practice" value={r.scores.bestPractices} />
                  </div>

                  {r.suggestions.length > 0 ? (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-navy/60 mb-1.5">
                        Suggerimenti di Google ({r.suggestions.length})
                      </p>
                      <ul className="space-y-1">
                        {r.suggestions.map((s, i) => (
                          <li key={i} className="text-xs text-navy/70 flex items-start gap-1.5">
                            <span className="text-[10px] font-semibold text-steel bg-steel/10 rounded px-1 py-0.5 mt-0.5 shrink-0">
                              {s.category}
                            </span>
                            <span>
                              {s.title}
                              {s.displayValue && (
                                <span className="text-navy/40"> — {s.displayValue}</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-xs text-green-600 mt-3">
                      Nessun problema rilevante rilevato. 👍
                    </p>
                  )}

                  <a
                    href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(
                      site.url.replace(/\/$/, "") + path
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-steel hover:text-navy transition-colors mt-3"
                  >
                    Report completo su PageSpeed <ExternalLink size={11} />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-navy/40 mt-4 leading-relaxed">
        L&apos;analisi usa Google PageSpeed Insights sulle pagine pubbliche del sito. Perché
        funzioni, il sito dev&apos;essere online e raggiungibile su {site.url.replace(/^https?:\/\//, "")}.
      </p>
    </div>
  );
}
