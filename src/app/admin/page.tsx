import Link from "next/link";
import {
  Plus, Pencil, CircleCheck, CircleDashed,
  BarChart3, FileText, TrendingUp, AlertCircle,
  CheckCircle2, AlertTriangle, ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, type Post } from "@/lib/posts";
import { LogoutButton, DeleteButton } from "@/components/admin/AdminActions";
import { getSeoLevel, seoColors, seoLabels } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
  const posts = (data ?? []) as Post[];

  const published = posts.filter((p) => p.published);
  const drafts = posts.filter((p) => !p.published);
  const seoGreen = posts.filter((p) => getSeoLevel(p) === "green").length;
  const seoOrange = posts.filter((p) => getSeoLevel(p) === "orange").length;
  const seoRed = posts.filter((p) => getSeoLevel(p) === "red").length;
  const seoScore = posts.length > 0 ? Math.round((seoGreen / posts.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-12">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Pannello di controllo</h1>
          <p className="text-navy/50 mt-1">Benvenuto nel tuo spazio di gestione.</p>
        </div>
        <LogoutButton />
      </div>

      {/* ── STATO DEL SITO ── */}
      <section>
        <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
          <BarChart3 size={20} className="text-steel" /> Stato del sito
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Articoli totali */}
          <div className="bg-white rounded-xl border border-navy/10 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-navy/50 uppercase tracking-wide">Articoli</span>
              <FileText size={16} className="text-steel" />
            </div>
            <p className="text-3xl font-bold text-navy">{posts.length}</p>
            <p className="text-xs text-navy/50 mt-1">{published.length} pubblicati · {drafts.length} bozze</p>
          </div>

          {/* Salute SEO */}
          <div className="bg-white rounded-xl border border-navy/10 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-navy/50 uppercase tracking-wide">Salute SEO</span>
              <TrendingUp size={16} className="text-steel" />
            </div>
            <p className="text-3xl font-bold" style={{ color: seoScore >= 70 ? "#16A34A" : seoScore >= 40 ? "#D97706" : "#DC2626" }}>
              {seoScore}%
            </p>
            <p className="text-xs text-navy/50 mt-1">
              <span className="text-green-600">{seoGreen} ottimi</span>
              {" · "}
              <span className="text-amber-600">{seoOrange} da migliorare</span>
              {" · "}
              <span className="text-red-600">{seoRed} critici</span>
            </p>
          </div>

          {/* Vercel Analytics */}
          <div className="bg-white rounded-xl border border-navy/10 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-navy/50 uppercase tracking-wide">Analytics</span>
              <BarChart3 size={16} className="text-steel" />
            </div>
            <p className="text-sm font-semibold text-navy mb-1">Vercel Analytics</p>
            <p className="text-xs text-navy/50 mb-3">Visite, pagine viste e provenienza traffico.</p>
            <a
              href="https://vercel.com/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-steel hover:text-navy transition-colors"
            >
              Apri dashboard <ExternalLink size={11} />
            </a>
          </div>

          {/* Prenotazioni */}
          <div className="bg-white rounded-xl border border-navy/10 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-navy/50 uppercase tracking-wide">Prenotazioni</span>
              <CheckCircle2 size={16} className="text-steel" />
            </div>
            <p className="text-sm font-semibold text-navy mb-1">Cal.com</p>
            <p className="text-xs text-navy/50 mb-3">Appuntamenti, disponibilità e calendario.</p>
            <a
              href="https://app.cal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-steel hover:text-navy transition-colors"
            >
              Apri Cal.com <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* SEO breakdown per articolo */}
        {posts.length > 0 && (seoOrange > 0 || seoRed > 0) && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">
                  {seoRed > 0 ? `${seoRed} articolo/i con problemi SEO critici` : `${seoOrange} articolo/i con SEO migliorabile`}
                </p>
                <p className="text-xs text-amber-700">
                  Apri gli articoli contrassegnati con il pallino {seoRed > 0 ? "rosso" : "arancione"} e segui i suggerimenti SEO per migliorare il posizionamento.
                </p>
              </div>
            </div>
          </div>
        )}
        {posts.length > 0 && seoRed === 0 && seoOrange === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={16} className="text-green-600 shrink-0" />
              <p className="text-sm font-semibold text-green-800">Tutti gli articoli hanno una SEO ottima. Ottimo lavoro!</p>
            </div>
          </div>
        )}
      </section>

      {/* ── BLOG ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy flex items-center gap-2">
            <FileText size={20} className="text-steel" /> Blog
          </h2>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 bg-steel text-white font-semibold px-4 py-2 rounded-lg hover:bg-navy transition-colors cursor-pointer text-sm"
          >
            <Plus size={16} /> Nuovo articolo
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-navy/50 bg-mist rounded-xl p-8 text-center">Nessun articolo. Inizia creandone uno!</p>
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => {
              const level = getSeoLevel(p);
              return (
                <li key={p.id} className="bg-white rounded-xl border border-navy/10 p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {p.published ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                          <CircleCheck size={13} /> Pubblicato
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                          <CircleDashed size={13} /> Bozza
                        </span>
                      )}
                      <span className="text-xs text-navy/40">· {p.category} · {formatDate(p.created_at)}</span>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-medium"
                        title={seoLabels[level]}
                        style={{ color: seoColors[level] }}
                      >
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: seoColors[level] }} />
                        SEO
                      </span>
                    </div>
                    <p className="font-semibold text-navy truncate">{p.title}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <Link
                      href={`/admin/${p.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-steel hover:text-navy transition-colors cursor-pointer"
                    >
                      <Pencil size={15} /> Modifica
                    </Link>
                    <DeleteButton id={p.id} title={p.title} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
