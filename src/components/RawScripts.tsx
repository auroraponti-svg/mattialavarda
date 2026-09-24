"use client";

import { useEffect, useRef } from "react";

// Inietta ed ESEGUE un blocco HTML che contiene <script> (inline e/o con src).
// Necessario perché assegnare innerHTML NON esegue gli script: vanno ricreati.
// Usato per il codice del banner cookie di iubenda incollato dall'admin.
export default function RawScripts({ html }: { html: string }) {
  const done = useRef(false);

  useEffect(() => {
    if (done.current || !html.trim()) return;
    done.current = true;

    const template = document.createElement("template");
    template.innerHTML = html;

    const nodes = Array.from(template.content.childNodes);
    for (const node of nodes) {
      if (node.nodeName === "SCRIPT") {
        const old = node as HTMLScriptElement;
        const script = document.createElement("script");
        for (const attr of Array.from(old.attributes)) {
          script.setAttribute(attr.name, attr.value);
        }
        script.text = old.text;
        document.head.appendChild(script);
      } else {
        document.head.appendChild(node.cloneNode(true));
      }
    }
  }, [html]);

  return null;
}
