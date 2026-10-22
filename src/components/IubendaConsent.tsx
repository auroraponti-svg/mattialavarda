import { getSetting } from "@/lib/content";
import RawScripts from "./RawScripts";

// Legge il codice del banner privacy/cookie (iubenda) salvato dall'admin e
// lo inietta su tutte le pagine, così il popup di consenso compare all'ingresso.
// Se non è stato incollato nulla, non rende niente.
export default async function IubendaConsent() {
  const script = (await getSetting("iubenda_cs_embed"))?.trim();
  if (!script) return null;

  return <RawScripts html={script} />;
}
