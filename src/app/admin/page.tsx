import Link from "next/link";
import { Plus, Pencil, CircleCheck, CircleDashed } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, type Post } from "@/lib/posts";
import { LogoutButton, DeleteButton } from "@/components/admin/AdminActions";
import { getSeoLevel, seoColors, seoLabels } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
  const posts = (data ?? []) as Post[];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-navy">Gestione blog</h1>
        <LogoutButton />
      </div>
      <p className="text-navy/50 mb-8">Crea, modifica e pubblica gli articoli del tuo sito.</p>

      <Link
        href="/admin/new"
        className="inline-flex items-center gap-2 bg-steel text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-navy transition-colors cursor-pointer mb-8"
      >
        <Plus size={18} /> Nuovo articolo
      </Link>

      {posts.length === 0 ? (
        <p className="text-navy/50 bg-mist rounded-xl p-8 text-center">Nessun articolo. Inizia creandone uno!</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="bg-white rounded-xl border border-navy/10 p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {p.published ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600"><CircleCheck size={13} /> Pubblicato</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600"><CircleDashed size={13} /> Bozza</span>
                  )}
                  <span className="text-xs text-navy/40">· {p.category} · {formatDate(p.created_at)}</span>
                  {(() => {
                    const level = getSeoLevel(p);
                    return (
                      <span
                        className="inline-flex items-center gap-1 text-xs font-medium"
                        title={seoLabels[level]}
                        style={{ color: seoColors[level] }}
                      >
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: seoColors[level] }}
                        />
                        SEO
                      </span>
                    );
                  })()}
                </div>
                <p className="font-semibold text-navy truncate">{p.title}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Link href={`/admin/${p.id}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-steel hover:text-navy transition-colors cursor-pointer">
                  <Pencil size={15} /> Modifica
                </Link>
                <DeleteButton id={p.id} title={p.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
