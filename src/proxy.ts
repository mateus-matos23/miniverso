import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/session";

export async function proxy(request: NextRequest) {
  const { response, claims } = await updateSession(request);

  // Autorização pelas claims do JWT (app_metadata.role), igual a `requireAdmin` em src/features/auth/require-admin.ts.
  const ehAdmin = claims?.app_metadata?.role === "admin";

  if (!ehAdmin && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/previa"],
};
