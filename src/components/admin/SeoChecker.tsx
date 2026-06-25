"use client";

import { analyzeSeo, seoColors, type SeoLevel } from "@/lib/seo";

type Props = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  excerpt: string;
  content: string;
};

export default function SeoChecker(props: Props) {
  const checks = analyzeSeo(props);

  const reds = checks.filter((c) => c.level === "red").length;
  const oranges = checks.filter((c) => c.level === "orange").length;
  const greens = checks.filter((c) => c.level === "green").length;

  const overall: SeoLevel =
    reds > 0 ? "red" : oranges > 2 ? "red" : oranges > 0 ? "orange" : "green";

  const overallLabel =
    overall === "red"
      ? "SEO da migliorare — problemi critici"
      : overall === "orange"
      ? "SEO discreta — ci sono margini di miglioramento"
      : "SEO ottima";

  return (
    <div className="rounded-xl border border-navy/10 bg-white p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: seoColors[overall] }}
        />
        <span className="text-sm font-semibold text-navy">{overallLabel}</span>
        <span className="ml-auto text-xs text-navy/40 flex gap-3">
          <span style={{ color: seoColors.red }}>{reds} critici</span>
          <span style={{ color: seoColors.orange }}>{oranges} suggerimenti</span>
          <span style={{ color: seoColors.green }}>{greens} ok</span>
        </span>
      </div>

      <ul className="space-y-2">
        {checks.map((c, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <span
              className="mt-0.5 text-xs flex-shrink-0"
              style={{ color: seoColors[c.level] }}
            >
              ●
            </span>
            <span className="text-navy/75 leading-snug">{c.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
