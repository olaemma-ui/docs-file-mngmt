"use client"

import { useState } from "react"
import { File, FileText, ImageIcon, Download, Share2, MoreVertical, Trash2, Edit2, Lock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  owner: string
  modified: string
  shared: boolean
  status: "active" | "archived"
}

const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "Q4 Financial Report.pdf",
    size: 2.4,
    type: "pdf",
    owner: "Sarah Johnson",
    modified: "2 hours ago",
    shared: true,
    status: "active",
  },
  {
    id: "2",
    name: "Product Roadmap 2025.docx",
    size: 1.8,
    type: "docx",
    owner: "Mike Chen",
    modified: "1 day ago",
    shared: true,
    status: "active",
  },
  {
    id: "3",
    name: "Design System v2.figma",
    size: 5.2,
    type: "figma",
    owner: "You",
    modified: "3 days ago",
    shared: false,
    status: "active",
  },
  {
    id: "4",
    name: "Team Meeting Notes.txt",
    size: 0.3,
    type: "txt",
    owner: "Alex Rivera",
    modified: "5 days ago",
    shared: true,
    status: "active",
  },
  {
    id: "5",
    name: "Budget Spreadsheet 2024.xlsx",
    size: 3.1,
    type: "xlsx",
    owner: "You",
    modified: "1 week ago",
    shared: false,
    status: "archived",
  },
]

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return <FileText className="w-4 h-4 text-red-500" />
    case "docx":
      return <FileText className="w-4 h-4 text-blue-500" />
    case "xlsx":
      return <FileText className="w-4 h-4 text-green-500" />
    case "figma":
      return <ImageIcon className="w-4 h-4 text-purple-500" />
    case "txt":
      return <FileText className="w-4 h-4 text-gray-500" />
    default:
      return <File className="w-4 h-4 text-muted-foreground" />
  }
}

function formatFileSize(mb: number) {
  if (mb < 1) return `${Math.round(mb * 1024)} KB`
  return `${mb.toFixed(1)} MB`
}

export function FileList() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles)
  const [sortBy, setSortBy] = useState<"name" | "modified" | "size">("modified")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "archived">("all")

  const filteredFiles = files.filter((file) => {
    if (filterStatus === "all") return true
    return file.status === filterStatus
  })

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "size":
        return b.size - a.size
      case "modified":
      default:
        return 0
    }
  })

  const handleDelete = (id: string) => {
    setFiles(files.filter((f) => f.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {sortedFiles.length} file{sortedFiles.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Buttons */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {(["all", "active", "archived"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "px-3 py-1.5 rounded text-sm font-medium transition-all",
                  filterStatus === status
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("modified")}>Modified</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("size")}>Size</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* File List */}
      <div className="rounded-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted border-b border-border text-sm font-semibold text-muted-foreground">
          <div className="col-span-4">Name</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-2">Owner</div>
          <div className="col-span-2">Modified</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {sortedFiles.length > 0 ? (
            sortedFiles.map((file, index) => (
              <div
                key={file.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-accent/5 transition-colors group"
                style={{
                  animation: `fadeInUp 0.3s ease-out`,
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                {/* Name */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {file.shared && (
                        <div className="flex items-center gap-1 text-xs text-accent">
                          <Globe className="w-3 h-3" />
                          <span>Shared</span>
                        </div>
                      )}
                      {!file.shared && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Lock className="w-3 h-3" />
                          <span>Private</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Size */}
                <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                  {formatFileSize(file.size)}
                </div>

                {/* Owner */}
                <div className="col-span-2 flex items-center text-sm text-muted-foreground">{file.owner}</div>

                {/* Modified */}
                <div className="col-span-2 flex items-center text-sm text-muted-foreground">{file.modified}</div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors opacity-0 group-hover:opacity-100">
                    <Download className="w-4 h-4" />
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Edit2 className="w-4 h-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive"
                        onClick={() => handleDelete(file.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-12 px-6 py-12 text-center">
              <File className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No files found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
