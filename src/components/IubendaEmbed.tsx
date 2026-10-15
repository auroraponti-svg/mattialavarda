"use client";

import { useEffect, useRef } from "react";

// Inserisce un blocco di incorporamento iubenda (un <a> + uno <script> loader)
// dentro il proprio contenitore, ESEGUENDO lo script (innerHTML da solo non lo fa).
// Così l'anchor compare dove vogliamo (footer) e iubenda.js lo trasforma nel
// pulsante che apre la policy in un riquadro.
export default function IubendaEmbed({ html }: { html: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current || !html.trim() || !ref.current) return;
    done.current = true;
    const container = ref.current;

    const template = document.createElement("template");
    template.innerHTML = html;

    for (const node of Array.from(template.content.childNodes)) {
      if (node.nodeName === "SCRIPT") {
        const old = node as HTMLScriptElement;
        const script = document.createElement("script");
        for (const attr of Array.from(old.attributes)) script.setAttribute(attr.name, attr.value);
        script.text = old.text;
        document.body.appendChild(script);
      } else {
        container.appendChild(node.cloneNode(true));
      }
    }
  }, [html]);

  return <span ref={ref} className="inline-flex" />;
}
