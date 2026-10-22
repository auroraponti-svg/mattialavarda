import { readFile } from "@/lib/content/store";

// Serve le immagini del blog salvate nell'archivio privato.
// I nomi sono unici (data + codice casuale): si possono tenere in cache a lungo.
export async function GET(_request: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  // Solo nomi del tipo 1234567890-abcdef.webp: niente percorsi né altri file.
  if (!/^[a-z0-9-]+\.(webp|jpg|jpeg|png|gif|avif)$/i.test(name)) {
    return new Response("Non trovato", { status: 404 });
  }

  const file = await readFile(`media/${name}`);
  if (!file) return new Response("Non trovato", { status: 404 });

  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
