import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client pubblico SENZA cookie per le pagine pubbliche in sola lettura
// (blog, elenco articoli, impostazioni GTM). Due accorgimenti chiave:
//   1. non legge i cookie → non forza il rendering dinamico;
//   2. inietta un fetch con `next.revalidate` → le letture vengono cache-ate
//      da Next, così le pagine diventano statiche/ISR e si aprono all'istante
//      invece di interrogare il database a ogni richiesta.
export function createPublicClient(revalidate = 60) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) =>
          fetch(input as RequestInfo | URL, { ...init, next: { revalidate } }),
      },
    }
  );
}
