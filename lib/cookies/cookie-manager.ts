'use client';

import { CookieKeys } from './cookies.enums';

export interface CookieOptions {
    path?: string;
    maxAge?: number;
    expires?: Date;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * CookieManager
 * Works only on the client side (browser)
 */
export class CookieManager {
    /**
     * Set a cookie
     */
    static set({
        name,
        value,
        options = {},
    }: {
        name: CookieKeys;
        value: string;
        options?: CookieOptions;
    }) {
        if (typeof document === 'undefined') return;

        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (options.maxAge) cookieString += `; max-age=${options.maxAge}`;
        if (options.expires) cookieString += `; expires=${options.expires.toUTCString()}`;
        cookieString += `; path=${options.path ?? '/'}`;
        if (options.secure) cookieString += `; secure`;
        if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;

        document.cookie = cookieString;
    }

    /**
     * Get a cookie by name
     */
    static get({ name }: { name: CookieKeys }): string | undefined {
        if (typeof document === 'undefined') return undefined;

        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : undefined;
    }

    /**
     * Delete a cookie
     */
    static delete({ name }: { name: CookieKeys }) {
        if (typeof document === 'undefined') return;

        document.cookie = `${encodeURIComponent(name)}=; max-age=0; path=/`;
    }

    /**
     * Get all cookies as object
     */
    static getAll(): Record<string, string> {
        if (typeof document === 'undefined') return {};

        return document.cookie.split(';').reduce((acc, cookie) => {
            const [key, val] = cookie.split('=');
            if (key && val) acc[key.trim()] = decodeURIComponent(val);
            return acc;
        }, {} as Record<string, string>);
    }
}
