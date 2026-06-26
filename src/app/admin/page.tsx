import Link from "next/link";
import {
  Plus, Pencil, CircleCheck, CircleDashed,
  BarChart3, FileText, TrendingUp, Settings,
  AlertTriangle, Users, Eye, CalendarDays, Clock, ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, type Post } from "@/lib/posts";
import { LogoutButton, DeleteButton } from "@/components/admin/AdminActions";
import { getSeoLevel, seoColors, seoLabels } from "@/lib/seo";
import AdminSettingsForm from "@/components/admin/AdminSettingsForm";
import { fetchCalBookings } from "@/lib/analytics";

export const dynamic = "force-dynamic";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("it-IT", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "sito" } = await searchParams;

  const supabase = await createClient();
  const [{ data: postsData }, { data: settingsData }] = await Promise.all([
    supabase.from("posts").select("*").order("created_at", { ascending: false }),
    supabase.from("site_settings").select("key, value"),
  ]);

  const posts = (postsData ?? []) as Post[];
  const settings = Object.fromEntries(
    (settingsData ?? []).map((r: { key: string; value: string }) => [r.key, r.value])
  );

  const published = posts.filter((p) => p.published).length;
  const drafts = posts.filter((p) => !p.published).length;
  const seoGreen = posts.filter((p) => getSeoLevel(p) === "green").length;
  const seoOrange = posts.filter((p) => getSeoLevel(p) === "orange").length;
  const seoRed = posts.filter((p) => getSeoLevel(p) === "red").length;
  const seoScore = posts.length > 0 ? Math.round((seoGreen / posts.length) * 100) : 0;

  const bookings = tab === "sito"
    ? await fetchCalBookings(settings.cal_api_key ?? "")
    : null;

  const lookerUrl = settings.looker_studio_url ?? "";

  const tabs = [
    { id: "sito", label: "Stato del sito", icon: BarChart3 },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "impostazioni", label: "Impostazioni", icon: Settings },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Pannello di controllo</h1>
          <p className="text-navy/50 text-sm mt-0.5">Benvenuto nel tuo spazio di gestione.</p>
        </div>
        <LogoutButton />
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-mist rounded-xl p-1 mb-8 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            href={`/admin?tab=${id}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id ? "bg-white text-navy shadow-sm" : "text-navy/50 hover:text-navy"
            }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </div>

      {/* ── TAB: STATO SITO ── */}
      {tab === "sito" && (
        <div className="space-y-6">

          {/* Row 1: Articoli + SEO */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-navy/10 shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-navy/40 uppercase tracking-wide">Articoli</span>
                <FileText size={15} className="text-steel" />
              </div>
              <p className="text-3xl font-bold text-navy">{posts.length}</p>
              <p className="text-xs text-navy/40 mt-1">{published} pubblicati · {drafts} bozze</p>
            </div>

            <div className="bg-white rounded-xl border border-navy/10 shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-navy/40 uppercase tracking-wide">Salute SEO</span>
                <TrendingUp size={15} className="text-steel" />
              </div>
              <p className="text-3xl font-bold" style={{ color: seoScore >= 70 ? "#16A34A" : seoScore >= 40 ? "#D97706" : "#DC2626" }}>
                {seoScore}%
              </p>
              <p className="text-xs text-navy/40 mt-1">
                <span className="text-green-600">{seoGreen}✓</span>
                {" · "}
                <span className="text-amber-600">{seoOrange}△</span>
                {" · "}
                <span className="text-red-600">{seoRed}✗</span>
              </p>
            </div>
          </div>

          {/* Analytics: Looker Studio embed */}
          <div className="bg-white rounded-xl border border-navy/10 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-navy flex items-center gap-2">
                <BarChart3 size={15} className="text-steel" /> Analytics — Google Looker Studio
              </h3>
              {lookerUrl && (
                <a
                  href={lookerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-steel hover:text-navy transition-colors"
                >
                  Apri in grande <ExternalLink size={11} />
                </a>
              )}
            </div>

            {lookerUrl ? (
              <div className="rounded-lg overflow-hidden border border-navy/10" style={{ height: 500 }}>
                <iframe
                  src={lookerUrl}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  style={{ border: 0 }}
                />
              </div>
            ) : (
              <div className="rounded-lg bg-mist border border-navy/10 p-8 text-center space-y-3">
                <Eye size={28} className="text-steel/40 mx-auto" />
                <p className="text-sm font-medium text-navy/60">Analytics non ancora configurato</p>
                <p className="text-xs text-navy/40 max-w-sm mx-auto">
                  Collega Looker Studio a Google Analytics 4 e incolla l&apos;URL del report nelle Impostazioni per vedere le statistiche qui.
                </p>
                <Link
                  href="/admin?tab=impostazioni"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-steel hover:text-navy transition-colors mt-2"
                >
                  → Configura nelle Impostazioni
                </Link>
              </div>
            )}
          </div>

          {/* Prenotazioni Cal.com */}
          <div className="bg-white rounded-xl border border-navy/10 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-navy mb-4 flex items-center gap-2">
              <CalendarDays size={15} className="text-steel" /> Prossimi appuntamenti
            </h3>
            {!bookings || bookings.error ? (
              <div className="text-center py-6">
                <p className="text-sm text-navy/40 mb-2">{bookings?.error ?? "Chiave API non configurata"}</p>
                <Link href="/admin?tab=impostazioni" className="text-xs font-semibold text-steel hover:text-navy transition-colors">
                  → Configura Cal.com nelle Impostazioni
                </Link>
              </div>
            ) : bookings.upcoming.length === 0 ? (
              <p className="text-sm text-navy/40 py-4 text-center">Nessun appuntamento in programma.</p>
            ) : (
              <ul className="space-y-3">
                {bookings.upcoming.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-steel/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock size={14} className="text-steel" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">{b.attendee || b.title}</p>
                      <p className="text-xs text-navy/40">{fmt(b.start)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Alert SEO */}
          {seoRed > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle size={16} className="text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800">{seoRed} articolo/i con problemi SEO critici</p>
                <p className="text-xs text-red-700 mt-0.5">Vai nella tab <strong>Blog</strong> e apri gli articoli con pallino rosso.</p>
              </div>
            </div>
          )}
          {seoOrange > 0 && seoRed === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">{seoOrange} articolo/i con SEO migliorabile</p>
                <p className="text-xs text-amber-700 mt-0.5">Vai nella tab <strong>Blog</strong> e apri gli articoli con pallino arancione.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: BLOG ── */}
      {tab === "blog" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-navy/50">{posts.length} articoli totali · {published} pubblicati · {drafts} bozze</p>
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
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600"><CircleCheck size={13} /> Pubblicato</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600"><CircleDashed size={13} /> Bozza</span>
                        )}
                        <span className="text-xs text-navy/40">· {p.category} · {formatDate(p.created_at)}</span>
                        <span className="inline-flex items-center gap-1 text-xs font-medium" title={seoLabels[level]} style={{ color: seoColors[level] }}>
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: seoColors[level] }} />
                          SEO
                        </span>
                      </div>
                      <p className="font-semibold text-navy truncate">{p.title}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <Link href={`/admin/${p.id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-steel hover:text-navy transition-colors cursor-pointer">
                        <Pencil size={15} /> Modifica
                      </Link>
                      <DeleteButton id={p.id} title={p.title} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* ── TAB: IMPOSTAZIONI ── */}
      {tab === "impostazioni" && (
        <AdminSettingsForm
          gtmId={settings.gtm_container_id ?? ""}
          calApiKey={settings.cal_api_key ?? ""}
          lookerStudioUrl={settings.looker_studio_url ?? ""}
          socialInstagram={settings.social_instagram ?? ""}
          socialFacebook={settings.social_facebook ?? ""}
          socialLinkedin={settings.social_linkedin ?? ""}
          socialTiktok={settings.social_tiktok ?? ""}
          socialYoutube={settings.social_youtube ?? ""}
        />
      )}
    </div>
  );
}
