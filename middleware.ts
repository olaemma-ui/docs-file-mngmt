import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CookieKeys } from './lib/cookies/cookies.enums';

const PUBLIC_PATHS = ['/auth/login', '/public', '/auth/verify-invite', '/reset-password'];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    console.log('\x1b[33m%s\x1b[0m', '⚡️ Middleware hit:', pathname);

    let token: string | null | undefined = null;

    // Handle special routes with alternate tokens
    if (pathname.includes('/verify-invite')) {
        token = req.cookies.get(CookieKeys.VERIFICATION_TOKEN)?.value;
    } else if (pathname.includes('/reset-password')) {
        token = req.cookies.get(CookieKeys.PASSWORD_RESET_TOKEN)?.value;
    } else {
        token = req.cookies.get(CookieKeys.ACCESS_TOKEN)?.value;
    }

    // --- Handle public or unauthenticated routes ---
    const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

    // If user is already logged in and tries to access /auth/login → redirect to home
    if (pathname.startsWith('/auth/login') && token) {
        return NextResponse.redirect(new URL('/folders', req.url));
    }

    if (pathname.endsWith('/') && token) {
        return NextResponse.redirect(new URL('/folders', req.url));
    }
    if (pathname.startsWith('/search') && token) {
        return NextResponse.redirect(new URL('/folders', req.url));
    }

    // Allow access to public routes (login, signup, etc.)
    if (isPublic) {
        return NextResponse.next();
    }

    // --- Handle protected routes ---
    if (!token) {
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // --- Authenticated: allow access ---
    return NextResponse.next();
}

/**
 * Configure matcher to control which routes middleware runs on.
 * Exclude Next.js internals, assets, etc.
 */
export const config = {
    matcher: ['/((?!_next|static|.*\\..*).*)'],
};
