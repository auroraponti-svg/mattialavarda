import { createClient } from "@supabase/supabase-js";

// Client Supabase con service-role: SOLO lato server (API route).
// Bypassa la RLS, quindi può leggere/scrivere la tabella private_settings
// che contiene segreti (es. refresh token di Google). La chiave non è mai
// esposta al browser: vive nella variabile d'ambiente SUPABASE_SERVICE_ROLE_KEY.
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY mancante");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false },
  });
}
