import { createAdminClient } from "./supabase/admin";
import type { BusyRange } from "./booking";

// Integrazione Google Calendar via OAuth2 (account personale Gmail di Mattia).
// Il refresh token è salvato in private_settings (tabella non pubblica).
// Nessuna libreria esterna: si usano gli endpoint REST di Google con fetch.

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CAL_BASE = "https://www.googleapis.com/calendar/v3";

export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
];

const REFRESH_KEY = "google_refresh_token";

export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export async function getRefreshToken(): Promise<string | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("private_settings")
    .select("value")
    .eq("key", REFRESH_KEY)
    .maybeSingle();
  return data?.value?.trim() || null;
}

export async function saveRefreshToken(token: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("private_settings")
    .upsert({ key: REFRESH_KEY, value: token, updated_at: new Date().toISOString() });
}

export async function clearRefreshToken(): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("private_settings").delete().eq("key", REFRESH_KEY);
}

// true se il calendario è collegato (credenziali app presenti + refresh token salvato)
export async function isConnected(): Promise<boolean> {
  if (!googleConfigured()) return false;
  try {
    return Boolean(await getRefreshToken());
  } catch {
    return false;
  }
}

// Scambia un authorization code (dal callback OAuth) con i token; ritorna il refresh token.
export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<{ refresh_token?: string; access_token: string }> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`Token exchange fallito: ${await res.text()}`);
  return res.json();
}

// Ottiene un access token fresco dal refresh token salvato.
async function getAccessToken(): Promise<string> {
  const refresh = await getRefreshToken();
  if (!refresh) throw new Error("Google Calendar non collegato");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refresh,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Refresh token fallito: ${await res.text()}`);
  const data = await res.json();
  return data.access_token as string;
}

// Legge le fasce occupate del calendario nell'intervallo indicato.
export async function getBusy(
  timeMin: string,
  timeMax: string,
  calendarId = "primary"
): Promise<BusyRange[]> {
  const token = await getAccessToken();
  const res = await fetch(`${CAL_BASE}/freeBusy`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: calendarId }] }),
  });
  if (!res.ok) throw new Error(`FreeBusy fallito: ${await res.text()}`);
  const data = await res.json();
  return (data.calendars?.[calendarId]?.busy ?? []) as BusyRange[];
}

export type BookingDetails = {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  startISO: string;
  endISO: string;
};

// Crea l'evento sul calendario di Mattia e (se richiesto) invia le email.
export async function createEvent(
  details: BookingDetails,
  opts: { calendarId?: string; sendEmails: boolean }
): Promise<{ id: string; htmlLink: string }> {
  const token = await getAccessToken();
  const calendarId = opts.calendarId || "primary";

  const description = [
    details.phone ? `Telefono: ${details.phone}` : null,
    details.email ? `Email: ${details.email}` : null,
    details.notes ? `\nNote: ${details.notes}` : null,
    "\nPrenotazione effettuata dal sito.",
  ]
    .filter(Boolean)
    .join("\n");

  const body = {
    summary: `Visita osteopatica – ${details.name}`,
    description,
    start: { dateTime: details.startISO, timeZone: "Europe/Rome" },
    end: { dateTime: details.endISO, timeZone: "Europe/Rome" },
    attendees: opts.sendEmails && details.email ? [{ email: details.email }] : undefined,
    reminders: { useDefault: true },
  };

  const url = `${CAL_BASE}/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=${
    opts.sendEmails ? "all" : "none"
  }`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Creazione evento fallita: ${await res.text()}`);
  const data = await res.json();
  return { id: data.id, htmlLink: data.htmlLink };
}
