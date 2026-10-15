import { createPublicClient } from "@/lib/supabase/public";
import RawScripts from "./RawScripts";

// Legge il codice di tracciamento (Google Analytics / Tag Google) incollato
// dall'admin e lo inietta su tutte le pagine, così traccia le visite.
// Se non è stato incollato nulla, non rende niente.
export default async function AnalyticsCode() {
  let code: string | undefined;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "analytics_code")
      .maybeSingle();
    code = data?.value?.trim();
  } catch {
    return null;
  }

  if (!code) return null;

  return <RawScripts html={code} />;
}
