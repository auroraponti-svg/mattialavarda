import { NextResponse } from "next/server";
import { loadBookingConfig } from "@/lib/bookingSettings";
import { isConnected } from "@/lib/google";

export const dynamic = "force-dynamic";

// Config pubblica per il pannello di prenotazione (giorni attivi, stato collegamento).
export async function GET() {
  const { config } = await loadBookingConfig();
  const connected = await isConnected();
  return NextResponse.json({
    connected,
    days: config.days,
    durationMin: config.durationMin,
    timezone: "Europe/Rome",
  });
}
