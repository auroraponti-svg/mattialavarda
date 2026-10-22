import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PostEditor from "@/components/admin/PostEditor";
import { isAdmin } from "@/lib/adminSession";
import { getPostById } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

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
