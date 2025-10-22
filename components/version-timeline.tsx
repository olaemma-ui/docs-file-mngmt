"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, RotateCcw, Download, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Version {
  id: string
  version: string
  author: string
  timestamp: string
  size: number
  changes: string
  isCurrent: boolean
}

const mockVersions: Version[] = [
  {
    id: "v5",
    version: "v5",
    author: "Sarah Johnson",
    timestamp: "2 hours ago",
    size: 2.4,
    changes: "Updated financial projections",
    isCurrent: true,
  },
  {
    id: "v4",
    version: "v4",
    author: "Mike Chen",
    timestamp: "1 day ago",
    size: 2.3,
    changes: "Added Q4 revenue breakdown",
    isCurrent: false,
  },
  {
    id: "v3",
    version: "v3",
    author: "Sarah Johnson",
    timestamp: "3 days ago",
    size: 2.1,
    changes: "Initial draft with Q1-Q3 data",
    isCurrent: false,
  },
  {
    id: "v2",
    version: "v2",
    author: "Alex Rivera",
    timestamp: "1 week ago",
    size: 1.9,
    changes: "Added formatting and charts",
    isCurrent: false,
  },
  {
    id: "v1",
    version: "v1",
    author: "You",
    timestamp: "2 weeks ago",
    size: 1.5,
    changes: "Initial document creation",
    isCurrent: false,
  },
]

export function VersionTimeline({
  selectedVersion,
  onSelectVersion,
}: {
  selectedVersion: string
  onSelectVersion: (version: string) => void
}) {
  const [versions, setVersions] = useState<Version[]>(mockVersions)

  const handleRestore = (versionId: string) => {
    const versionToRestore = versions.find((v) => v.id === versionId)
    if (versionToRestore) {
      setVersions(
        versions.map((v) => ({
          ...v,
          isCurrent: v.id === versionId,
        })),
      )
      onSelectVersion(versionId)
    }
  }

  return (
    <div className="space-y-3">
      {versions.map((version, index) => (
        <div
          key={version.id}
          className={cn(
            "p-4 rounded-lg border-2 cursor-pointer transition-all group",
            selectedVersion === version.id
              ? "border-accent bg-accent/10"
              : "border-border hover:border-accent/50 hover:bg-accent/5",
          )}
          onClick={() => onSelectVersion(version.id)}
          style={{
            animation: `fadeInUp 0.3s ease-out`,
            animationDelay: `${index * 50}ms`,
            animationFillMode: "both",
          }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-semibold text-foreground">{version.version}</span>
              {version.isCurrent && <Badge className="text-xs">Current</Badge>}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </DropdownMenuItem>
                {!version.isCurrent && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-accent" onClick={() => handleRestore(version.id)}>
                      <RotateCcw className="w-4 h-4" />
                      Restore This Version
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-xs text-muted-foreground mb-2">{version.author}</p>
          <p className="text-xs text-muted-foreground mb-3">{version.timestamp}</p>
          <p className="text-xs text-foreground font-medium">{version.changes}</p>
          <p className="text-xs text-muted-foreground mt-2">{version.size} MB</p>
        </div>
      ))}
    </div>
  )
}
