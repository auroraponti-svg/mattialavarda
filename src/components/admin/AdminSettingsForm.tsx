"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2, Eye, EyeOff, ExternalLink, BarChart2, Calendar, Share2, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  gtmId: string;
  calApiKey: string;
  lookerStudioUrl: string;
  socialInstagram: string;
  socialFacebook: string;
  socialLinkedin: string;
  socialTiktok: string;
  socialYoutube: string;
};

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
  gtmId, calApiKey, lookerStudioUrl,
  socialInstagram, socialFacebook, socialLinkedin, socialTiktok, socialYoutube,
}: Props) {
  const supabase = createClient();

  const [gtm, setGtm] = useState(gtmId);
  const [cal, setCal] = useState(calApiKey);
  const [looker, setLooker] = useState(lookerStudioUrl);
  const [instagram, setInstagram] = useState(socialInstagram);
  const [facebook, setFacebook] = useState(socialFacebook);
  const [linkedin, setLinkedin] = useState(socialLinkedin);
  const [tiktok, setTiktok] = useState(socialTiktok);
  const [youtube, setYoutube] = useState(socialYoutube);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  async function save() {
    setSaving(true);
    const updates = [
      { key: "gtm_container_id", value: gtm.trim() },
      { key: "cal_api_key", value: cal.trim() },
      { key: "looker_studio_url", value: looker.trim() },
      { key: "social_instagram", value: instagram.trim() },
      { key: "social_facebook", value: facebook.trim() },
      { key: "social_linkedin", value: linkedin.trim() },
      { key: "social_tiktok", value: tiktok.trim() },
      { key: "social_youtube", value: youtube.trim() },
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

      {/* ── Prenotazioni ── */}
      <div className="bg-white rounded-xl border border-navy/10 p-6 space-y-5">
        <SectionHeader
          icon={Calendar}
          title="Prenotazioni"
          description="Cal.com — agenda e appuntamenti online"
        />

        <div>
          <label className="block text-xs font-medium text-navy/70 mb-1">Cal.com — API Key</label>
          <input
            value={cal}
            onChange={e => setCal(e.target.value)}
            placeholder="cal_live_xxxxxxxxxxxx"
            type={showSecrets ? "text" : "password"}
            className={monoClass}
          />
          <p className="text-xs text-navy/40 mt-1">Cal.com → Impostazioni → Sviluppatore → Chiavi API</p>
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
