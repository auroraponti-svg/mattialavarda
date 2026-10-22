// Accesso al backend del sito (un solo login condiviso, senza servizi esterni).
//  - Email e password stanno SOLO nelle variabili d'ambiente di Vercel
//    (ADMIN_EMAIL, ADMIN_PASSWORD): non sono nel codice né in un database.
//  - Dopo il login si riceve un cookie firmato (HMAC-SHA256 con SESSION_SECRET):
//    senza il segreto non si può falsificare né modificare.
// Usa solo Web Crypto, così funziona sia nel proxy sia nelle route.

export const SESSION_COOKIE = "admin_session";
export const SESSION_DAYS = 7;

const encoder = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return b64url(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

// Confronto a tempo costante (evita di dedurre il valore dai tempi di risposta).
function safeEqual(a: string, b: string): boolean {
  const x = encoder.encode(a);
  const y = encoder.encode(b);
  let diff = x.length ^ y.length;
  const len = Math.max(x.length, y.length);
  for (let i = 0; i < len; i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

export function authConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD &&
      process.env.SESSION_SECRET &&
      process.env.SESSION_SECRET.length >= 32
  );
}

export async function checkCredentials(email: string, password: string): Promise<boolean> {
  if (!authConfigured()) return false;
  // Si confrontano sempre entrambi i campi, senza uscire al primo errore.
  const okEmail = safeEqual(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase());
  const okPass = safeEqual(password, process.env.ADMIN_PASSWORD!);
  return okEmail && okPass;
}

export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = b64url(encoder.encode(JSON.stringify({ exp })));
  const sig = await hmac(payload, process.env.SESSION_SECRET!);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !authConfigured()) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = await hmac(payload, process.env.SESSION_SECRET!);
  if (!safeEqual(sig, expected)) return false;
  try {
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof json.exp === "number" && json.exp > Date.now();
  } catch {
    return false;
  }
}
