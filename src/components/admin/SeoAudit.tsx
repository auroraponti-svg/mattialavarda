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
// Esito di una singola pagina.
type PageResult =
  | { ok: true; label: string; path: string; scores: Scores; suggestions: Suggestion[] }
  | { ok: false; label: string; path: string; message: string };

// Suggerimento aggregato su tutto il sito (con le pagine che lo presentano).
type AggSuggestion = { title: string; category: string; displayValue?: string; pages: string[] };

function scoreColor(v: number | null) {
  if (v === null) return "#94A3B8";
  if (v >= 90) return "#16A34A";
  if (v >= 50) return "#D97706";
  return "#DC2626";
}

function ScoreCircle({ label, value, big = false }: { label: string; value: number | null; big?: boolean }) {
  const size = big ? "w-16 h-16 text-xl" : "w-9 h-9 text-xs";
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${size} rounded-full flex items-center justify-center font-bold border-2`}
        style={{ color: scoreColor(value), borderColor: scoreColor(value) }}
      >
        {value ?? "—"}
      </div>
      <span className={`${big ? "text-xs" : "text-[10px]"} text-navy/50 text-center leading-tight`}>
        {label}
      </span>
    </div>
  );
}

// Media dei punteggi non nulli.
function avg(values: (number | null)[]): number | null {
  const nums = values.filter((v): v is number => typeof v === "number");
  if (nums.length === 0) return null;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export default function SeoAudit({ configured }: { configured: boolean }) {
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<PageResult[] | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  async function analyzeAll() {
    setLoading(true);
    const results = await Promise.all(
      PAGES.map(async ({ path, label }): Promise<PageResult> => {
        const full = site.url.replace(/\/$/, "") + path;
        try {
          const res = await fetch(
            `/api/seo-audit?url=${encodeURIComponent(full)}&strategy=${strategy}`
          );
          const data = await res.json();
          if (!res.ok || data.error) {
            return { ok: false, label, path, message: data.error || "Errore durante l'analisi." };
          }
          return { ok: true, label, path, scores: data.scores, suggestions: data.suggestions ?? [] };
        } catch {
          return { ok: false, label, path, message: "Connessione fallita." };
        }
      })
    );
    setDone(results);
    setFetchedAt(new Date().toISOString());
    setLoading(false);
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

  const okResults = done?.filter((r): r is Extract<PageResult, { ok: true }> => r.ok) ?? [];

  // Punteggi medi del sito.
  const overall: Scores = {
    seo: avg(okResults.map((r) => r.scores.seo)),
    performance: avg(okResults.map((r) => r.scores.performance)),
    accessibility: avg(okResults.map((r) => r.scores.accessibility)),
    bestPractices: avg(okResults.map((r) => r.scores.bestPractices)),
  };

  // Suggerimenti aggregati: stesso titolo = un'unica voce, con l'elenco delle pagine.
  const aggMap = new Map<string, AggSuggestion>();
  for (const r of okResults) {
    for (const s of r.suggestions) {
      const existing = aggMap.get(s.title);
      if (existing) {
        if (!existing.pages.includes(r.label)) existing.pages.push(r.label);
      } else {
        aggMap.set(s.title, {
          title: s.title,
          category: s.category,
          displayValue: s.displayValue,
          pages: [r.label],
        });
      }
    }
  }
  const aggSuggestions = Array.from(aggMap.values()).sort((a, b) => b.pages.length - a.pages.length);

  return (
    <div className="bg-white rounded-xl border border-navy/10 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h3 className="text-sm font-semibold text-navy flex items-center gap-2">
          <Gauge size={15} className="text-steel" /> Analisi SEO Google (PageSpeed)
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
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
          {/* Pulsante unico: analizza tutto il sito */}
          <button
            type="button"
            onClick={analyzeAll}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-steel text-white text-xs font-semibold px-3.5 py-1.5 rounded-md hover:bg-navy transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            {loading ? "Analisi in corso…" : done ? "Rianalizza tutto" : "Analizza tutto il sito"}
          </button>
        </div>
      </div>

      {!done && !loading && (
        <p className="text-sm text-navy/50">
          Premi <strong>“Analizza tutto il sito”</strong> per lo stato SEO complessivo e i suggerimenti di Google.
        </p>
      )}

      {loading && (
        <p className="text-sm text-navy/50">
          Google sta analizzando le {PAGES.length} pagine… può richiedere qualche decina di secondi.
        </p>
      )}

      {done && (
        <div className="space-y-5">
          {/* Stato generale del sito */}
          {okResults.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-navy/40 uppercase tracking-wide mb-2">
                Stato generale del sito ({okResults.length}/{PAGES.length} pagine · media)
              </p>
              <div className="flex items-center justify-around bg-mist/50 rounded-lg py-4">
                <ScoreCircle label="SEO" value={overall.seo} big />
                <ScoreCircle label="Performance" value={overall.performance} big />
                <ScoreCircle label="Accessibilità" value={overall.accessibility} big />
                <ScoreCircle label="Best Practice" value={overall.bestPractices} big />
              </div>
            </div>
          )}

          {/* Dettaglio per pagina (compatto) */}
          <div>
            <p className="text-xs font-semibold text-navy/40 uppercase tracking-wide mb-2">
              Dettaglio pagine
            </p>
            <div className="space-y-2">
              {done.map((r) => (
                <div
                  key={r.path}
                  className="flex items-center justify-between gap-3 border border-navy/10 rounded-lg px-3 py-2"
                >
                  <span className="text-sm font-semibold text-navy shrink-0">{r.label}</span>
                  {r.ok ? (
                    <div className="flex items-center gap-4">
                      <ScoreCircle label="SEO" value={r.scores.seo} />
                      <ScoreCircle label="Perf." value={r.scores.performance} />
                      <ScoreCircle label="Access." value={r.scores.accessibility} />
                      <ScoreCircle label="Best Pr." value={r.scores.bestPractices} />
                    </div>
                  ) : (
                    <span className="text-xs text-red-600 text-right">{r.message}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Suggerimenti complessivi */}
          {aggSuggestions.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-navy/40 uppercase tracking-wide mb-2">
                Suggerimenti di Google ({aggSuggestions.length})
              </p>
              <ul className="space-y-1.5">
                {aggSuggestions.map((s, i) => (
                  <li key={i} className="text-xs text-navy/70 flex items-start gap-2">
                    <span className="text-[10px] font-semibold text-steel bg-steel/10 rounded px-1 py-0.5 mt-0.5 shrink-0">
                      {s.category}
                    </span>
                    <span>
                      {s.title}
                      {s.displayValue && <span className="text-navy/40"> — {s.displayValue}</span>}
                      <span className="text-navy/35">
                        {" "}
                        · {s.pages.length === PAGES.length ? "tutte le pagine" : s.pages.join(", ")}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            okResults.length > 0 && (
              <p className="text-xs text-green-600">Nessun problema rilevante rilevato su tutto il sito. 👍</p>
            )
          )}

          <a
            href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(site.url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-steel hover:text-navy transition-colors"
          >
            Apri il report completo su PageSpeed <ExternalLink size={11} />
          </a>
        </div>
      )}

      <p className="text-[11px] text-navy/40 mt-4 leading-relaxed">
        L&apos;analisi usa Google PageSpeed Insights sulle pagine pubbliche del sito. Perché funzioni, il
        sito dev&apos;essere online e raggiungibile su {site.url.replace(/^https?:\/\//, "")}.
      </p>
    </div>
  );
}
