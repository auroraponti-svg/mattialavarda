"use client";

import { useRouter } from "next/navigation";
import { LogOut, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-2 text-sm font-medium text-navy/60 hover:text-red-600 transition-colors cursor-pointer"
    >
      <LogOut size={16} /> Esci
    </button>
  );
}

export function DeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  async function remove() {
    if (!confirm(`Eliminare definitivamente "${title}"?`)) return;
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", id);
    router.refresh();
  }
  return (
    <button
      onClick={remove}
      className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors cursor-pointer"
      aria-label={`Elimina ${title}`}
    >
      <Trash2 size={15} /> Elimina
    </button>
  );
}
