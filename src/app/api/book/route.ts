import { NextResponse } from "next/server";
import { generateSlots, dayBoundsUtc, type BusyRange } from "@/lib/booking";
import { loadBookingConfig } from "@/lib/bookingSettings";
import { getBusy, createEvent, isConnected } from "@/lib/google";

export const dynamic = "force-dynamic";

// POST /api/book → crea l'appuntamento sul calendario di Mattia.
export async function POST(request: Request) {
  let payload: {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
    startISO?: string;
    date?: string;
  };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "payload non valido" }, { status: 400 });
  }

  const { name, email, phone, notes, startISO, date } = payload;
  if (!name?.trim() || !email?.trim() || !startISO || !date) {
    return NextResponse.json({ error: "dati mancanti" }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "email non valida" }, { status: 400 });
  }

  if (!(await isConnected())) {
    return NextResponse.json({ error: "not_connected" }, { status: 503 });
  }

  const { config, sendEmails, calendarId } = await loadBookingConfig();

  // Ricontrollo che lo slot sia ancora libero (anti doppia prenotazione).
  let busy: BusyRange[] = [];
  try {
    const { timeMin, timeMax } = dayBoundsUtc(date);
    busy = await getBusy(timeMin, timeMax, calendarId);
  } catch {
    return NextResponse.json({ error: "calendar_unreachable" }, { status: 502 });
  }

  const slot = generateSlots(date, config, busy).find((s) => s.startISO === startISO);
  if (!slot) {
    return NextResponse.json({ error: "slot_taken" }, { status: 409 });
  }

  try {
    const event = await createEvent(
      { name: name.trim(), email: email.trim(), phone, notes, startISO: slot.startISO, endISO: slot.endISO },
      { calendarId, sendEmails }
    );
    return NextResponse.json({ ok: true, eventId: event.id });
  } catch {
    return NextResponse.json({ error: "create_failed" }, { status: 500 });
  }
}
