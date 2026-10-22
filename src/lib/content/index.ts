import "server-only";
import { randomUUID } from "crypto";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { slugify, type Post } from "@/lib/posts";
import { readJson, updateJson } from "./store";

// Tutti i contenuti del sito passano da qui (sostituisce il vecchio database).
// File nell'archivio:
//   content/posts.json     elenco articoli (bozze incluse)
//   content/settings.json  impostazioni pubbliche (social, codici, orari…)
//   content/private.json   dati riservati (es. token Google): mai letti dalle pagine pubbliche

const POSTS = "content/posts.json";
const SETTINGS = "content/settings.json";
const PRIVATE = "content/private.json";
const TAG = "content";

export type Settings = Record<string, string>;

// ── Lettura pubblica (con cache) ─────────────────────────────────────────
// Se l'archivio non risponde si ritorna il valore vuoto invece di rompere la
// pagina; l'errore non viene messo in cache e al prossimo giro si riprova.
const cachedPosts = unstable_cache(
  async () => (await readJson<Post[]>(POSTS))?.data ?? [],
  ["content-posts"],
  { revalidate: 60, tags: [TAG] }
);

const cachedSettings = unstable_cache(
  async () => (await readJson<Settings>(SETTINGS))?.data ?? {},
  ["content-settings"],
  { revalidate: 60, tags: [TAG] }
);

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    return (await cachedPosts())
      .filter((p) => p.published)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  } catch (e) {
    // Visibile nei log di Vercel: senza questo un errore sembrerebbe "nessun articolo".
    console.error("[content] lettura articoli non riuscita:", e instanceof Error ? e.message : e);
    return [];
  }
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  return (await getPublishedPosts()).find((p) => p.slug === slug) ?? null;
}

export async function getSettings(): Promise<Settings> {
  try {
    return await cachedSettings();
  } catch (e) {
    console.error("[content] lettura impostazioni non riuscita:", e instanceof Error ? e.message : e);
    return {};
  }
}

export async function getSetting(key: string): Promise<string | undefined> {
  const v = (await getSettings())[key];
  return v?.trim() ? v : undefined;
}

// ── Lettura per il pannello admin (sempre aggiornata) ────────────────────
export async function getAllPosts(): Promise<Post[]> {
  const doc = await readJson<Post[]>(POSTS);
  return (doc?.data ?? []).slice().sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getPostById(id: string): Promise<Post | null> {
  return (await getAllPosts()).find((p) => p.id === id) ?? null;
}

export async function getSettingsFresh(): Promise<Settings> {
  return (await readJson<Settings>(SETTINGS))?.data ?? {};
}

// ── Scrittura (solo da funzioni che hanno già verificato il login) ───────
function refresh() {
  // Fa vedere subito le modifiche: svuota la cache dei dati e rigenera le pagine.
  revalidateTag(TAG, { expire: 0 });
  revalidatePath("/", "layout");
}

export type PostInput = {
  id?: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string | null;
};

export async function savePost(input: PostInput): Promise<Post> {
  const now = new Date().toISOString();
  let saved!: Post;
  await updateJson<Post[]>(POSTS, [], (posts) => {
    const existing = input.id ? posts.find((p) => p.id === input.id) : undefined;
    if (existing) {
      // Lo slug (indirizzo dell'articolo) resta quello originale: cambiarlo
      // romperebbe i link già indicizzati da Google.
      saved = { ...existing, ...input, id: existing.id, slug: existing.slug, created_at: existing.created_at, updated_at: now };
      return posts.map((p) => (p.id === existing.id ? saved : p));
    }
    let slug = slugify(input.title) || "articolo";
    const base = slug;
    for (let n = 2; posts.some((p) => p.slug === slug); n++) slug = `${base}-${n}`;
    saved = { ...input, id: randomUUID(), slug, created_at: now, updated_at: now };
    return [...posts, saved];
  });
  refresh();
  return saved;
}

export async function deletePost(id: string): Promise<void> {
  await updateJson<Post[]>(POSTS, [], (posts) => posts.filter((p) => p.id !== id));
  refresh();
}

export async function saveSettings(values: Settings): Promise<void> {
  await updateJson<Settings>(SETTINGS, {}, (current) => ({ ...current, ...values }));
  refresh();
}

// Sostituisce in blocco articoli e impostazioni (usato solo dall'importazione).
export async function replaceAll(posts: Post[], settings: Settings): Promise<void> {
  await updateJson<Post[]>(POSTS, [], () => posts);
  await updateJson<Settings>(SETTINGS, {}, () => settings);
  refresh();
}

// ── Dati riservati (token Google) ────────────────────────────────────────
export async function getPrivate(key: string): Promise<string | null> {
  const doc = await readJson<Record<string, string>>(PRIVATE);
  return doc?.data?.[key]?.trim() || null;
}

export async function setPrivate(key: string, value: string): Promise<void> {
  await updateJson<Record<string, string>>(PRIVATE, {}, (c) => ({ ...c, [key]: value }));
}

export async function deletePrivate(key: string): Promise<void> {
  await updateJson<Record<string, string>>(PRIVATE, {}, (c) => {
    const next = { ...c };
    delete next[key];
    return next;
  });
}
