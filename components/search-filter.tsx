"use client";
import { useEffect, useRef, useState } from "react";
import { Search, X, Filter, Calendar, User, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDocumentsStore } from "@/app/folders/documents/store/documents.store";

export function SearchFilter({ folderId }: { folderId?: string }) {
  const { searchFiles, searchResult, loading } = useDocumentsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Trigger search when typing
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        searchFiles(folderId, { keyWord: searchQuery });
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search documents or folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          )}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent/10 rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        <button
          // onClick={() => toggleFilter("date")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
            // selectedFilters.has("date")
            //   ? "border-accent bg-accent/10 text-accent"
            //   : "border-border text-muted-foreground hover:border-accent/50"
            "border-border text-muted-foreground hover:border-accent/50"
          )}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Date</span>
        </button>

        <button
          // onClick={() => toggleFilter("owner")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
            // selectedFilters.has("owner")
            //   ? "border-accent bg-accent/10 text-accent"
            //   :
            "border-border text-muted-foreground hover:border-accent/50"
          )}
        >
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">Owner</span>
        </button>

        <button
          // onClick={() => toggleFilter("tags")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
            // selectedFilters.has("tags")
            //   ? "border-accent bg-accent/10 text-accent"
            // : "border-border text-muted-foreground hover:border-accent/50"
            "border-border text-muted-foreground hover:border-accent/50"
          )}
        >
          <Tag className="w-4 h-4" />
          <span className="text-sm font-medium">Tags</span>
        </button>

        <button
          // onClick={() => toggleFilter("type")}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
            // selectedFilters.has("type")
            //   ? "border-accent bg-accent/10 text-accent"
            // : "border-border text-muted-foreground hover:border-accent/50"
            "border-border text-muted-foreground hover:border-accent/50"
          )}
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Type</span>
        </button>

        {/* {selectedFilters.size > 0 && (
          <button
            onClick={() => setSelectedFilters(new Set())}
            className="text-xs text-accent hover:text-accent/80 transition-colors font-medium"
          >
            Clear all
          </button>
        )} */}
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : searchResult.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {searchResult.map((result) => (
                <div
                  key={result.id}
                  className="p-4 border-b border-border last:border-b-0 hover:bg-accent/5 cursor-pointer"
                >
                  <p className="font-medium text-foreground truncate">
                    {result.name}
                  </p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {result.mimeType || "Document"} • {result.updatedAt}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
