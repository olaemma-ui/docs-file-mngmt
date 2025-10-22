"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { FileText, Users, FolderOpen, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCard {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  delay: number
}

const stats: StatCard[] = [
  {
    label: "Total Documents",
    value: "2,847",
    icon: <FileText className="w-6 h-6" />,
    trend: "+12% this month",
    delay: 0,
  },
  {
    label: "Active Users",
    value: "156",
    icon: <Users className="w-6 h-6" />,
    trend: "+8% this month",
    delay: 100,
  },
  {
    label: "Shared Folders",
    value: "43",
    icon: <FolderOpen className="w-6 h-6" />,
    trend: "+5% this month",
    delay: 200,
  },
  {
    label: "Recent Activity",
    value: "892",
    icon: <Activity className="w-6 h-6" />,
    trend: "Last 7 days",
    delay: 300,
  },
]

export function DashboardStats() {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          ref={(el) => {
            itemRefs.current[index] = el
          }}
          className={cn(
            "group relative p-6 rounded-lg border border-border bg-card hover:border-accent/50 transition-all duration-300",
            visibleItems.has(index) && "animate-fade-in-up",
          )}
          style={{
            animationDelay: `${stat.delay}ms`,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
              {stat.icon}
            </div>
          </div>

          <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</h3>
          <p className="text-3xl font-mono font-semibold text-foreground mb-2">{stat.value}</p>

          {stat.trend && <p className="text-xs text-accent font-medium">{stat.trend}</p>}

          {/* Hover effect line */}
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent to-transparent rounded-b-lg w-0 group-hover:w-full transition-all duration-300" />
        </div>
      ))}
    </div>
  )
}
