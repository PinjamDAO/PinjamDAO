import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const config = {
  matcher: [
    '/sign-up',
    '/dashboard',
  ]
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("vhack2025")?.value;

  // console.log("Token:", token);

  const response = (!token) ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next()
  response.headers.set("x-middleware-cache", "no-cache");

  return response;
}