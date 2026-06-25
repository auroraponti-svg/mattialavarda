"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  ga4Id: string;
  calApiKey: string;
  lookerStudioUrl: string;
};

export default function AdminSettingsForm({ ga4Id, calApiKey, lookerStudioUrl }: Props) {
  const supabase = createClient();
  const [ga4, setGa4] = useState(ga4Id);
  const [cal, setCal] = useState(calApiKey);
  const [looker, setLooker] = useState(lookerStudioUrl);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  async function save() {
    setSaving(true);
    const updates = [
      { key: "ga4_measurement_id", value: ga4.trim() },
      { key: "cal_api_key", value: cal.trim() },
      { key: "looker_studio_url", value: looker.trim() },
    ];
    for (const u of updates) {
      await supabase.from("site_settings").upsert({ key: u.key, value: u.value, updated_at: new Date().toISOString() });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputClass = "w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-steel/40 focus:border-steel transition font-mono";

  return (
    <div className="space-y-8 max-w-2xl">

      {/* GA4 */}
      <div className="bg-white rounded-xl border border-navy/10 p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-navy mb-0.5">Google Analytics 4</h3>
          <p className="text-xs text-navy/50">Il codice misura si trova in GA4 → Amministrazione → Flussi di dati. Formato: <code className="bg-mist px-1 rounded">G-XXXXXXXXXX</code></p>
        </div>
        <div>
          <label className="block text-xs font-medium text-navy/70 mb-1">Measurement ID</label>
          <input value={ga4} onChange={e => setGa4(e.target.value)} placeholder="G-XXXXXXXXXX" className={inputClass} />
        </div>
      </div>

      {/* Looker Studio */}
      <div className="bg-white rounded-xl border border-navy/10 p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-navy mb-0.5">Google Looker Studio — Analytics</h3>
          <p className="text-xs text-navy/50 mb-2">
            Crea un report su Looker Studio collegato a GA4, poi rendilo pubblico e incolla qui l&apos;URL embed.
          </p>
          <ol className="text-xs text-navy/50 space-y-1 list-decimal list-inside">
            <li>Vai su <a href="https://lookerstudio.google.com" target="_blank" rel="noopener noreferrer" className="text-steel underline inline-flex items-center gap-0.5">lookerstudio.google.com <ExternalLink size={10} /></a> e crea un report collegato a GA4</li>
            <li>Clicca <strong>File → Incorpora report</strong></li>
            <li>Abilita la condivisione pubblica e copia l&apos;URL <code className="bg-mist px-1 rounded">src</code> dell&apos;iframe</li>
            <li>Incolla l&apos;URL qui sotto</li>
          </ol>
        </div>
        <div>
          <label className="block text-xs font-medium text-navy/70 mb-1">URL embed Looker Studio</label>
          <input
            value={looker}
            onChange={e => setLooker(e.target.value)}
            placeholder="https://lookerstudio.google.com/embed/reporting/..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Cal.com */}
      <div className="bg-white rounded-xl border border-navy/10 p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-navy mb-0.5">Cal.com — Prenotazioni</h3>
          <p className="text-xs text-navy/50">Trova la chiave API in Cal.com → Impostazioni → Sviluppatore → Chiavi API.</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-navy/70 mb-1">API Key</label>
          <input
            value={cal}
            onChange={e => setCal(e.target.value)}
            placeholder="cal_live_xxxxxxxxxxxx"
            type={showSecrets ? "text" : "password"}
            className={inputClass}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
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
          {showSecrets ? "Nascondi" : "Mostra"} chiavi
        </button>
      </div>
    </div>
  );
}
