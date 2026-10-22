import { NextResponse } from "next/server";
import { guard } from "@/lib/adminSession";
import { deletePost } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = await guard(request);
  if (denied) return denied;

  const { id } = await ctx.params;
  try {
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Eliminazione non riuscita." }, { status: 500 });
  }
}
