"use client"

import { useEffect, useRef, useState } from "react"
import { FileText, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface Document {
  id: string
  name: string
  size: string
  modified: string
  owner: string
  status: "active" | "archived"
  delay: number
}

const documents: Document[] = [
  {
    id: "1",
    name: "Q4 Financial Report.pdf",
    size: "2.4 MB",
    modified: "2 hours ago",
    owner: "Sarah Johnson",
    status: "active",
    delay: 0,
  },
  {
    id: "2",
    name: "Product Roadmap 2025.docx",
    size: "1.8 MB",
    modified: "1 day ago",
    owner: "Mike Chen",
    status: "active",
    delay: 50,
  },
  {
    id: "3",
    name: "Team Meeting Notes.txt",
    size: "0.3 MB",
    modified: "3 days ago",
    owner: "Emma Davis",
    status: "active",
    delay: 100,
  },
  {
    id: "4",
    name: "Budget Allocation.xlsx",
    size: "3.1 MB",
    modified: "1 week ago",
    owner: "John Smith",
    status: "archived",
    delay: 150,
  },
]

export function RecentDocuments() {
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
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-mono font-semibold text-foreground">Recent Documents</h2>
      </div>

      <div className="divide-y divide-border">
        {documents.map((doc, index) => (
          <div
            key={doc.id}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            className={cn(
              "group p-4 hover:bg-accent/5 transition-colors duration-200",
              visibleItems.has(index) && "animate-fade-in-up",
            )}
            style={{
              animationDelay: `${doc.delay}ms`,
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-accent/10 text-accent flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.modified}</span>
                    <span>•</span>
                    <span>{doc.owner}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    doc.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
                  )}
                >
                  {doc.status}
                </span>

                <button className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
