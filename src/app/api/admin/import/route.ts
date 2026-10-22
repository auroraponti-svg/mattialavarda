import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { guard } from "@/lib/adminSession";
import { getAllPosts, replaceAll } from "@/lib/content";
import { ALLOWED_SETTING_KEYS } from "@/lib/content/settingsKeys";
import { writeFile } from "@/lib/content/store";
import type { Post } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Importazione UNA TANTUM dal vecchio sistema (Supabase) al nuovo archivio.
// Si usa una volta sola, da loggati; poi questa route e la pagina vengono rimosse.
// Legge solo dati già pubblici (articoli pubblicati e impostazioni) con la chiave
// pubblica del sito, quindi non servono credenziali speciali.

const IMG_RE = /https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\/[^\s)"'<>]+/gi;

async function rest<T>(table: string, query: string): Promise<T> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key) throw new Error("Collegamento al vecchio sistema non configurato.");
  const res = await fetch(`${base}/rest/v1/${table}?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Lettura di ${table} non riuscita (${res.status}). Il vecchio database potrebbe essere in pausa.`);
  return res.json() as Promise<T>;
}

export async function POST(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;

  let overwrite = false;
  try {
    overwrite = (await request.json())?.overwrite === true;
  } catch {
    // nessun corpo: si procede senza sovrascrivere
  }

  // Evita di cancellare per sbaglio articoli già scritti nel nuovo sistema.
  const existing = await getAllPosts();
  if (existing.length > 0 && !overwrite) {
    return NextResponse.json(
      { error: `Nel nuovo sistema ci sono già ${existing.length} articoli. Importare di nuovo li sostituirebbe: conferma per procedere.`, needsConfirm: true },
      { status: 409 }
    );
  }

  try {
    const [posts, settingRows] = await Promise.all([
      rest<Post[]>("posts", "select=*&order=created_at.asc"),
      rest<{ key: string; value: string }[]>("site_settings", "select=key,value"),
    ]);

    // Immagini: copertine e immagini dentro i testi → WebP leggero nel nuovo archivio.
    const converted = new Map<string, string>();
    async function moveImage(url: string): Promise<string> {
      const done = converted.get(url);
      if (done) return done;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Immagine non scaricabile: ${url}`);
      const webp = await sharp(Buffer.from(await res.arrayBuffer()))
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      const name = `${Date.now()}-${randomBytes(6).toString("hex")}.webp`;
      await writeFile(`media/${name}`, webp, "image/webp");
      const local = `/media/${name}`;
      converted.set(url, local);
      return local;
    }

    const imported: Post[] = [];
    for (const p of posts) {
      let content = p.content ?? "";
      for (const url of new Set(content.match(IMG_RE) ?? [])) {
        content = content.split(url).join(await moveImage(url));
      }
      const cover =
        p.cover_image && /^https:\/\/[a-z0-9]+\.supabase\.co\/storage\//i.test(p.cover_image)
          ? await moveImage(p.cover_image)
          : p.cover_image;
      imported.push({ ...p, content, cover_image: cover ?? null });
    }

    const settings: Record<string, string> = {};
    for (const row of settingRows) {
      if (ALLOWED_SETTING_KEYS.has(row.key) && typeof row.value === "string") settings[row.key] = row.value;
    }

    await replaceAll(imported, settings);
    return NextResponse.json({
      ok: true,
      posts: imported.length,
      settings: Object.keys(settings).length,
      images: converted.size,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Importazione non riuscita." },
      { status: 502 }
    );
  }
}
