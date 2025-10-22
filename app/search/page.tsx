"use client"
import { SidebarNav } from "@/components/sidebar-nav"
import { useState } from "react"
import { Search, FileText, Folder, Clock, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SearchResult {
  id: string
  title: string
  type: "document" | "folder"
  path: string
  lastModified: string
  size?: string
}

const recentSearches = ["Project Alpha", "Financial Reports", "Client Proposals"]

const searchResults: SearchResult[] = [
  {
    id: "1",
    title: "Q4 Financial Report.pdf",
    type: "document",
    path: "Financial Reports / 2024",
    lastModified: "2 hours ago",
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "Project Alpha Proposal.docx",
    type: "document",
    path: "Project Alpha / Proposals",
    lastModified: "1 day ago",
    size: "1.8 MB",
  },
  {
    id: "3",
    title: "Client Presentations",
    type: "folder",
    path: "Client Proposals",
    lastModified: "3 days ago",
  },
  {
    id: "4",
    title: "Marketing Strategy 2024.pptx",
    type: "document",
    path: "Marketing Assets / Strategy",
    lastModified: "5 days ago",
    size: "3.2 MB",
  },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <main className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 md:px-8 py-4 md:py-6">
            <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">Search</h1>
            <p className="text-sm text-muted-foreground mt-1">Find documents, folders, and files</p>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          {/* Search Input */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search documents, folders, and files..."
                className="pl-12 py-6 text-base"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowResults(e.target.value.length > 0)
                }}
              />
            </div>
          </div>

          {/* Recent Searches */}
          {!showResults && (
            <div className="space-y-4">
              <h2 className="text-sm font-mono font-semibold text-foreground">Recent Searches</h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => {
                      setSearchQuery(search)
                      setShowResults(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {showResults && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Found {searchResults.length} results for "{searchQuery}"
              </p>
              {searchResults.map((result, index) => (
                <Card
                  key={result.id}
                  className="p-4 hover:border-accent/50 transition-all cursor-pointer group"
                  style={{
                    animation: `fadeInUp 0.5s ease-out`,
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 rounded-lg bg-accent/10 text-accent mt-1">
                        {result.type === "document" ? <FileText className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-mono font-semibold text-foreground">{result.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{result.path}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {result.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{result.lastModified}</span>
                          {result.size && <span className="text-xs text-muted-foreground">{result.size}</span>}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
