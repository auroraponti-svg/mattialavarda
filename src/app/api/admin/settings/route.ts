import { NextResponse } from "next/server";
import { guard } from "@/lib/adminSession";
import { saveSettings } from "@/lib/content";
import { ConflictError } from "@/lib/content/store";
import { ALLOWED_SETTING_KEYS as ALLOWED } from "@/lib/content/settingsKeys";

export const dynamic = "force-dynamic";

// Solo le impostazioni dell'elenco ammesso: qualsiasi altro nome viene rifiutato.
const MAX_LEN = 20000;

export async function POST(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;

  let body: { values?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const values: Record<string, string> = {};
  for (const [key, value] of Object.entries(body.values ?? {})) {
    if (!ALLOWED.has(key)) {
      return NextResponse.json({ error: `Impostazione non ammessa: ${key}` }, { status: 400 });
    }
    if (typeof value !== "string" || value.length > MAX_LEN) {
      return NextResponse.json({ error: `Valore non valido per ${key}` }, { status: 400 });
    }
    values[key] = value;
  }

  try {
    await saveSettings(values);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const status = e instanceof ConflictError ? 409 : 500;
    return NextResponse.json({ error: e instanceof ConflictError ? e.message : "Salvataggio non riuscito." }, { status });
  }
}
