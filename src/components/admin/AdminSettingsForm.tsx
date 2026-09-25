"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2, Eye, EyeOff, ExternalLink, BarChart2, Calendar, Share2, Globe, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  gtmId: string;
  lookerStudioUrl: string;
  iubendaScript: string;
  iubendaPrivacyUrl: string;
  iubendaCookieUrl: string;
  bookingDuration: string;
  bookingBuffer: string;
  bookingStart: string;
  bookingEnd: string;
  bookingDays: string;
  bookingLeadHours: string;
  bookingEmails: string;
  googleConnected: boolean;
  socialInstagram: string;
  socialFacebook: string;
  socialLinkedin: string;
  socialTiktok: string;
  socialYoutube: string;
  googleReviewUrl: string;
};

const DAY_LABELS: { n: number; label: string }[] = [
  { n: 1, label: "Lun" }, { n: 2, label: "Mar" }, { n: 3, label: "Mer" },
  { n: 4, label: "Gio" }, { n: 5, label: "Ven" }, { n: 6, label: "Sab" }, { n: 7, label: "Dom" },
];

function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description?: React.ReactNode }) {
  return (
    <div className="flex gap-3 pb-4 border-b border-navy/8">
      <div className="w-8 h-8 rounded-lg bg-steel/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={15} className="text-steel" />
      </div>
      <div>
        <h3 className="font-semibold text-navy text-sm">{title}</h3>
        {description && <p className="text-xs text-navy/50 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

export default function AdminSettingsForm({
  gtmId, lookerStudioUrl,
  iubendaScript, iubendaPrivacyUrl, iubendaCookieUrl,
  bookingDuration, bookingBuffer, bookingStart, bookingEnd, bookingDays, bookingLeadHours, bookingEmails, googleConnected,
  socialInstagram, socialFacebook, socialLinkedin, socialTiktok, socialYoutube,
  googleReviewUrl,
}: Props) {
  const supabase = createClient();

  const [gtm, setGtm] = useState(gtmId);
  const [looker, setLooker] = useState(lookerStudioUrl);
  const [iubScript, setIubScript] = useState(iubendaScript);
  const [iubPrivacy, setIubPrivacy] = useState(iubendaPrivacyUrl);
  const [iubCookie, setIubCookie] = useState(iubendaCookieUrl);

  const [bkDuration, setBkDuration] = useState(bookingDuration || "60");
  const [bkBuffer, setBkBuffer] = useState(bookingBuffer || "10");
  const [bkStart, setBkStart] = useState(bookingStart || "09:00");
  const [bkEnd, setBkEnd] = useState(bookingEnd || "19:00");
  const [bkDays, setBkDays] = useState<number[]>(
    (bookingDays || "1,2,3,4,5").split(",").map(Number).filter((n) => n >= 1 && n <= 7)
  );
  const [bkLead, setBkLead] = useState(bookingLeadHours || "2");
  const [bkEmails, setBkEmails] = useState(bookingEmails || "all");

  function toggleDay(n: number) {
    setBkDays((prev) => (prev.includes(n) ? prev.filter((d) => d !== n) : [...prev, n].sort()));
  }

  async function disconnectGoogle() {
    await fetch("/api/google/disconnect", { method: "POST" });
    window.location.href = "/admin?tab=impostazioni&google=disconnected";
  }
  const [instagram, setInstagram] = useState(socialInstagram);
  const [facebook, setFacebook] = useState(socialFacebook);
  const [linkedin, setLinkedin] = useState(socialLinkedin);
  const [tiktok, setTiktok] = useState(socialTiktok);
  const [youtube, setYoutube] = useState(socialYoutube);
  const [googleReview, setGoogleReview] = useState(googleReviewUrl);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  async function save() {
    setSaving(true);
    const updates = [
      { key: "gtm_container_id", value: gtm.trim() },
      { key: "looker_studio_url", value: looker.trim() },
      { key: "booking_duration", value: bkDuration.trim() },
      { key: "booking_buffer", value: bkBuffer.trim() },
      { key: "booking_start", value: bkStart.trim() },
      { key: "booking_end", value: bkEnd.trim() },
      { key: "booking_days", value: bkDays.join(",") },
      { key: "booking_lead_hours", value: bkLead.trim() },
      { key: "booking_emails", value: bkEmails },
      { key: "iubenda_script", value: iubScript.trim() },
      { key: "iubenda_privacy_url", value: iubPrivacy.trim() },
      { key: "iubenda_cookie_url", value: iubCookie.trim() },
      { key: "social_instagram", value: instagram.trim() },
      { key: "social_facebook", value: facebook.trim() },
      { key: "social_linkedin", value: linkedin.trim() },
      { key: "social_tiktok", value: tiktok.trim() },
      { key: "social_youtube", value: youtube.trim() },
      { key: "google_review_url", value: googleReview.trim() },
    ];
    for (const u of updates) {
      await supabase.from("site_settings").upsert({ key: u.key, value: u.value, updated_at: new Date().toISOString() });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputClass = "w-full rounded-lg border border-navy/15 px-3 py-2 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-steel/40 focus:border-steel transition";
  const monoClass = inputClass + " font-mono";

  return (
    <div className="space-y-5 max-w-2xl">

      {/* ── Analytics ── */}
      <div className="bg-white rounded-xl border border-navy/10 p-6 space-y-5">
        <SectionHeader
          icon={BarChart2}
          title="Analytics"
          description="Tracciamento visite e statistiche del sito"
        />

        <div>
          <label className="block text-xs font-medium text-navy/70 mb-1">Google Tag Manager — Container ID</label>
          <input value={gtm} onChange={e => setGtm(e.target.value)} placeholder="GTM-XXXXXXX" className={monoClass} />
          <p className="text-xs text-navy/40 mt-1">tagmanager.google.com → il tuo container → ID in alto a destra</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-navy/70 mb-1">Looker Studio — URL embed report</label>
          <input value={looker} onChange={e => setLooker(e.target.value)} placeholder="https://lookerstudio.google.com/embed/reporting/..." className={monoClass} />
          <p className="text-xs text-navy/40 mt-1">
            <a href="https://lookerstudio.google.com" target="_blank" rel="noopener noreferrer" className="text-steel inline-flex items-center gap-0.5 hover:underline">lookerstudio.google.com <ExternalLink size={10} /></a>
            {" · "}File → Incorpora report → copia l&apos;URL src dell&apos;iframe
          </p>
        </div>
      </div>

      {/* ── Privacy & Cookie (iubenda) ── */}
      <div className="bg-white rounded-xl border border-navy/10 p-6 space-y-5">
        <SectionHeader
          icon={ShieldCheck}
          title="Privacy & Cookie (iubenda)"
          description="Banner di consenso all'ingresso e link alle policy nel footer"
        />

        <div>
          <label className="block text-xs font-medium text-navy/70 mb-1">Codice banner cookie</label>
          <textarea
            value={iubScript}
            onChange={e => setIubScript(e.target.value)}
            placeholder="Incolla qui il codice del banner cookie fornito da iubenda (i tag <script>…)"
            rows={5}
            className={monoClass + " resize-y"}
          />
          <p className="text-xs text-navy/40 mt-1">
            iubenda → il tuo sito → Cookie Solution → &quot;Incorpora&quot;. Incolla l&apos;intero blocco: il popup comparirà automaticamente all&apos;ingresso.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-navy/70 mb-1">Link Privacy Policy</label>
            <input value={iubPrivacy} onChange={e => setIubPrivacy(e.target.value)} placeholder="https://www.iubenda.com/privacy-policy/..." className={monoClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy/70 mb-1">Link Cookie Policy</label>
            <input value={iubCookie} onChange={e => setIubCookie(e.target.value)} placeholder="https://www.iubenda.com/privacy-policy/.../cookie-policy" className={monoClass} />
          </div>
        </div>
        <p className="text-xs text-navy/40">I due pulsanti compaiono nel footer solo quando i link sono inseriti.</p>
      </div>

      {/* ── Prenotazioni (Google Calendar) ── */}
      <div className="bg-white rounded-xl border border-navy/10 p-6 space-y-5">
        <SectionHeader
          icon={Calendar}
          title="Prenotazioni (Google Calendar)"
          description="Il pannello di prenotazione legge gli impegni dal calendario di Mattia e crea gli appuntamenti"
        />

        {/* Stato collegamento */}
        <div className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 ${googleConnected ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
          <div className="flex items-center gap-2 text-sm">
            <span className={`w-2 h-2 rounded-full ${googleConnected ? "bg-green-500" : "bg-amber-500"}`} />
            <span className={googleConnected ? "text-green-800" : "text-amber-800"}>
              {googleConnected ? "Google Calendar collegato" : "Google Calendar non ancora collegato"}
            </span>
          </div>
          {googleConnected ? (
            <button onClick={disconnectGoogle} className="text-xs font-semibold text-navy/60 hover:text-navy underline cursor-pointer">
              Scollega
            </button>
          ) : (
            <a href="/api/google/connect" className="text-xs font-semibold bg-steel text-white px-3 py-1.5 rounded-md hover:bg-navy transition-colors cursor-pointer">
              Collega Google Calendar
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-navy/70 mb-1">Durata (min)</label>
            <input value={bkDuration} onChange={e => setBkDuration(e.target.value)} inputMode="numeric" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy/70 mb-1">Buffer (min)</label>
            <input value={bkBuffer} onChange={e => setBkBuffer(e.target.value)} inputMode="numeric" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy/70 mb-1">Apertura</label>
            <input value={bkStart} onChange={e => setBkStart(e.target.value)} placeholder="09:00" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy/70 mb-1">Chiusura</label>
            <input value={bkEnd} onChange={e => setBkEnd(e.target.value)} placeholder="19:00" className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-navy/70 mb-2">Giorni lavorativi</label>
          <div className="flex flex-wrap gap-2">
            {DAY_LABELS.map(({ n, label }) => (
              <button
                key={n}
                type="button"
                onClick={() => toggleDay(n)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${bkDays.includes(n) ? "bg-steel text-white border-steel" : "bg-white text-navy/60 border-navy/15 hover:border-steel/40"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-navy/70 mb-1">Preavviso minimo (ore)</label>
            <input value={bkLead} onChange={e => setBkLead(e.target.value)} inputMode="numeric" className={inputClass} />
            <p className="text-xs text-navy/40 mt-1">Quanto tempo prima si può prenotare l&apos;ultimo slot.</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-navy/70 mb-1">Email di conferma</label>
            <select value={bkEmails} onChange={e => setBkEmails(e.target.value)} className={inputClass}>
              <option value="all">Al paziente e a Mattia</option>
              <option value="owner">Solo a Mattia</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Social media ── */}
      <div className="bg-white rounded-xl border border-navy/10 p-6 space-y-5">
        <SectionHeader
          icon={Share2}
          title="Social media"
          description="I link inseriti appariranno nel footer del sito. Lascia vuoto per nascondere."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Instagram", value: instagram, set: setInstagram, placeholder: "https://instagram.com/..." },
            { label: "Facebook", value: facebook, set: setFacebook, placeholder: "https://facebook.com/..." },
            { label: "LinkedIn", value: linkedin, set: setLinkedin, placeholder: "https://linkedin.com/in/..." },
            { label: "TikTok", value: tiktok, set: setTiktok, placeholder: "https://tiktok.com/@..." },
            { label: "YouTube", value: youtube, set: setYoutube, placeholder: "https://youtube.com/@..." },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label className="block text-xs font-medium text-navy/70 mb-1">{label}</label>
              <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder} className={inputClass} />
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-navy/8">
          <label className="block text-xs font-medium text-navy/70 mb-1">Google — link per lasciare una recensione</label>
          <input value={googleReview} onChange={e => setGoogleReview(e.target.value)} placeholder="https://g.page/r/.../review" className={inputClass} />
          <p className="text-xs text-navy/40 mt-1">
            Google Business Profile → &quot;Chiedi recensioni&quot; → copia il link. Attiva il pulsante &quot;Lascia una recensione&quot; nella sezione recensioni del sito.
          </p>
        </div>
      </div>

      {/* ── Sito web ── */}
      <div className="bg-white rounded-xl border border-navy/10 p-6 space-y-5">
        <SectionHeader
          icon={Globe}
          title="Sito web"
          description="Informazioni generali del sito"
        />
        <p className="text-xs text-navy/40">
          Nome, indirizzo, telefono e altri dettagli sono configurati direttamente nel codice sorgente (<code className="bg-mist px-1 rounded">src/lib/site.ts</code>).
          Per modificarli contatta il tuo sviluppatore.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pb-2">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-steel text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-navy transition-colors disabled:opacity-60 cursor-pointer"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? "Salvato!" : "Salva impostazioni"}
        </button>
        <button
          onClick={() => setShowSecrets(!showSecrets)}
          className="inline-flex items-center gap-1.5 text-sm text-navy/50 hover:text-navy transition-colors cursor-pointer"
        >
          {showSecrets ? <EyeOff size={15} /> : <Eye size={15} />}
          {showSecrets ? "Nascondi" : "Mostra"} chiavi segrete
        </button>
      </div>
    </div>
  );
}
