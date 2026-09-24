import { createPublicClient } from "./supabase/public";
import { DEFAULT_CONFIG, type BookingConfig } from "./booking";

// Carica i parametri di prenotazione salvati dall'admin (site_settings).
// Non sono segreti (durata, orari, buffer…), quindi client pubblico + cache.
export async function loadBookingConfig(): Promise<{
  config: BookingConfig;
  sendEmails: boolean;
  calendarId: string;
}> {
  const supabase = createPublicClient(30);
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", [
      "booking_duration",
      "booking_buffer",
      "booking_start",
      "booking_end",
      "booking_days",
      "booking_lead_hours",
      "booking_emails",
      "booking_calendar_id",
    ]);
  const s = Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]));

  const num = (v: string | undefined, d: number) => {
    const n = Number(v);
    return Number.isFinite(n) && v !== "" && v != null ? n : d;
  };

  const config: BookingConfig = {
    durationMin: num(s.booking_duration, DEFAULT_CONFIG.durationMin),
    bufferMin: num(s.booking_buffer, DEFAULT_CONFIG.bufferMin),
    startTime: s.booking_start || DEFAULT_CONFIG.startTime,
    endTime: s.booking_end || DEFAULT_CONFIG.endTime,
    days: s.booking_days
      ? s.booking_days.split(",").map(Number).filter((n: number) => n >= 1 && n <= 7)
      : DEFAULT_CONFIG.days,
    minLeadHours: num(s.booking_lead_hours, DEFAULT_CONFIG.minLeadHours),
  };

  return {
    config,
    sendEmails: (s.booking_emails ?? "all") !== "owner",
    calendarId: s.booking_calendar_id || "primary",
  };
}
