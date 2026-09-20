import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/session';

/**
 * An optimistic gate, not the authorisation layer.
 *
 * This only checks whether a session cookie is present, so an unauthenticated
 * visitor is redirected before the panel renders. It deliberately does no
 * verification — proxy runs on every request including prefetches, and the
 * Next.js docs are explicit that it should not be the only line of defence.
 *
 * The real check is verifySession() in app/admin/(panel)/layout.tsx, which
 * validates the signature and the expiry.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const isLoginPage = pathname === '/admin/login';

  if (!hasCookie && !isLoginPage) {
    const url = new URL('/admin/login', request.url);
    // So the coach lands where they were heading after signing in.
    if (pathname !== '/admin') url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (hasCookie && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
