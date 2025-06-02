import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userTabMatch = pathname.match(/^\/users\/(\d+)\/(projects|groups)$/);

  if (userTabMatch) {
    const [, userId, tab] = userTabMatch;
    const url = request.nextUrl.clone();
    url.pathname = "/";

    // Preserve existing search params and add our middleware params
    url.searchParams.set("directTab", tab);
    url.searchParams.set("directUserId", userId);
    url.searchParams.set("preserveUrl", pathname);

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/users/:path*",
};
