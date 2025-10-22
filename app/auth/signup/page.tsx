"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mail, Lock, User, Building2, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      if (step === 1) setStep(2)
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
          <p className="text-sm text-muted-foreground mt-2">Create your account</p>
        </div>

        {/* Signup Card */}
        <Card className="p-6 border border-border/50 backdrop-blur-sm">
          {/* Progress Steps */}
          <div className="flex gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex-1">
                <div className={`h-1 rounded-full transition-colors ${s <= step ? "bg-accent" : "bg-border/50"}`} />
              </div>
            ))}
          </div>

          <h2 className="text-xl font-mono font-semibold text-foreground mb-6">
            {step === 1 ? "Account Details" : "Verify Email"}
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            {step === 1 ? (
              <>
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="pl-10 bg-secondary/50 border-border/50"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      name="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 bg-secondary/50 border-border/50"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      name="company"
                      placeholder="Your Company"
                      value={formData.company}
                      onChange={handleChange}
                      className="pl-10 bg-secondary/50 border-border/50"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 bg-secondary/50 border-border/50"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 bg-secondary/50 border-border/50"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Email Verification */}
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                    <Check className="w-8 h-8 text-accent" />
                  </div>
                  <p className="text-foreground font-medium mb-2">Verify your email</p>
                  <p className="text-sm text-muted-foreground">We've sent a verification link to {formData.email}</p>
                </div>

                {/* Verification Code Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Verification Code</label>
                  <Input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-lg tracking-widest bg-secondary/50 border-border/50"
                  />
                </div>

                {/* Resend Link */}
                <p className="text-center text-sm text-muted-foreground">
                  Didn't receive the code?{" "}
                  <button className="text-accent hover:text-accent/80 font-medium">Resend</button>
                </p>
              </>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-10 mt-6"
            >
              {isLoading ? "Processing..." : step === 1 ? "Continue" : "Verify Email"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-accent hover:text-accent/80 font-medium">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
