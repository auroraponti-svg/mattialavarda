import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clearRefreshToken } from "@/lib/google";

export const dynamic = "force-dynamic";

// Scollega Google Calendar (rimuove il refresh token). Solo per admin loggato.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    await clearRefreshToken();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
