"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { VerifyInviteSchema, VerifyInviteDTO } from "../dto/auth.dto";
import { useAuthStore } from "../store/auth.store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, LockIcon, CheckCircle, Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function VerifyInvitePage() {
  const router = useRouter();
  const { verifyInvite, loading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyInviteDTO>({
    resolver: zodResolver(VerifyInviteSchema),
  });

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: VerifyInviteDTO) => {
    try {
      await verifyInvite(data);
      setSubmitted(true);
      if (error) {
        toast.error(error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mb-4">
            <div className="w-6 h-6 bg-accent rounded-md" />
          </div>
          <h1 className="text-2xl font-mono font-semibold text-foreground">
            Docka
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Verify Invite</p>
        </div>

        {/* Verify Card */}
        <Card className="p-6 shadow-none rounded-4xl border border-border/50 backdrop-blur-sm">
          {!submitted ? (
            <>
              <h2 className="text-xl font-mono font-semibold text-foreground mb-2">
                Verify Invite!
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your email and the temporary password sent to your email,
                set a new password to verify.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      {...register("email")}
                      className={cn(
                        "pl-10 bg-secondary/50 border-border/50",
                        errors.email && "border-red-500"
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Temporary Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Temporary Password
                  </label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Enter temporary password"
                      {...register("temporaryPassword")}
                      className={cn(
                        "pl-10 bg-secondary/50 border-border/50",
                        errors.temporaryPassword && "border-red-500"
                      )}
                    />
                  </div>
                  {errors.temporaryPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.temporaryPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    New Password
                  </label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...register("password")}
                      className={cn(
                        "pl-10 bg-secondary/50 border-border/50",
                        errors.password && "border-red-500"
                      )}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-10 mt-6"
                >
                  {loading ? "Verifying..." : "Verify Invite"}
                  {loading ? (
                    <Loader />
                  ) : (
                    <ArrowRight className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-8 pb-0!">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-mono font-semibold text-foreground mb-2">
                Verification Complete
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Your invite has been verified successfully. You can now log in
                using your new password.
              </p>
              <Button
                onClick={() => router.push("/auth/login")}
                className="bg-primary w-full hover:bg-primary/90 cursor-pointer text-primary-foreground"
              >
                Go to Login
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
