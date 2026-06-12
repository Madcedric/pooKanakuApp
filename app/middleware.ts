import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/api', '/_next', '/favicon.ico'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get('sb-access-token')?.value
    || req.cookies.get('supabase-auth-token')?.value
    || req.cookies.get('sb-localhost-auth-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/customers/:path*',
    '/flowers/:path*',
    '/supply/:path*',
    '/calendar/:path*',
    '/leaves/:path*',
    '/billing/:path*',
    '/payments/:path*',
    '/expenses/:path*',
    '/reports/:path*',
    '/settings/:path*',
  ]
};
