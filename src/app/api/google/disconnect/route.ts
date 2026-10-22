import { NextResponse } from "next/server";
import { guard } from "@/lib/adminSession";
import { clearRefreshToken } from "@/lib/google";

export const dynamic = "force-dynamic";

// Scollega Google Calendar (rimuove il refresh token). Solo per admin loggato.
export async function POST(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;

  try {
    await clearRefreshToken();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
