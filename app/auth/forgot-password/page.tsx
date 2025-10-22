"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mail, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSubmitted(true)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mb-4">
            <div className="w-6 h-6 bg-accent rounded-md" />
          </div>
          <h1 className="text-2xl font-mono font-semibold text-foreground">DocFlow</h1>
          <p className="text-sm text-muted-foreground mt-2">Reset your password</p>
        </div>

        {/* Reset Card */}
        <Card className="p-6 border border-border/50 backdrop-blur-sm">
          {!submitted ? (
            <>
              <h2 className="text-xl font-mono font-semibold text-foreground mb-2">Forgot Password?</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-secondary/50 border-border/50"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-10 mt-6"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                <Mail className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-mono font-semibold text-foreground mb-2">Check your email</h3>
              <p className="text-sm text-muted-foreground mb-6">
                We've sent a password reset link to {email}. Click the link to create a new password.
              </p>
              <p className="text-xs text-muted-foreground">
                The link will expire in 24 hours. If you don't see the email, check your spam folder.
              </p>
            </div>
          )}

          {/* Back to Login */}
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 text-sm text-accent hover:text-accent/80 mt-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </Card>
      </div>
    </div>
  )
}
