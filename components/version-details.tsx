"use client"

import { Button } from "@/components/ui/button"
import { Copy, Check, Download, Share2 } from "lucide-react"
import { useState } from "react"

interface VersionInfo {
  version: string
  author: string
  email: string
  timestamp: string
  size: number
  changes: string
  changesSummary: string[]
  downloads: number
}

const versionData: Record<string, VersionInfo> = {
  v5: {
    version: "v5",
    author: "Sarah Johnson",
    email: "sarah@company.com",
    timestamp: "2 hours ago (Oct 17, 2025 at 2:30 PM)",
    size: 2.4,
    changes: "Updated financial projections",
    changesSummary: [
      "Revised Q4 revenue forecast by +5%",
      "Updated expense projections",
      "Added new market analysis section",
      "Corrected calculation errors in appendix",
    ],
    downloads: 12,
  },
  v4: {
    version: "v4",
    author: "Mike Chen",
    email: "mike@company.com",
    timestamp: "1 day ago (Oct 16, 2025 at 3:15 PM)",
    size: 2.3,
    changes: "Added Q4 revenue breakdown",
    changesSummary: [
      "Added detailed Q4 revenue breakdown by region",
      "Included new customer acquisition metrics",
      "Updated market share analysis",
    ],
    downloads: 8,
  },
  v3: {
    version: "v3",
    author: "Sarah Johnson",
    email: "sarah@company.com",
    timestamp: "3 days ago (Oct 14, 2025 at 10:00 AM)",
    size: 2.1,
    changes: "Initial draft with Q1-Q3 data",
    changesSummary: ["Added Q1-Q3 financial data", "Created initial structure", "Added charts and graphs"],
    downloads: 5,
  },
  v2: {
    version: "v2",
    author: "Alex Rivera",
    email: "alex@company.com",
    timestamp: "1 week ago (Oct 10, 2025 at 4:45 PM)",
    size: 1.9,
    changes: "Added formatting and charts",
    changesSummary: ["Applied professional formatting", "Added data visualization charts", "Improved readability"],
    downloads: 3,
  },
  v1: {
    version: "v1",
    author: "You",
    email: "you@company.com",
    timestamp: "2 weeks ago (Oct 3, 2025 at 9:00 AM)",
    size: 1.5,
    changes: "Initial document creation",
    changesSummary: ["Created initial document", "Added basic structure", "Set up template"],
    downloads: 1,
  },
}

export function VersionDetails({ version }: { version: string }) {
  const info = versionData[version] || versionData.v5
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`Version ${info.version} - ${info.timestamp}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-mono font-semibold text-foreground mb-2">{info.version}</h3>
            <p className="text-sm text-muted-foreground">{info.changes}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 bg-transparent">
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Author</p>
            <p className="text-sm font-medium text-foreground">{info.author}</p>
            <p className="text-xs text-muted-foreground">{info.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Created</p>
            <p className="text-sm font-medium text-foreground">{info.timestamp}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">File Size</p>
            <p className="text-sm font-medium text-foreground">{info.size} MB</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Downloads</p>
            <p className="text-sm font-medium text-foreground">{info.downloads} times</p>
          </div>
        </div>
      </div>

      {/* Changes Summary */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Changes in this version</h4>
        <ul className="space-y-2">
          {info.changesSummary.map((change, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-foreground">
              <span className="text-accent font-semibold mt-0.5">•</span>
              <span>{change}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" className="gap-2 flex-1 bg-transparent">
          <Download className="w-4 h-4" />
          Download
        </Button>
        <Button variant="outline" size="sm" className="gap-2 flex-1 bg-transparent">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>
    </div>
  )
}
