"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Globe, Loader2, CheckCircle2, Phone, MessageCircle, ArrowLeft } from "lucide-react";
import { site } from "@/lib/site";

type Slot = { label: string; startISO: string; endISO: string };
type Config = { connected: boolean; days: number[]; durationMin: number; timezone: string };

const MONTHS = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
// Giorno ISO (1=Lun..7=Dom) di una Date locale
function isoDay(d: Date) {
  return d.getDay() === 0 ? 7 : d.getDay();
}

export default function Booking() {
  const [config, setConfig] = useState<Config | null>(null);
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [slot, setSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/booking-config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig({ connected: false, days: [1, 2, 3, 4, 5], durationMin: 60, timezone: "Europe/Rome" }));
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Griglia del mese (lunedì come primo giorno)
  const grid = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const first = new Date(y, m, 1);
    const startPad = (first.getDay() === 0 ? 7 : first.getDay()) - 1;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  function dayEnabled(d: Date): boolean {
    if (!config) return false;
    if (d < today) return false;
    return config.days.includes(isoDay(d));
  }

  function pickDay(d: Date) {
    const key = ymd(d);
    setSelected(key);
    setSlot(null);
    setDone(false);
    setError(null);
    setLoadingSlots(true);
    fetch(`/api/slots?date=${key}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }

  async function submit() {
    if (!slot || !selected) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startISO: slot.startISO, date: selected }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === "slot_taken"
            ? "Questo orario è appena stato prenotato. Scegline un altro."
            : "Non è stato possibile completare la prenotazione. Riprova."
        );
        if (data.error === "slot_taken" && selected) pickDay(new Date(selected));
        return;
      }
      setDone(true);
    } catch {
      setError("Errore di rete. Riprova.");
    } finally {
      setSubmitting(false);
    }
  }

  // Fallback: Google non collegato → telefono / WhatsApp
  if (config && !config.connected) {
    return (
      <div className="w-full rounded-xl border border-navy/10 bg-white p-8 text-center">
        <p className="text-navy/70 mb-6">
          La prenotazione online sarà presto disponibile. Nel frattempo puoi fissare il tuo
          appuntamento contattandomi direttamente:
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={`tel:${site.phoneHref}`} className="press inline-flex items-center gap-2 bg-steel text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy transition-colors cursor-pointer">
            <Phone size={18} aria-hidden="true" /> Chiama {site.phone}
          </a>
          <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="press inline-flex items-center gap-2 bg-white text-navy font-semibold px-6 py-3 rounded-xl border border-navy/15 hover:border-steel/40 transition-colors cursor-pointer">
            <MessageCircle size={18} aria-hidden="true" /> Scrivi su WhatsApp
          </a>
        </div>
      </div>
    );
  }

  // Conferma avvenuta
  if (done) {
    return (
      <div className="w-full rounded-xl border border-navy/10 bg-white p-10 text-center">
        <CheckCircle2 size={44} className="text-green-500 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-xl font-bold text-navy mb-2">Prenotazione confermata!</h3>
        <p className="text-navy/70">
          Ti abbiamo inviato una email di conferma. Ci vediamo in studio a {site.addressShort}.
        </p>
      </div>
    );
  }

  // Form dati paziente (dopo aver scelto lo slot)
  if (slot && selected) {
    const dayLabel = new Date(selected).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
    return (
      <div className="w-full rounded-xl border border-navy/10 bg-white p-6 sm:p-8">
        <button onClick={() => setSlot(null)} className="inline-flex items-center gap-1.5 text-sm text-steel hover:text-navy transition-colors mb-5 cursor-pointer">
          <ArrowLeft size={15} /> Cambia orario
        </button>
        <p className="text-navy font-semibold mb-1 capitalize">{dayLabel}</p>
        <p className="text-navy/60 text-sm mb-6">Orario: {slot.label} · {config?.durationMin} minuti</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Nome e cognome *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy focus:outline-none focus:ring-2 focus:ring-steel/40 focus:border-steel transition" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy focus:outline-none focus:ring-2 focus:ring-steel/40 focus:border-steel transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Telefono</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy focus:outline-none focus:ring-2 focus:ring-steel/40 focus:border-steel transition" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Note (opzionale)</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy focus:outline-none focus:ring-2 focus:ring-steel/40 focus:border-steel transition resize-y" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={submit}
            disabled={submitting || !form.name.trim() || !form.email.trim()}
            className="press w-full inline-flex items-center justify-center gap-2 bg-steel text-white font-semibold py-3 rounded-xl hover:bg-navy transition-colors cursor-pointer disabled:opacity-60"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            Conferma prenotazione
          </button>
        </div>
      </div>
    );
  }

  // Pannello calendario + slot
  return (
    <div className="w-full rounded-xl border border-navy/10 bg-white p-6 sm:p-8">
      <h3 className="font-semibold text-navy mb-6">Seleziona data e ora</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calendario */}
        <div>
          <div className="flex items-center justify-center gap-4 mb-5">
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              className="p-1.5 rounded-full bg-mist hover:bg-sky-soft/40 text-steel transition-colors cursor-pointer"
              aria-label="Mese precedente"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-semibold text-navy min-w-[9rem] text-center">
              {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
            </span>
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              className="p-1.5 rounded-full bg-mist hover:bg-sky-soft/40 text-steel transition-colors cursor-pointer"
              aria-label="Mese successivo"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {WEEKDAYS.map((w) => (
              <span key={w} className="text-xs font-medium text-navy/40 py-1">{w}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map((d, i) => {
              if (!d) return <span key={i} />;
              const key = ymd(d);
              const enabled = dayEnabled(d);
              const isSelected = key === selected;
              return (
                <button
                  key={i}
                  disabled={!enabled}
                  onClick={() => pickDay(d)}
                  className={`aspect-square rounded-full text-sm font-medium transition-colors cursor-pointer
                    ${isSelected ? "bg-steel text-white" : enabled ? "bg-mist text-steel hover:bg-sky-soft/40" : "text-navy/20 cursor-not-allowed"}`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-navy mb-1">Fuso orario</p>
            <p className="inline-flex items-center gap-2 text-sm text-navy/60">
              <Globe size={15} className="text-steel" aria-hidden="true" />
              GMT+02:00 Europe/Rome
            </p>
          </div>
        </div>

        {/* Slot */}
        <div>
          {!selected ? (
            <p className="text-navy/50 text-sm py-10 text-center md:text-left">
              Seleziona un giorno per vedere gli orari disponibili.
            </p>
          ) : loadingSlots ? (
            <div className="flex items-center justify-center py-16 text-steel">
              <Loader2 size={22} className="animate-spin" />
            </div>
          ) : slots.length === 0 ? (
            <p className="text-navy/50 text-sm py-10 text-center md:text-left">
              Nessun orario disponibile in questa giornata. Prova un altro giorno.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {slots.map((s) => (
                <button
                  key={s.startISO}
                  onClick={() => { setSlot(s); setError(null); }}
                  className="w-full py-3 rounded-lg border border-steel/40 text-steel font-semibold text-sm hover:bg-steel hover:text-white transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
