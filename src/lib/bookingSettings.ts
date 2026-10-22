import { getSettings } from "./content";
import { DEFAULT_CONFIG, type BookingConfig } from "./booking";

// Carica i parametri di prenotazione salvati dall'admin (impostazioni).
// Non sono segreti (durata, orari, buffer…), quindi si leggono con la cache.
export async function loadBookingConfig(): Promise<{
  config: BookingConfig;
  emailMode: EmailMode;
  calendarId: string;
}> {
  const s = await getSettings();

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
    emailMode: normalizeEmailMode(s.booking_emails),
    calendarId: s.booking_calendar_id || "primary",
  };
}

export type EmailMode = "all" | "patient" | "owner";

function normalizeEmailMode(v: string | undefined): EmailMode {
  return v === "patient" || v === "owner" ? v : "all";
}
