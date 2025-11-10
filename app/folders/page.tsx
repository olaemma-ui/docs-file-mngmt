"use client";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  Folder,
  Plus,
  MoreVertical,
  Share2,
  UserCircleIcon,
  Pencil,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFolderStore } from "./store/folder.store";
import { CreateFolderModal } from "@/components/modals/create-folder-modal";
import { Toaster } from "sonner";
import { useAuthStore } from "../auth/store/auth.store";
import { FolderSkeleton } from "./loading.state";
import { EmptyFolders } from "./empty.state";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function FoldersPage() {
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const { createFolder, listMyFolders, folders, loading, error } =
    useFolderStore();

  const { user } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    const fetchFolders = async () => {
      await listMyFolders();
    };
    fetchFolders();
  }, [listMyFolders]);

  const handleShare = (folderId: string) => {
    console.log("Share folder:", folderId);
  };

  const handleRename = (folderId: string) => {
    console.log("Rename folder:", folderId);
  };

  const handleDelete = (folderId: string) => {
    console.log("Delete folder:", folderId);
  };

  const handleOpen = (folderId: string) => {
    // console.log("Delete folder:", folderId);
    router.push(`folders/documents/${folderId}`);
  };

  return (
    <main className="flex-1 md:ml-64 transition-all duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">
                Folders
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Organize and manage your document folders
              </p>
            </div>
            <Button
              onClick={() => setIsCreateFolderModalOpen(true)}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              New Folder
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 md:p-8">
        {loading ? (
          <FolderSkeleton />
        ) : (folders ?? []).length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders?.map((folder, index) => (
              <Card
                key={folder.id}
                onClick={() => handleOpen(folder.id)}
                className="p-6 shadow-none hover:bg-accent/50 transition-all duration-300 group cursor-pointer"
                style={{
                  animation: `fadeInUp 0.5s ease-out`,
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4 items-start">
                    <div className="p-3 border rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                      <Folder className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-mono font-semibold text-foreground">
                        {folder.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {folder.filesCount ?? 0} documents
                      </p>
                    </div>
                  </div>

                  {/* Dropdown menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-2 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 border-border shadow-lg"
                    >
                      <DropdownMenuItem
                        onClick={() => handleShare(folder.id)}
                        className="flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4 text-muted-foreground" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRename(folder.id)}
                        className="flex items-center gap-2"
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(folder.id)}
                        className="flex items-center gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash className="w-4 h-4 text-destructive" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    {folder.owner?.id !== user?.id ? (
                      <>
                        <Share2 className="w-4 h-4 text-primary/20" />
                        <span className="text-xs text-muted-foreground">
                          {folder.owner?.fullName ?? ""}
                        </span>
                      </>
                    ) : (
                      <UserCircleIcon className="w-4 h-4 text-primary/20" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(folder.createdAt), "dd MMM yyyy")}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyFolders
            onCreateFolder={() => setIsCreateFolderModalOpen(true)}
          />
        )}
      </div>

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        isLoading={loading}
        errorMessage={error}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreateFolder={createFolder}
      />
      <Toaster closeButton />
    </main>
  );
}
