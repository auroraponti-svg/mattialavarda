import { NextResponse } from "next/server";
import { generateSlots, dayBoundsUtc, type BusyRange } from "@/lib/booking";
import { loadBookingConfig } from "@/lib/bookingSettings";
import { isConnected, getBusy } from "@/lib/google";

export const dynamic = "force-dynamic";

// GET /api/slots?date=YYYY-MM-DD  → slot liberi di quel giorno.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date non valida" }, { status: 400 });
  }

  const { config, calendarId } = await loadBookingConfig();

  const connected = await isConnected();
  if (!connected) {
    // Google non ancora collegato: nessuno slot (evitiamo di mostrare orari
    // non verificati sul calendario reale). Il pannello mostra un avviso.
    return NextResponse.json({ connected: false, slots: [] });
  }

  let busy: BusyRange[] = [];
  try {
    const { timeMin, timeMax } = dayBoundsUtc(date);
    busy = await getBusy(timeMin, timeMax, calendarId);
  } catch {
    return NextResponse.json({ connected: true, error: "calendar_unreachable", slots: [] }, { status: 502 });
  }

  const slots = generateSlots(date, config, busy);
  return NextResponse.json({ connected: true, slots });
}
