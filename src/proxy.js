import { NextResponse } from 'next/server'
 

export function proxy(request) {
    const path=request.nextUrl.pathname

    const ispublicpath=path==="/signup"||path==="/login";
    const token=request.cookies.get("token")?.value||"";

    if(ispublicpath&&token){  //then why login
      return NextResponse.redirect(new URL('/', request.nextUrl));
    }
    if(!ispublicpath&&!token){
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