import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeCodeForTokens, saveRefreshToken } from "@/lib/google";

export const dynamic = "force-dynamic";

// Callback OAuth di Google: salva il refresh token. Solo per admin loggato.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", origin));
  }

  if (error || !code) {
    return NextResponse.redirect(new URL("/admin?tab=impostazioni&google=denied", origin));
  }

  try {
    const redirectUri = `${origin}/api/google/callback`;
    const tokens = await exchangeCodeForTokens(code, redirectUri);
    if (!tokens.refresh_token) {
      // Rilasciato solo al primo consenso; forziamo con prompt=consent lato connect.
      return NextResponse.redirect(new URL("/admin?tab=impostazioni&google=no_refresh", origin));
    }
    await saveRefreshToken(tokens.refresh_token);
    return NextResponse.redirect(new URL("/admin?tab=impostazioni&google=connected", origin));
  } catch {
    return NextResponse.redirect(new URL("/admin?tab=impostazioni&google=error", origin));
  }
}
