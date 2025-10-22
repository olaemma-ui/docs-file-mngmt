"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Lock, Zap, BarChart3, Share2, Clock, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

const features: Feature[] = [
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Role-Based Access Control",
    description: "Granular permissions for Admin, Manager, Staff, and External users",
    delay: 0,
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Version Control",
    description: "Track document changes with complete version history and rollback",
    delay: 100,
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Lightning Fast Search",
    description: "Full-text search with filters by name, tags, uploader, and folder",
    delay: 200,
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Analytics Dashboard",
    description: "Real-time insights into document usage and team activity",
    delay: 300,
  },
  {
    icon: <Share2 className="w-8 h-8" />,
    title: "Seamless Collaboration",
    description: "Share documents with granular permissions and audit trails",
    delay: 400,
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Enterprise Security",
    description: "AWS S3 storage with encryption and automated backups",
    delay: 500,
  },
]

export function FeaturesSection() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, index]))
          }
        },
        { threshold: 0.1 },
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  return (
    <section className="relative py-20 px-4 md:px-8 overflow-hidden">
      {/* Parallax background with alpha masking */}
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-mono font-semibold text-foreground">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage documents securely and efficiently
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              className={cn(
                "group relative p-6 rounded-xl border border-border bg-card hover:bg-card/80 transition-all duration-300",
                "hover:shadow-lg hover:border-accent/50",
                visibleItems.has(index) && "animate-fade-in-up",
              )}
              style={{
                animationDelay: `${feature.delay}ms`,
              }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-accent/10 transition-all duration-300 -z-10" />

              {/* Icon */}
              <div className="mb-4 inline-flex p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-mono font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent to-transparent rounded-b-xl w-0 group-hover:w-full transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
