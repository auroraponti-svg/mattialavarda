"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, Loader2, Save, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify, type Post } from "@/lib/posts";

const categorie = ["Generale", "Lombalgia", "Postura", "Sport", "Cefalee", "Benessere", "Info"];

export default function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const supabase = createClient();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [category, setCategory] = useState(post?.category ?? "Generale");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [cover, setCover] = useState<string | null>(post?.cover_image ?? null);
  const [published, setPublished] = useState(post?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) {
      setError("Errore nel caricamento dell'immagine: " + error.message);
      return null;
    }
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) setCover(url);
    setUploading(false);
  }

  async function handleInlineImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) {
      const ta = contentRef.current;
      const md = `\n\n![${file.name}](${url})\n\n`;
      if (ta) {
        const pos = ta.selectionStart;
        setContent((c) => c.slice(0, pos) + md + c.slice(pos));
      } else {
        setContent((c) => c + md);
      }
    }
    setUploading(false);
    e.target.value = "";
  }

  async function save(publish: boolean) {
    if (!title.trim()) {
      setError("Il titolo è obbligatorio.");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      title: title.trim(),
      slug: post?.slug ?? slugify(title),
      category,
      excerpt: excerpt.trim(),
      content,
      cover_image: cover,
      published: publish,
      updated_at: new Date().toISOString(),
    };

    let res;
    if (post) {
      res = await supabase.from("posts").update(payload).eq("id", post.id);
    } else {
      res = await supabase.from("posts").insert(payload);
    }

    if (res.error) {
      setError(res.error.message);
      setSaving(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2" role="alert">{error}</p>}

      {/* Cover */}
      <div>
        <label className="block text-sm font-medium text-navy mb-2">Immagine di copertina</label>
        <div className="relative h-48 rounded-xl border-2 border-dashed border-navy/15 bg-mist overflow-hidden flex items-center justify-center">
          {cover ? (
            <Image src={cover} alt="Copertina" fill className="object-cover" sizes="48rem" />
          ) : (
            <span className="text-navy/40 text-sm flex items-center gap-2"><ImagePlus size={18} /> Nessuna copertina</span>
          )}
        </div>
        <label className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-steel cursor-pointer hover:text-navy">
          <ImagePlus size={16} /> {cover ? "Cambia copertina" : "Carica copertina"}
          <input type="file" accept="image/*" onChange={handleCover} className="hidden" />
        </label>
        {cover && (
          <button onClick={() => setCover(null)} className="ml-4 text-sm text-red-500 hover:underline cursor-pointer">Rimuovi</button>
        )}
      </div>

      {/* Titolo */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-navy mb-1">Titolo</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy text-lg font-semibold focus:outline-none focus:ring-3 focus:ring-steel/40 focus:border-steel transition"
          placeholder="Titolo dell'articolo"
        />
      </div>

      {/* Categoria + estratto */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="cat" className="block text-sm font-medium text-navy mb-1">Categoria</label>
          <select
            id="cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy focus:outline-none focus:ring-3 focus:ring-steel/40 focus:border-steel transition bg-white"
          >
            {categorie.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="excerpt" className="block text-sm font-medium text-navy mb-1">Estratto (anteprima)</label>
          <input
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full rounded-lg border border-navy/15 px-4 py-2.5 text-navy focus:outline-none focus:ring-3 focus:ring-steel/40 focus:border-steel transition"
            placeholder="Breve descrizione mostrata nella lista"
          />
        </div>
      </div>

      {/* Contenuto */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="content" className="block text-sm font-medium text-navy">Contenuto</label>
          <label className="inline-flex items-center gap-1.5 text-sm font-medium text-steel cursor-pointer hover:text-navy">
            <ImagePlus size={15} /> Inserisci immagine nel testo
            <input type="file" accept="image/*" onChange={handleInlineImage} className="hidden" />
          </label>
        </div>
        <textarea
          id="content"
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          className="w-full rounded-lg border border-navy/15 px-4 py-3 text-navy font-mono text-sm leading-relaxed focus:outline-none focus:ring-3 focus:ring-steel/40 focus:border-steel transition"
          placeholder={"Scrivi qui l'articolo.\n\nPuoi usare la formattazione Markdown:\n## Titolo di sezione\n**grassetto**  *corsivo*\n- elenco puntato\n\nUsa il bottone qui sopra per inserire immagini."}
        />
        <p className="text-xs text-navy/40 mt-1">
          Formattazione Markdown supportata: <code># Titolo</code>, <code>**grassetto**</code>, <code>- elenco</code>, ecc.
        </p>
      </div>

      {uploading && (
        <p className="text-sm text-steel flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Caricamento immagine…</p>
      )}

      {/* Azioni */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-navy/10">
        <button
          onClick={() => save(true)}
          disabled={saving}
          className="bg-steel text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-navy transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Eye size={18} />} Pubblica
        </button>
        <button
          onClick={() => save(false)}
          disabled={saving}
          className="bg-white text-navy font-semibold px-6 py-2.5 rounded-lg border border-navy/20 hover:border-navy transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60"
        >
          {published ? <EyeOff size={18} /> : <Save size={18} />} Salva come bozza
        </button>
      </div>
    </div>
  );
}
