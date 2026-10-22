import "server-only";
import { createHash } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./auth";
import { readJson, updateJson } from "./content/store";

// true se la richiesta arriva da una persona loggata (cookie firmato valido).
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

// Le richieste che modificano dati devono partire da una pagina di questo
// stesso sito: così un altro sito non può far agire il browser di chi è loggato.
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("host") ?? new URL(request.url).host;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// Da usare all'inizio di ogni route che modifica dati. Ritorna una risposta
// di errore se la richiesta non è ammessa, altrimenti null.
export async function guard(request: Request): Promise<NextResponse | null> {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 403 });
  }
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Accesso non autorizzato." }, { status: 401 });
  }
  return null;
}

// ── Limite ai tentativi di accesso sbagliati ─────────────────────────────
// 5 errori in 15 minuti dallo stesso indirizzo bloccano ulteriori tentativi.
// L'indirizzo IP viene salvato solo come impronta (hash), mai in chiaro.
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const ATTEMPTS = "auth/attempts.json";
type Attempts = Record<string, { count: number; first: number }>;

export function clientKey(request: Request): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

function prune(all: Attempts, now: number): Attempts {
  const out: Attempts = {};
  for (const [k, v] of Object.entries(all)) if (now - v.first < WINDOW_MS) out[k] = v;
  return out;
}

export async function isBlocked(key: string): Promise<boolean> {
  const doc = await readJson<Attempts>(ATTEMPTS);
  const entry = doc?.data[key];
  return Boolean(entry && Date.now() - entry.first < WINDOW_MS && entry.count >= MAX_FAILURES);
}

export async function recordFailure(key: string): Promise<void> {
  await updateJson<Attempts>(ATTEMPTS, {}, (all) => {
    const now = Date.now();
    const clean = prune(all, now);
    const entry = clean[key];
    clean[key] = entry ? { count: entry.count + 1, first: entry.first } : { count: 1, first: now };
    return clean;
  });
}

export async function clearFailures(key: string): Promise<void> {
  await updateJson<Attempts>(ATTEMPTS, {}, (all) => {
    const next = { ...all };
    delete next[key];
    return next;
  });
}
