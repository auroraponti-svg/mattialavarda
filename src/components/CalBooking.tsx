"use client";

import { useEffect } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

// Embed di Cal.com: legge il Google Calendar di Mattia e mostra solo gli slot liberi.
// Finché `calUsername` resta il placeholder, l'embed di Cal.com risponde 404,
// quindi mostriamo un fallback con telefono e WhatsApp al posto del widget rotto.
// Dopo aver creato l'account su cal.com e collegato Google Calendar,
// aggiorna `calUsername` in src/lib/site.ts con lo username reale.
const PLACEHOLDER = "mattia-lavarda";
const configured = site.calUsername.trim() !== "" && site.calUsername.trim() !== PLACEHOLDER;

export default function CalBooking() {
  useEffect(() => {
    if (!configured) return;
    (async () => {
      const cal = document.createElement("script");
      cal.innerHTML = `(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
        Cal("init", {origin:"https://cal.com"});
        Cal("inline", { elementOrSelector: "#cal-inline", calLink: "${site.calUsername}", layout: "month_view" });
        Cal("ui", { styles: { branding: { brandColor: "#3F6FA0" } }, hideEventTypeDetails: false, layout: "month_view" });`;
      document.body.appendChild(cal);
    })();
  }, []);

  // Fallback finché l'account Cal.com non è configurato
  if (!configured) {
    return (
      <div className="w-full rounded-xl border border-navy/10 bg-white p-8 text-center">
        <p className="text-navy/70 mb-6">
          La prenotazione online sarà presto disponibile. Nel frattempo puoi fissare il tuo
          appuntamento contattandomi direttamente:
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`tel:${site.phoneHref}`}
            className="press inline-flex items-center gap-2 bg-steel text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy transition-colors cursor-pointer"
          >
            <Phone size={18} aria-hidden="true" />
            Chiama {site.phone}
          </a>
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center gap-2 bg-white text-navy font-semibold px-6 py-3 rounded-xl border border-navy/15 hover:border-steel/40 transition-colors cursor-pointer"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Scrivi su WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      id="cal-inline"
      className="w-full min-h-[600px] rounded-xl overflow-hidden border border-navy/10 bg-white"
      style={{ height: "100%" }}
    />
  );
}
