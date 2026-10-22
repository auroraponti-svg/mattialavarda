import { NextResponse } from "next/server";
import { guard } from "@/lib/adminSession";
import { savePost, type PostInput } from "@/lib/content";
import { ConflictError } from "@/lib/content/store";

export const dynamic = "force-dynamic";

const str = (v: unknown, max: number) => (typeof v === "string" && v.length <= max ? v : null);

// Controlla e ripulisce i dati arrivati dall'editor (non ci si fida mai del browser).
function parse(body: Record<string, unknown>): PostInput | string {
  const title = str(body.title, 200)?.trim();
  if (!title) return "Il titolo è obbligatorio.";
  const category = str(body.category, 60) ?? "Generale";
  const excerpt = str(body.excerpt, 500) ?? "";
  const content = str(body.content, 200000);
  if (content === null) return "Contenuto non valido.";

  const cover = body.cover_image;
  if (cover !== null && cover !== undefined) {
    // Solo immagini caricate dal pannello o indirizzi https.
    if (typeof cover !== "string" || !(cover.startsWith("/media/") || cover.startsWith("https://"))) {
      return "Immagine di copertina non valida.";
    }
  }
  const opt = (v: unknown, max: number) => {
    const s = str(v, max)?.trim();
    return s ? s : null;
  };

  return {
    id: typeof body.id === "string" ? body.id : undefined,
    title,
    category,
    excerpt: excerpt.trim(),
    content,
    cover_image: typeof cover === "string" ? cover : null,
    published: body.published === true,
    meta_title: opt(body.meta_title, 120),
    meta_description: opt(body.meta_description, 320),
    keywords: opt(body.keywords, 500),
  };
}

export async function POST(request: Request) {
  const denied = await guard(request);
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const input = parse(body);
  if (typeof input === "string") return NextResponse.json({ error: input }, { status: 400 });

  try {
    const post = await savePost(input);
    return NextResponse.json({ ok: true, post });
  } catch (e) {
    const conflict = e instanceof ConflictError;
    return NextResponse.json(
      { error: conflict ? e.message : "Salvataggio non riuscito." },
      { status: conflict ? 409 : 500 }
    );
  }
}
