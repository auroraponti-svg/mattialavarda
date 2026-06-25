import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PostEditor from "@/components/admin/PostEditor";
import { createClient } from "@/lib/supabase/server";
import { type Post } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const post = data as Post;

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto mb-6">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-steel hover:text-navy transition-colors cursor-pointer">
          <ArrowLeft size={16} /> Torna alla lista
        </Link>
        <h1 className="text-3xl font-bold text-navy mt-3">Modifica articolo</h1>
      </div>
      <PostEditor post={post} />
    </div>
  );
}
