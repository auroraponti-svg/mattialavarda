import { createPublicClient } from "@/lib/supabase/public";
import RawScripts from "./RawScripts";

// Legge il codice del banner privacy/cookie (iubenda) salvato dall'admin e
// lo inietta su tutte le pagine, così il popup di consenso compare all'ingresso.
// Se non è stato incollato nulla, non rende niente.
export default async function IubendaConsent() {
  let script: string | undefined;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "iubenda_script")
      .maybeSingle();
    script = data?.value?.trim();
  } catch {
    return null;
  }

  if (!script) return null;

  return <RawScripts html={script} />;
}
