import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { put, get, del, BlobPreconditionFailedError } from "@vercel/blob";

// Archivio dei contenuti (articoli, impostazioni, immagini).
//  - Su Vercel: Vercel Blob PRIVATO (nessun URL pubblico: si legge solo da qui).
//  - In locale (nessun BLOB_STORE_ID): cartella .data/ nel progetto, solo per sviluppo.
// Il resto dell'app non sa quale dei due è in uso.

const LOCAL_DIR = path.join(process.cwd(), ".data");

function useBlob(): boolean {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

function localPath(name: string): string {
  // Impedisce di uscire dalla cartella dati con percorsi tipo "../".
  const full = path.join(LOCAL_DIR, name);
  if (!full.startsWith(LOCAL_DIR + path.sep)) throw new Error("Percorso non valido");
  return full;
}

export type Versioned<T> = { data: T; version: string | null };

async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  return Buffer.from(await new Response(stream).arrayBuffer());
}

// Legge un documento JSON. `version` serve per scrivere senza sovrascrivere
// modifiche fatte nel frattempo da un'altra persona.
export async function readJson<T>(name: string): Promise<Versioned<T> | null> {
  if (useBlob()) {
    // useCache:false = sempre la versione più recente (la cache la gestiamo noi).
    const res = await get(name, { access: "private", useCache: false });
    if (!res || res.statusCode !== 200) return null;
    const text = (await streamToBuffer(res.stream)).toString("utf8");
    return { data: JSON.parse(text) as T, version: res.blob.etag };
  }
  try {
    const text = await fs.readFile(localPath(name), "utf8");
    return { data: JSON.parse(text) as T, version: String(text.length) + ":" + hash(text) };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}

export async function writeJson<T>(name: string, data: T, ifVersion?: string | null): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (useBlob()) {
    await put(name, body, {
      access: "private",
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: "application/json",
      cacheControlMaxAge: 60,
      ...(ifVersion ? { ifMatch: ifVersion } : {}),
    });
    return;
  }
  if (ifVersion) {
    const current = await readJson<T>(name);
    if (current && current.version !== ifVersion) throw new ConflictError();
  }
  const file = localPath(name);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, body, "utf8");
}

export class ConflictError extends Error {
  constructor() {
    super("Il contenuto è stato modificato da qualcun altro. Ricarica la pagina e riprova.");
  }
}

// Legge-modifica-scrive con un nuovo tentativo se nel frattempo qualcuno ha salvato.
export async function updateJson<T>(
  name: string,
  fallback: T,
  change: (current: T) => T
): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const current = await readJson<T>(name);
    const next = change(current ? current.data : fallback);
    try {
      await writeJson(name, next, current?.version ?? null);
      return next;
    } catch (e) {
      const conflict = e instanceof ConflictError || e instanceof BlobPreconditionFailedError;
      if (!conflict || attempt === 2) throw e instanceof BlobPreconditionFailedError ? new ConflictError() : e;
    }
  }
  throw new ConflictError();
}

// ── File binari (immagini) ────────────────────────────────────────────────
export async function writeFile(name: string, data: Buffer, contentType: string): Promise<void> {
  if (useBlob()) {
    await put(name, data, {
      access: "private",
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return;
  }
  const file = localPath(name);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, data);
  await fs.writeFile(file + ".type", contentType, "utf8");
}

export async function readFile(
  name: string
): Promise<{ data: Buffer; contentType: string; etag: string } | null> {
  if (useBlob()) {
    const res = await get(name, { access: "private" });
    if (!res || res.statusCode !== 200) return null;
    return {
      data: await streamToBuffer(res.stream),
      contentType: res.blob.contentType,
      etag: res.blob.etag,
    };
  }
  try {
    const file = localPath(name);
    const data = await fs.readFile(file);
    const contentType = await fs.readFile(file + ".type", "utf8").catch(() => "application/octet-stream");
    return { data, contentType, etag: hash(data.toString("base64")) };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}

export async function removeFile(name: string): Promise<void> {
  if (useBlob()) {
    await del(name);
    return;
  }
  const file = localPath(name);
  await fs.rm(file, { force: true });
  await fs.rm(file + ".type", { force: true });
}

// Hash semplice (non crittografico) usato solo come "versione" in locale.
function hash(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
