import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { guard } from "@/lib/adminSession";
import { writeFile } from "@/lib/content/store";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_BYTES = 4 * 1024 * 1024; // Vercel accetta al massimo ~4,5 MB per richiesta

// Carica un'immagine: la ridimensiona (max 1600 px) e la converte in WebP leggero,
// così il sito resta veloce anche se si carica una foto pesante.
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
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Formato non supportato (usa JPG, PNG o WebP)." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Immagine troppo pesante (max 4 MB)." }, { status: 413 });
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    // rotate() applica l'orientamento della foto; poi si toglie ogni metadato (GPS compreso).
    const output = await sharp(input)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    const name = `${Date.now()}-${randomBytes(6).toString("hex")}.webp`;
    await writeFile(`media/${name}`, output, "image/webp");
    return NextResponse.json({ ok: true, url: `/media/${name}` });
  } catch {
    return NextResponse.json({ error: "Immagine non valida o non leggibile." }, { status: 422 });
  }
}
