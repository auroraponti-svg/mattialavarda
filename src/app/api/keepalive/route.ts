import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

// Chiamato ogni giorno dal cron di Vercel (vedi vercel.json): fa una lettura
// minima sul database così Supabase (piano free) non va in pausa per inattività.
// Se CRON_SECRET è impostato su Vercel, Vercel lo invia come Bearer token e
// qui lo verifichiamo; senza secret l'endpoint resta comunque innocuo
// (legge una sola riga pubblica e non restituisce dati).
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    // revalidate 0 = nessuna cache: la query deve davvero arrivare al database.
    const { error } = await createPublicClient(0)
      .from("site_settings")
      .select("key")
      .limit(1);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
