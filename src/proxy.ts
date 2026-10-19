import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { response, claims } = await updateSession(request);

  if (!claims && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
