"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { LoginDTO, LoginSchema } from "../dto/auth.dto";
import { useAuthStore } from "../store/auth.store";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [field, setField] = useState<LoginDTO>({ email: "", password: "" });
  const { login, loading, isAuthenticated, error } = useAuthStore();

  const router = useRouter();

  const handleChange = (key: keyof LoginDTO, value: string) => {
    setField((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validate = LoginSchema.safeParse(field);
    console.log({ validate });

    if (validate.success) {
      await login(field, () => {
        router.push("/");
      });
      console.log({ isAuthenticated, error });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mb-4">
            <div className="w-6 h-6 bg-accent rounded-md" />
          </div>
          <h1 className="text-2xl font-mono font-semibold text-foreground">
            DocFlow
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            BertAndre Document and File Management
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 border shadow-none border-border/50 backdrop-blur-sm">
          <h2 className="text-xl font-mono font-semibold text-foreground m-0">
            Sign In
            <small className="mb-6 text-[14px] mt-1 block text-black/50">
              BertAndre document and file management portal
            </small>
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}

            {error && (
              <div className="px-5 py-3 rounded-lg border border-red-600 bg-red-600/20 text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={field?.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50 focus:border-accent"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={field?.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50 focus:border-accent"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border/50"
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              {/* <Link
                href="/auth/forgot-password"
                className="text-accent hover:text-accent/80 transition-colors"
              >
                Forgot password?
              </Link> */}
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-10 mt-6"
            >
              {loading ? "Signing in..." : "Sign In"}
              {loading ? <Loader /> : <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          {/* Divider */}
          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-card text-muted-foreground">Or</span>
            </div>
          </div> */}

          {/* Sign Up Link */}
          {/* <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-accent hover:text-accent/80 font-medium transition-colors">
              Sign up
            </Link>
          </p> */}
        </Card>

        {/* Footer */}
        {/* <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <Link href="#" className="text-accent hover:text-accent/80">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-accent hover:text-accent/80">
            Privacy Policy
          </Link>
        </p> */}
      </div>
    </div>
  );
}
