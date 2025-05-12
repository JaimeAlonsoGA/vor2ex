import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { getUserId } from "./services/auth.service";

import { validateAmazonTokens } from "./lib/functions/validate-tokens";

export async function middleware(request: NextRequest) {
  await updateSession(request);

  const userId = await getUserId();
  if (!userId) return NextResponse.redirect(new URL("/sign-in", request.url));

  await validateAmazonTokens();

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/protected/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
