import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { guard } from "@/lib/adminSession";
import { prepareImage } from "@/lib/content/image";
import { writeFile } from "@/lib/content/store";

export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel accetta al massimo ~4,5 MB per richiesta

// Carica un'immagine: ne verifica il vero tipo, la ridimensiona e la converte in WebP
// leggero (se possibile), così il sito resta veloce anche con una foto pesante.
export async function POST(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;

  let file: File | null = null;
  try {
    const form = await request.formData();
    const f = form.get("file");
    file = f instanceof File ? f : null;
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }
  if (!file) return NextResponse.json({ error: "Nessun file ricevuto." }, { status: 400 });
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Immagine troppo pesante (max 4 MB)." }, { status: 413 });
  }

  try {
    const prepared = await prepareImage(Buffer.from(await file.arrayBuffer()));
    if (!prepared) {
      return NextResponse.json({ error: "Il file non è un'immagine valida (usa JPG, PNG o WebP)." }, { status: 415 });
    }
    const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${prepared.ext}`;
    await writeFile(`media/${name}`, prepared.data, prepared.contentType);
    return NextResponse.json({ ok: true, url: `/media/${name}` });
  } catch {
    return NextResponse.json({ error: "Caricamento non riuscito. Riprova." }, { status: 500 });
  }
}
