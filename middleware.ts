import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CookieKeys } from './lib/cookies/cookies.enums';


const PUBLIC_PATHS = ['', '/signup', '/public']; // paths that don't need auth

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow public routes
    if (PUBLIC_PATHS.some((path) => pathname.includes(path))) {
        return NextResponse.next();
    }

    let token: string | null | undefined = null;
    // // Check route with alternate key
    if (pathname.includes('/auth/login')) {
        token = req.cookies.get(CookieKeys.ACCESS_TOKEN)?.value;
        if (token) return NextResponse.redirect(new URL('/', req.url));
    } else if (pathname.includes('/verify-invite')) {
        token = req.cookies.get(CookieKeys.VERIFICATION_TOKEN)?.value;
    } else if (pathname.includes('/reset-password')) {
        token = req.cookies.get(CookieKeys.PASSWORD_RESET_TOKEN)?.value;
    } else {
        token = req.cookies.get(CookieKeys.ACCESS_TOKEN)?.value;
    }

    console.log('\x1b[33m%s\x1b[0m', '⚡️ Middleware hit:', req.nextUrl.pathname)



    // // Not logged in? Redirect to login
    if (!token) {
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('redirect', pathname); // redirect back after login
        return NextResponse.redirect(loginUrl);
    }

    // Logged in → allow access
    return NextResponse.next();
}

/**
 * Configure matcher to control which routes middleware runs on.
 * Exclude Next.js internals, assets, etc.
 */
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api/public).*)', // all routes except static files
    ],
};
