import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'athena_session';

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash.toString(16);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === '/login' ||
    pathname === '/api/login' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/icon.svg' ||
    pathname === '/icon.png' ||
    pathname === '/apple-icon.png'
  ) {
    return NextResponse.next();
  }

  const password = process.env.ATHENA_PASSWORD;
  if (!password) {
    return NextResponse.json(
      { error: 'Server misconfigured: ATHENA_PASSWORD not set' },
      { status: 500 }
    );
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value;
  const expectedHash = hashPassword(password);

  if (sessionCookie !== expectedHash) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
