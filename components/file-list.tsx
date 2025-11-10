"use client";

import { useState } from "react";
import {
  File,
  FileText,
  ImageIcon,
  Download,
  Share2,
  MoreVertical,
  Trash2,
  Edit2,
  Lock,
  Globe,
  AppWindowIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DocumentsMeta } from "@/app/folders/documents/service/documents.service";
import { useDocumentsStore } from "@/app/folders/documents/store/documents.store";

/** Safely pick a short file type from mimeType or fallback to extension-like guesses */
function getTypeHint(file?: Partial<DocumentsMeta>) {
  if (!file) return undefined;
  if (file.mimeType) {
    const parts = file.mimeType.split("/");
    return parts[1] ?? parts[0];
  }
  // fallback: try extension from name
  const name = file.name ?? "";
  const ext = name.split(".").pop();
  return ext;
}

function getFileIcon(type?: string | null) {
  switch (type) {
    case "pdf":
      return <FileText className="w-4 h-4 text-red-500" />;
    case "vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "docx":
      return <FileText className="w-4 h-4 text-blue-500" />;
    case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "xlsx":
      return <FileText className="w-4 h-4 text-green-500" />;
    case "figma":
      return <ImageIcon className="w-4 h-4 text-purple-500" />;
    case "txt":
      return <FileText className="w-4 h-4 text-gray-500" />;
    default:
      return <AppWindowIcon className="w-4 h-4 text-muted-foreground" />;
  }
}

function formatFileSize(sizeInBytes?: number) {
  if (!sizeInBytes || isNaN(sizeInBytes)) return "0 KB";

  const kb = sizeInBytes / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;

  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  return `${Math.round(kb)} KB`;
}

export function FileList({ files }: { files?: DocumentsMeta[] | any }) {
  const [sortBy, setSortBy] = useState<"name" | "modified" | "size">(
    "modified"
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "archived"
  >("all");

  // store action
  const deleteFile = useDocumentsStore((s) => s.deleteFile);

  // Ensure files is an array before calling filter/map/etc
  const safeFiles: DocumentsMeta[] = Array.isArray(files) ? files : [];

  const filteredFiles = safeFiles.filter((file: any) => {
    if (filterStatus === "all") return true;
    return (file.status ?? "active") === filterStatus;
  });

  const sortedFiles = [...filteredFiles].sort((a: any, b: any) => {
    switch (sortBy) {
      case "name":
        return (a.name ?? "").localeCompare(b.name ?? "");
      case "size":
        return (b?.size ?? 0) - (a?.size ?? 0);
      case "modified":
      default:
        return 0; // keep server ordering, or implement modified date sort if available
    }
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteFile(id);
    } catch (err) {
      // optional: show toast / error handling here
      console.error("Delete failed", err);
    }
  };

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
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("modified")}>
                Modified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("size")}>
                Size
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* File Table */}
      <div className="rounded-lg border border-border overflow-hidden">
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
            sortedFiles.map((file: any, index: number) => {
              const typeHint = getTypeHint(file);
              return (
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
                    <div className="flex-shrink-0">{getFileIcon(typeHint)}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      {file.shared && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs text-accent">
                            <Globe className="w-3 h-3" />
                            <span>Shared</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Size */}
                  <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </div>

                  {/* Owner */}
                  <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                    {file.ownerId ?? file.owner ?? "You"}
                  </div>

                  {/* Modified */}
                  <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                    {file.updatedAt
                      ? new Date(file.updatedAt).toLocaleDateString()
                      : "—"}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground cursor-pointer transition-colors group-hover:opacity-100"
                      onClick={() => {
                        /* implement download logic */
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground cursor-pointer transition-colors  group-hover:opacity-100">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => {
                            /* share */
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => {
                            /* rename */
                          }}
                        >
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
              );
            })
          ) : (
            <div className="px-6 py-12 text-center">
              <File className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No files found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
