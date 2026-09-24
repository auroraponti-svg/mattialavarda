// Logica di generazione degli slot di prenotazione.
// Funzioni pure e testabili: dati i parametri (durata, orari, buffer, giorni)
// e le fasce occupate del calendario di Mattia, produce gli slot liberi.
// I fusi orari sono gestiti su "Europe/Rome" (orario dello studio).

export const STUDIO_TZ = "Europe/Rome";

export type BusyRange = { start: string; end: string }; // ISO 8601 assoluti

export type BookingConfig = {
  durationMin: number; // durata visita
  bufferMin: number; // pausa dopo ogni visita
  startTime: string; // "09:00"
  endTime: string; // "19:00"
  days: number[]; // giorni lavorativi, ISO: 1=Lun … 7=Dom
  minLeadHours: number; // preavviso minimo per prenotare (es. 2h)
};

export const DEFAULT_CONFIG: BookingConfig = {
  durationMin: 60,
  bufferMin: 10,
  startTime: "09:00",
  endTime: "19:00",
  days: [1, 2, 3, 4, 5],
  minLeadHours: 2,
};

export type Slot = { label: string; startISO: string; endISO: string };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Offset (minuti a est di UTC) del fuso `tz` nell'istante `date`.
function tzOffsetMinutes(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;
  const asUTC = Date.UTC(
    +map.year,
    +map.month - 1,
    +map.day,
    +map.hour,
    +map.minute,
    +map.second
  );
  return (asUTC - date.getTime()) / 60000;
}

// Converte un orario "da parete" (dateStr + minuti dall'inizio giornata) del
// fuso studio nell'istante assoluto (Date UTC) corrispondente.
export function wallToUtc(dateStr: string, minutesOfDay: number): Date {
  const hh = Math.floor(minutesOfDay / 60);
  const mm = minutesOfDay % 60;
  const guess = Date.parse(`${dateStr}T${pad(hh)}:${pad(mm)}:00Z`);
  const off = tzOffsetMinutes(new Date(guess), STUDIO_TZ);
  return new Date(guess - off * 60000);
}

// Giorno della settimana ISO (1=Lun … 7=Dom) per una data YYYY-MM-DD nel fuso studio.
export function isoWeekday(dateStr: string): number {
  const d = wallToUtc(dateStr, 12 * 60); // mezzogiorno per evitare bordi DST
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: STUDIO_TZ,
    weekday: "short",
  }).format(d);
  const map: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  return map[wd];
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// Genera gli slot liberi per una data, sottraendo le fasce occupate.
export function generateSlots(
  dateStr: string,
  config: BookingConfig,
  busy: BusyRange[],
  now: Date = new Date()
): Slot[] {
  if (!config.days.includes(isoWeekday(dateStr))) return [];

  const startMin = toMinutes(config.startTime);
  const endMin = toMinutes(config.endTime);
  const step = config.durationMin + config.bufferMin;
  const minStart = new Date(now.getTime() + config.minLeadHours * 3600_000);

  const busyRanges = busy.map((b) => ({
    start: new Date(b.start).getTime(),
    end: new Date(b.end).getTime(),
  }));

  const slots: Slot[] = [];
  for (let m = startMin; m + config.durationMin <= endMin; m += step) {
    const start = wallToUtc(dateStr, m);
    const end = new Date(start.getTime() + config.durationMin * 60000);

    if (start < minStart) continue; // troppo a ridosso / nel passato

    const overlaps = busyRanges.some(
      (b) => start.getTime() < b.end && end.getTime() > b.start
    );
    if (overlaps) continue;

    const label = new Intl.DateTimeFormat("it-IT", {
      timeZone: STUDIO_TZ,
      hour: "2-digit",
      minute: "2-digit",
    }).format(start);

    slots.push({ label, startISO: start.toISOString(), endISO: end.toISOString() });
  }
  return slots;
}

// Estremi assoluti (UTC) della giornata `dateStr` nel fuso studio, per la query FreeBusy.
export function dayBoundsUtc(dateStr: string): { timeMin: string; timeMax: string } {
  const start = wallToUtc(dateStr, 0);
  const end = new Date(start.getTime() + 24 * 3600_000);
  return { timeMin: start.toISOString(), timeMax: end.toISOString() };
}
