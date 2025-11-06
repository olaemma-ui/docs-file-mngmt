"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CookieManager } from "@/lib/cookies/cookie-manager";
import { CookieKeys } from "@/lib/cookies/cookies.enums";
import { useAuthStore } from "@/app/auth/store/auth.store";


interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute:
 * Ensures user is authenticated before rendering protected content.
 * Syncs Zustand store and cookie-based auth.
 */
export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, setToken, fetchCurrentUser, user } = useAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      const cookieToken = CookieManager.get({ name: CookieKeys.ACCESS_TOKEN });

      // If no token in cookie or store, redirect to login
      if (!cookieToken && !isAuthenticated) {
        router.push(`${redirectTo}?redirect=${window.location.pathname}`);
        setLoading(false);
        return;
      }

      // If cookie token exists but not in store, sync it
      if (cookieToken && !isAuthenticated) {
        setToken(cookieToken);
        await fetchCurrentUser();
      }

      setLoading(false);
    };

    verifyAuth();
  }, [router, redirectTo, isAuthenticated, setToken, fetchCurrentUser]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  // Render content only when user is authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}
