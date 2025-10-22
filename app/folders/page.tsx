"use client"
import { SidebarNav } from "@/components/sidebar-nav"
import { useState } from "react"
import { Folder, Plus, MoreVertical, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface FolderItem {
  id: string
  name: string
  documents: number
  shared: boolean
  lastModified: string
  owner: string
}

const folders: FolderItem[] = [
  {
    id: "1",
    name: "Project Alpha",
    documents: 24,
    shared: true,
    lastModified: "2 hours ago",
    owner: "You",
  },
  {
    id: "2",
    name: "Client Proposals",
    documents: 12,
    shared: true,
    lastModified: "1 day ago",
    owner: "You",
  },
  {
    id: "3",
    name: "Financial Reports",
    documents: 8,
    shared: false,
    lastModified: "3 days ago",
    owner: "You",
  },
  {
    id: "4",
    name: "Team Collaboration",
    documents: 45,
    shared: true,
    lastModified: "5 hours ago",
    owner: "Team",
  },
  {
    id: "5",
    name: "Archive 2024",
    documents: 156,
    shared: false,
    lastModified: "1 week ago",
    owner: "You",
  },
  {
    id: "6",
    name: "Marketing Assets",
    documents: 67,
    shared: true,
    lastModified: "2 days ago",
    owner: "Marketing",
  },
]

export default function FoldersPage() {
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set())

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <main className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 md:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">Folders</h1>
                <p className="text-sm text-muted-foreground mt-1">Organize and manage your document folders</p>
              </div>
              <Button className="gap-2 bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4" />
                New Folder
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder, index) => (
              <Card
                key={folder.id}
                className="p-6 hover:border-accent/50 transition-all duration-300 group cursor-pointer"
                style={{
                  animation: `fadeInUp 0.5s ease-out`,
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                    <Folder className="w-6 h-6" />
                  </div>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <h3 className="font-mono font-semibold text-foreground mb-2">{folder.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{folder.documents} documents</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    {folder.shared && <Share2 className="w-4 h-4 text-accent" />}
                    <span className="text-xs text-muted-foreground">{folder.lastModified}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
