import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_DAYS, checkCredentials, createSessionToken, missingAuthVars } from "@/lib/auth";
import { clearFailures, clientKey, isBlocked, recordFailure } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(request: Request) {
  // Stessa regola delle altre route: solo da una pagina di questo sito.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  let sameSite = false;
  try {
    sameSite = Boolean(origin && host && new URL(origin).host === host);
  } catch {
    sameSite = false;
  }
  if (!sameSite) return NextResponse.json({ error: "Richiesta non valida." }, { status: 403 });

  const missing = missingAuthVars();
  if (missing.length > 0) {
    // Solo i nomi delle variabili mancanti, mai i valori: serve a capire cosa
    // impostare su Vercel. Compare solo finché l'accesso non è configurato.
    return NextResponse.json(
      { error: `Accesso non ancora configurato. Su Vercel mancano o non sono valide: ${missing.join(", ")}.` },
      { status: 503 }
    );
  }

  let body: { email?: unknown; password?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  const key = clientKey(request);
  if (await isBlocked(key)) {
    return NextResponse.json(
      { error: "Troppi tentativi. Riprova tra 15 minuti." },
      { status: 429 }
    );
  }

  if (!(await checkCredentials(email, password))) {
    await recordFailure(key);
    await sleep(500); // rallenta chi prova password a raffica
    return NextResponse.json({ error: "Email o password non corretti." }, { status: 401 });
  }

  await clearFailures(key);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true, // il browser non lo rende leggibile da JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return res;
}
