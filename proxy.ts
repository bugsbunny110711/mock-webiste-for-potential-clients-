import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/session';
import { STUDENT_COOKIE } from '@/lib/student-session';

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

  if (pathname.startsWith('/admin')) {
    return gate(request, {
      cookie: SESSION_COOKIE,
      loginPath: '/admin/login',
      home: '/admin',
    });
  }

  if (pathname.startsWith('/account')) {
    return gate(request, {
      cookie: STUDENT_COOKIE,
      loginPath: '/account/login',
      home: '/account',
    });
  }

  return NextResponse.next();
}

function gate(
  request: NextRequest,
  { cookie, loginPath, home }: { cookie: string; loginPath: string; home: string },
) {
  const { pathname } = request.nextUrl;
  const hasCookie = Boolean(request.cookies.get(cookie)?.value);
  const isLoginPage = pathname === loginPath;

  if (!hasCookie && !isLoginPage) {
    const url = new URL(loginPath, request.url);
    // So the visitor lands where they were heading after signing in.
    if (pathname !== home) url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (hasCookie && isLoginPage) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
