import { NextResponse } from 'next/server'


export function proxy(request) {
  const path = request.nextUrl.pathname

  const ispublicpath = path === "/signup" || path === "/login";
  const token = request.cookies.get("token")?.value || "";

   const nextAuthToken =
    request.cookies.get("next-auth.session-token")?.value || request.cookies.get("__Secure-next-auth.session-token")?.value;

    const isLoggedIn = token || nextAuthToken;


  if (ispublicpath && isLoggedIn) {  //then why login
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
  if (!ispublicpath && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/",
    "/chatai",
    "/login",
    "/signup"
  ],
}