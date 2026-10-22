import { getSetting } from "@/lib/content";
import RawScripts from "./RawScripts";

// Legge il codice di tracciamento (Google Analytics / Tag Google) incollato
// dall'admin e lo inietta su tutte le pagine, così traccia le visite.
// Se non è stato incollato nulla, non rende niente.
export default async function AnalyticsCode() {
  const code = (await getSetting("analytics_code"))?.trim();
  if (!code) return null;

  return <RawScripts html={code} />;
}
