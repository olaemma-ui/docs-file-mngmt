"use client"
import { useState } from "react"
import { Folder, FolderOpen, ChevronRight, Plus, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface FolderItem {
  id: string
  name: string
  children?: FolderItem[]
  documentCount: number
}

const initialFolders: FolderItem[] = [
  {
    id: "1",
    name: "Finance",
    documentCount: 24,
    children: [
      { id: "1-1", name: "Q4 Reports", documentCount: 8, children: [] },
      { id: "1-2", name: "Invoices", documentCount: 16, children: [] },
    ],
  },
  {
    id: "2",
    name: "HR",
    documentCount: 12,
    children: [
      { id: "2-1", name: "Policies", documentCount: 5, children: [] },
      { id: "2-2", name: "Employee Records", documentCount: 7, children: [] },
    ],
  },
  {
    id: "3",
    name: "Projects",
    documentCount: 45,
    children: [
      { id: "3-1", name: "Active", documentCount: 28, children: [] },
      { id: "3-2", name: "Archived", documentCount: 17, children: [] },
    ],
  },
]

interface FolderNodeProps {
  folder: FolderItem
  level: number
  expandedFolders: Set<string>
  onToggle: (id: string) => void
}

function FolderNode({ folder, level, expandedFolders, onToggle }: FolderNodeProps) {
  const isExpanded = expandedFolders.has(folder.id)
  const hasChildren = folder.children && folder.children.length > 0

  return (
    <div>
      <div
        className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {hasChildren && (
          <button onClick={() => onToggle(folder.id)} className="p-0.5 hover:bg-accent/20 rounded transition-colors">
            <ChevronRight
              className={cn("w-4 h-4 text-muted-foreground transition-transform", isExpanded && "rotate-90")}
            />
          </button>
        )}

        {!hasChildren && <div className="w-4" />}

        {isExpanded ? (
          <FolderOpen className="w-4 h-4 text-accent flex-shrink-0" />
        ) : (
          <Folder className="w-4 h-4 text-accent flex-shrink-0" />
        )}

        <span className="flex-1 text-sm font-medium text-foreground">{folder.name}</span>

        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{folder.documentCount}</span>

        <button className="p-1 rounded hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors opacity-0 group-hover:opacity-100">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {folder.children!.map((child) => (
            <FolderNode
              key={child.id}
              folder={child}
              level={level + 1}
              expandedFolders={expandedFolders}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FolderStructure() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["1", "2", "3"]))

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedFolders(newExpanded)
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-mono font-semibold text-foreground">Folder Structure</h2>
        <button className="p-2 rounded-lg hover:bg-accent/10 text-accent transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        {initialFolders.map((folder) => (
          <FolderNode
            key={folder.id}
            folder={folder}
            level={0}
            expandedFolders={expandedFolders}
            onToggle={toggleFolder}
          />
        ))}
      </div>
    </div>
  )
}
