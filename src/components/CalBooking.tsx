"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

// Embed di Cal.com: legge il Google Calendar di Mattia e mostra solo gli slot liberi.
// Dopo aver creato l'account su cal.com e collegato Google Calendar,
// aggiorna `calUsername` in src/lib/site.ts con lo username reale.
export default function CalBooking() {
  useEffect(() => {
    (async () => {
      const cal = document.createElement("script");
      cal.innerHTML = `(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
        Cal("init", {origin:"https://cal.com"});
        Cal("inline", { elementOrSelector: "#cal-inline", calLink: "${site.calUsername}", layout: "month_view" });
        Cal("ui", { styles: { branding: { brandColor: "#3F6FA0" } }, hideEventTypeDetails: false, layout: "month_view" });`;
      document.body.appendChild(cal);
    })();
  }, []);

  return (
    <div
      id="cal-inline"
      className="w-full min-h-[600px] rounded-xl overflow-hidden border border-navy/10 bg-white"
      style={{ height: "100%" }}
    />
  );
}
