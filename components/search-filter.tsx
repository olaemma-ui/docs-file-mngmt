"use client"
import { useState, useEffect, useRef } from "react"
import { Search, X, Filter, Calendar, User, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchResult {
  id: string
  name: string
  type: "document" | "folder"
  owner: string
  modified: string
  tags: string[]
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    name: "Q4 Financial Report.pdf",
    type: "document",
    owner: "Sarah Johnson",
    modified: "2 hours ago",
    tags: ["finance", "report"],
  },
  {
    id: "2",
    name: "Product Roadmap 2025.docx",
    type: "document",
    owner: "Mike Chen",
    modified: "1 day ago",
    tags: ["product", "planning"],
  },
  {
    id: "3",
    name: "Finance Folder",
    type: "folder",
    owner: "Admin",
    modified: "3 days ago",
    tags: ["finance"],
  },
]

export function SearchFilter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockResults.filter((result) => result.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setResults(filtered)
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  }, [searchQuery])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleFilter = (filter: string) => {
    const newFilters = new Set(selectedFilters)
    if (newFilters.has(filter)) {
      newFilters.delete(filter)
    } else {
      newFilters.add(filter)
    }
    setSelectedFilters(newFilters)
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents, folders, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowResults(true)}
            className={cn(
              "w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all",
            )}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("")
                setShowResults(false)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in-up">
            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className="p-4 border-b border-border last:border-b-0 hover:bg-accent/5 transition-colors cursor-pointer group"
                  style={{
                    animation: `fadeInUp 0.3s ease-in both`,
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate group-hover:text-accent transition-colors">
                        {result.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="px-2 py-0.5 bg-muted rounded">{result.type}</span>
                        <span>{result.owner}</span>
                        <span>•</span>
                        <span>{result.modified}</span>
                      </div>
                      {result.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {result.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showResults && results.length === 0 && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg p-4 text-center text-sm text-muted-foreground">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => toggleFilter("date")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
            selectedFilters.has("date")
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted-foreground hover:border-accent/50",
          )}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Date</span>
        </button>

        <button
          onClick={() => toggleFilter("owner")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
            selectedFilters.has("owner")
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted-foreground hover:border-accent/50",
          )}
        >
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">Owner</span>
        </button>

        <button
          onClick={() => toggleFilter("tags")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
            selectedFilters.has("tags")
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted-foreground hover:border-accent/50",
          )}
        >
          <Tag className="w-4 h-4" />
          <span className="text-sm font-medium">Tags</span>
        </button>

        <button
          onClick={() => toggleFilter("type")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
            selectedFilters.has("type")
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-muted-foreground hover:border-accent/50",
          )}
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Type</span>
        </button>

        {selectedFilters.size > 0 && (
          <button
            onClick={() => setSelectedFilters(new Set())}
            className="text-xs text-accent hover:text-accent/80 transition-colors font-medium"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
