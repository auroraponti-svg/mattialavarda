import "server-only";

// Preparazione delle immagini caricate dal pannello o importate.
//  - Si riconosce il VERO tipo dal contenuto del file (non da ciò che dichiara il browser).
//  - Si ridimensiona (max 1600 px) e si converte in WebP leggero con sharp.
//  - Se sharp non è disponibile sul server, si salva l'originale: il sito resta
//    veloce comunque, perché next/image lo serve già ridimensionato e in WebP.

export type ImageType = "image/jpeg" | "image/png" | "image/gif" | "image/webp" | "image/avif";

const EXT: Record<ImageType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
};

export function sniffImageType(b: Buffer): ImageType | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (b.subarray(0, 4).toString("ascii") === "GIF8") return "image/gif";
  if (b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  if (b.subarray(4, 8).toString("ascii") === "ftyp") {
    const brand = b.subarray(8, 12).toString("ascii");
    if (brand === "avif" || brand === "avis") return "image/avif";
  }
  return null;
}

export type PreparedImage = { data: Buffer; contentType: string; ext: string };

// Ritorna null se il file non è un'immagine riconosciuta.
export async function prepareImage(input: Buffer): Promise<PreparedImage | null> {
  const type = sniffImageType(input);
  if (!type) return null;

  // Le GIF si lasciano com'erano (potrebbero essere animate).
  if (type !== "image/gif") {
    try {
      const { default: sharp } = await import("sharp");
      // rotate() applica l'orientamento della foto; la conversione toglie i metadati (GPS compreso).
      const data = await sharp(input)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      return { data, contentType: "image/webp", ext: "webp" };
    } catch (e) {
      console.error("[image] conversione non disponibile, salvo l'originale:", e instanceof Error ? e.message.split("\n")[0] : e);
    }
  }
  return { data: input, contentType: type, ext: EXT[type] };
}
