"use client";

import { useState } from "react";
import Link from "next/link";

// Pagina temporanea: serve una sola volta per trasferire i contenuti dal vecchio
// sistema al nuovo. Dopo la verifica viene eliminata insieme alla sua route.
export default function ImportPage() {
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [needsConfirm, setNeedsConfirm] = useState(false);

  async function run(overwrite: boolean) {
    setState("running");
    setMessage("");
    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overwrite }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("done");
        setNeedsConfirm(false);
        setMessage(`Fatto: ${data.posts} articoli, ${data.settings} impostazioni, ${data.images} immagini.`);
      } else {
        setState("error");
        setNeedsConfirm(Boolean(data.needsConfirm));
        setMessage(data.error || "Importazione non riuscita.");
      }
    } catch {
      setState("error");
      setMessage("Connessione non riuscita.");
    }
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-4 space-y-5">
      <h1 className="text-2xl font-bold text-navy">Importa dal vecchio sistema</h1>
      <p className="text-sm text-navy/60">
        Copia articoli, immagini e impostazioni dal vecchio database nel nuovo archivio. Si fa una sola volta.
      </p>
      <button
        onClick={() => run(false)}
        disabled={state === "running"}
        className="bg-steel text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-navy transition-colors disabled:opacity-60 cursor-pointer"
      >
        {state === "running" ? "Importazione in corso… (può richiedere un minuto)" : "Avvia importazione"}
      </button>
      {needsConfirm && (
        <button
          onClick={() => run(true)}
          className="block text-sm font-semibold text-red-600 underline cursor-pointer"
        >
          Sostituisci gli articoli già presenti
        </button>
      )}
      {message && (
        <p
          role="status"
          className={`text-sm rounded-lg border px-4 py-2 ${
            state === "done" ? "text-green-700 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200"
          }`}
        >
          {message}
        </p>
      )}
      <Link href="/admin" className="inline-block text-sm text-steel hover:text-navy">← Torna al pannello</Link>
    </div>
  );
}
