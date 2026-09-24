import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { googleConfigured, GOOGLE_SCOPES } from "@/lib/google";

export const dynamic = "force-dynamic";

// Avvia l'autorizzazione Google. Solo per admin loggato.
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const origin = new URL(request.url).origin;

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", origin));
  }
  if (!googleConfigured()) {
    return NextResponse.redirect(new URL("/admin?tab=impostazioni&google=missing_env", origin));
  }

  const redirectUri = `${origin}/api/google/callback`;
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent", // forza il rilascio del refresh token
    include_granted_scopes: "true",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
