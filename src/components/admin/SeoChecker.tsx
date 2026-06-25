"use client";

type Check = {
  level: "red" | "orange" | "green";
  message: string;
};

type Props = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  excerpt: string;
  content: string;
};

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function containsKeyword(text: string, kws: string[]): boolean {
  const lower = text.toLowerCase();
  return kws.some((kw) => lower.includes(kw.toLowerCase().trim()));
}

function analyze({ title, metaTitle, metaDescription, keywords, excerpt, content }: Props): Check[] {
  const checks: Check[] = [];
  const kws = keywords.split(",").map((k) => k.trim()).filter(Boolean);
  const effectiveTitle = metaTitle || title;
  const words = wordCount(content);

  // ── Titolo articolo ──
  if (!title.trim()) {
    checks.push({ level: "red", message: "Il titolo dell'articolo è obbligatorio." });
  } else if (title.length < 20) {
    checks.push({ level: "orange", message: "Il titolo è molto corto. Prova ad essere più descrittivo (almeno 20 caratteri)." });
  } else {
    checks.push({ level: "green", message: "Titolo articolo presente." });
  }

  // ── Lunghezza contenuto ──
  if (words < 100) {
    checks.push({ level: "red", message: `Contenuto troppo corto (${words} parole). Google penalizza articoli sotto le 300 parole.` });
  } else if (words < 300) {
    checks.push({ level: "orange", message: `Contenuto di ${words} parole. Per un buon posizionamento punta ad almeno 300 parole.` });
  } else {
    checks.push({ level: "green", message: `Contenuto ottimo: ${words} parole.` });
  }

  // ── Meta title ──
  const mt = metaTitle.trim();
  if (!mt) {
    checks.push({ level: "orange", message: "Meta title non impostato: verrà usato il titolo dell'articolo. Considera di ottimizzarlo." });
  } else if (mt.length < 30) {
    checks.push({ level: "orange", message: `Meta title troppo corto (${mt.length}/60). Aggiungi più contesto per migliorare il CTR.` });
  } else if (mt.length > 60) {
    checks.push({ level: "red", message: `Meta title troppo lungo (${mt.length}/60). Google lo tronca oltre i 60 caratteri.` });
  } else {
    checks.push({ level: "green", message: `Meta title ottimale (${mt.length}/60).` });
  }

  // ── Meta description ──
  const md = metaDescription.trim();
  if (!md) {
    checks.push({ level: "orange", message: "Meta description non impostata: verrà usato l'estratto. Scrivi una descrizione su misura." });
  } else if (md.length < 80) {
    checks.push({ level: "orange", message: `Meta description corta (${md.length}/160). Aggiungi dettagli per invogliare il clic.` });
  } else if (md.length > 160) {
    checks.push({ level: "red", message: `Meta description troppo lunga (${md.length}/160). Google la tronca oltre i 160 caratteri.` });
  } else {
    checks.push({ level: "green", message: `Meta description ottimale (${md.length}/160).` });
  }

  // ── Estratto ──
  if (!excerpt.trim()) {
    checks.push({ level: "orange", message: "Estratto mancante. Viene mostrato nella lista articoli e usato come fallback per la meta description." });
  } else {
    checks.push({ level: "green", message: "Estratto presente." });
  }

  // ── Parole chiave ──
  if (kws.length === 0) {
    checks.push({ level: "orange", message: "Nessuna parola chiave inserita. Aiuta a definire il focus SEO dell'articolo." });
  } else {
    // keyword nel titolo
    if (!containsKeyword(effectiveTitle, kws)) {
      checks.push({ level: "orange", message: `Nessuna parola chiave trovata nel titolo. Inserisci "${kws[0]}" nel titolo per rafforzare il segnale SEO.` });
    } else {
      checks.push({ level: "green", message: "Parola chiave presente nel titolo." });
    }

    // keyword nel contenuto
    if (content.trim() && !containsKeyword(content, kws)) {
      checks.push({ level: "orange", message: "Nessuna parola chiave trovata nel contenuto. Usale naturalmente nel testo." });
    } else if (content.trim()) {
      checks.push({ level: "green", message: "Parola chiave presente nel contenuto." });
    }

    // keyword nella meta description
    if (md && !containsKeyword(md, kws)) {
      checks.push({ level: "orange", message: "Nessuna parola chiave nella meta description. Aggiungila per rafforzare la rilevanza." });
    } else if (md) {
      checks.push({ level: "green", message: "Parola chiave presente nella meta description." });
    }
  }

  return checks;
}

const icons: Record<Check["level"], string> = {
  red: "●",
  orange: "●",
  green: "●",
};

const colors: Record<Check["level"], string> = {
  red: "#DC2626",
  orange: "#D97706",
  green: "#16A34A",
};

export default function SeoChecker(props: Props) {
  const checks = analyze(props);

  const reds = checks.filter((c) => c.level === "red").length;
  const oranges = checks.filter((c) => c.level === "orange").length;
  const greens = checks.filter((c) => c.level === "green").length;

  const overall: Check["level"] = reds > 0 ? "red" : oranges > 2 ? "orange" : oranges > 0 ? "orange" : "green";

  const overallLabel =
    overall === "red"
      ? "SEO da migliorare — problemi critici"
      : overall === "orange"
      ? "SEO discreta — ci sono margini di miglioramento"
      : "SEO ottima";

  return (
    <div className="rounded-xl border border-navy/10 bg-white p-5 space-y-4 shadow-sm">
      {/* Header semaforo */}
      <div className="flex items-center gap-3">
        <span
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: colors[overall] }}
        />
        <span className="text-sm font-semibold text-navy">{overallLabel}</span>
        <span className="ml-auto text-xs text-navy/40 flex gap-3">
          <span style={{ color: colors.red }}>{reds} critici</span>
          <span style={{ color: colors.orange }}>{oranges} suggerimenti</span>
          <span style={{ color: colors.green }}>{greens} ok</span>
        </span>
      </div>

      {/* Lista checks */}
      <ul className="space-y-2">
        {checks.map((c, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <span
              className="mt-0.5 text-xs flex-shrink-0"
              style={{ color: colors[c.level] }}
            >
              {icons[c.level]}
            </span>
            <span className="text-navy/75 leading-snug">{c.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
