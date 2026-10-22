"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2, Eye, EyeOff, ExternalLink, BarChart2, Calendar, Share2, Globe, ShieldCheck } from "lucide-react";

type Props = {
  gtmId: string;
  analyticsCode: string;
  lookerStudioUrl: string;
  iubendaPrivacyEmbed: string;
  iubendaCookieEmbed: string;
  iubendaCsEmbed: string;
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
  gtmId, analyticsCode, lookerStudioUrl,
  iubendaPrivacyEmbed, iubendaCookieEmbed, iubendaCsEmbed,
  bookingDuration, bookingBuffer, bookingStart, bookingEnd, bookingDays, bookingLeadHours, bookingEmails, googleConnected,
  socialInstagram, socialFacebook, socialLinkedin, socialTiktok, socialYoutube,
  googleReviewUrl,
}: Props) {
  const [gtm, setGtm] = useState(gtmId);
  const [analytics, setAnalytics] = useState(analyticsCode);
  const [looker, setLooker] = useState(lookerStudioUrl);
  const [iubPrivacy, setIubPrivacy] = useState(iubendaPrivacyEmbed);
  const [iubCookie, setIubCookie] = useState(iubendaCookieEmbed);
  const [iubCs, setIubCs] = useState(iubendaCsEmbed);

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
  const [saveError, setSaveError] = useState("");
  const [showSecrets, setShowSecrets] = useState(false);

  async function save() {
    setSaving(true);
    setSaveError("");
    const values = {
      gtm_container_id: gtm.trim(),
      analytics_code: analytics.trim(),
      looker_studio_url: looker.trim(),
      booking_duration: bkDuration.trim(),
      booking_buffer: bkBuffer.trim(),
      booking_start: bkStart.trim(),
      booking_end: bkEnd.trim(),
      booking_days: bkDays.join(","),
      booking_lead_hours: bkLead.trim(),
      booking_emails: bkEmails,
      iubenda_privacy_embed: iubPrivacy.trim(),
      iubenda_cookie_embed: iubCookie.trim(),
      iubenda_cs_embed: iubCs.trim(),
      social_instagram: instagram.trim(),
      social_facebook: facebook.trim(),
      social_linkedin: linkedin.trim(),
      social_tiktok: tiktok.trim(),
      social_youtube: youtube.trim(),
      google_review_url: googleReview.trim(),
    };
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error || "Salvataggio non riuscito. Riprova.");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setSaveError("Connessione non riuscita. Riprova.");
    }
    setSaving(false);
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
          <label className="block text-xs font-medium text-navy/70 mb-1">Codice Google Analytics / Tag Google</label>
          <textarea
            value={analytics}
            onChange={e => setAnalytics(e.target.value)}
            placeholder={'Incolla qui l\'intero codice che ti dà Google (es. <!-- Google tag (gtag.js) --> <script async src="...gtag/js?id=G-XXXX"></script> <script>…</script>)'}
            rows={5}
            className={monoClass + " resize-y"}
          />
          <p className="text-xs text-navy/40 mt-1">
            Incolla tutto il blocco di codice (non solo l&apos;ID): lo inserisco io nell&apos;&lt;head&gt; di ogni pagina per tracciare le visite. Puoi usare questo <strong>oppure</strong> GTM qui sopra, non serve entrambi.
          </p>
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
          description="Incolla i 3 codici di incorporamento forniti da iubenda. Li gestisco io nel sito."
        />

        <div>
          <label className="block text-xs font-medium text-navy/70 mb-1">1. Privacy Policy — codice</label>
          <textarea
            value={iubPrivacy}
            onChange={e => setIubPrivacy(e.target.value)}
            placeholder={'<a href="https://www.iubenda.com/privacy-policy/..." class="iubenda-white iubenda-embed">Privacy Policy</a><script>…</script>'}
            rows={4}
            className={monoClass + " resize-y"}
          />
          <p className="text-xs text-navy/40 mt-1">Diventa il pulsante &quot;Privacy Policy&quot; nel footer (apre la policy in un riquadro).</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-navy/70 mb-1">2. Cookie Policy — codice</label>
          <textarea
            value={iubCookie}
            onChange={e => setIubCookie(e.target.value)}
            placeholder={'<a href="https://www.iubenda.com/privacy-policy/.../cookie-policy" class="iubenda-white iubenda-embed">Cookie Policy</a><script>…</script>'}
            rows={4}
            className={monoClass + " resize-y"}
          />
          <p className="text-xs text-navy/40 mt-1">Diventa il pulsante &quot;Cookie Policy&quot; nel footer.</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-navy/70 mb-1">3. Privacy Controls and Cookie Solution — codice</label>
          <textarea
            value={iubCs}
            onChange={e => setIubCs(e.target.value)}
            placeholder={'<script type="text/javascript" src="https://embeds.iubenda.com/widgets/....js"></script>'}
            rows={3}
            className={monoClass + " resize-y"}
          />
          <p className="text-xs text-navy/40 mt-1">È il banner di consenso: lo carico su tutte le pagine, compare all&apos;ingresso e gestisce i cookie.</p>
        </div>
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
              <option value="patient">Solo al paziente</option>
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
      {saveError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2" role="alert">
          {saveError}
        </p>
      )}
    </div>
  );
}
