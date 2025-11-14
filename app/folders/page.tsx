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
  LucideUser2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFolderStore } from "./store/folder.store";
import { CreateFolderModal } from "@/components/modals/create-folder-modal";
import { toast, Toaster } from "sonner";
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
import { FolderEntity } from "./entities/folder.entity";
import { ShareDialog } from "@/components/share-dialog";
import { useShareStore } from "../share/store/useShareStore";

export default function FoldersPage() {
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isRenameFolderModalOpen, setIsRenameFolderModalOpen] = useState(false);

  const [openShare, setOpenShare] = useState(false);

  const [folder, setFolder] = useState<FolderEntity>();

  const {
    createFolder,
    setCurrentFolder,
    renameFolder,
    listMyFolders,
    folders,
    loading,
    error,
  } = useFolderStore();

  const { shareResource } = useShareStore();

  const { user } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    const fetchFolders = async () => {
      await listMyFolders();
    };
    fetchFolders();
  }, [listMyFolders]);

  const handleShare = async (data: { users: string[]; teams: string[] }) => {
    toast.promise(
      shareResource({
        access: "VIEW",
        emails: data.users,
        teamIds: data.teams,
        folderId: folder?.id,
      }),
      {
        description: "Sharing This folder.....",
      }
    );
  };

  const handleRename = (folder: FolderEntity, e: any) => {
    e.stopPropagation();
    setFolder(folder);
    setCurrentFolder(folder);
    setIsRenameFolderModalOpen(true);
  };

  const handleDelete = (folderId: string) => {
    console.log("Delete folder:", folderId);
  };

  const handleOpen = (value: FolderEntity) => {
    // console.log("Delete folder:", folderId);
    setCurrentFolder(value);
    router.push(`folders/documents/${value.id}`);
  };

  return (
    <main className="flex-1 md:ml-64 transition-all duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-xl font-mon font-semibold- text-foreground">
                Folders
              </h2>
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
                onClick={() => handleOpen(folder)}
                className="p-6 shadow-none hover:bg-secondary/2 transition-all duration-300 group cursor-pointer"
                style={{
                  animation: `fadeInUp 0.5s ease-out`,
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="flex items-start justify-between mb-4-">
                  <div className="flex gap-4 items-start">
                    <div className="p-3 border rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                      <Folder className="w-6 h-6 text-black/10" />
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
                  {folder.owner?.id === user?.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-2 rounded-lg hover:bg-muted"
                        >
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 border-border shadow-lg"
                      >
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenShare(true);
                            setFolder(folder);
                            setCurrentFolder(folder);
                          }}
                          className="flex items-center gap-2"
                        >
                          <Share2 className="w-4 h-4 text-muted-foreground" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            handleRename(folder, e);
                          }}
                          className="flex items-center gap-2"
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(folder.id!)}
                          className="flex items-center gap-2 text-destructive focus:text-destructive"
                        >
                          <Trash className="w-4 h-4 text-destructive" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    {folder.owner?.id !== user?.id ? (
                      <>
                        <Share2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {folder.owner?.fullName ?? ""}
                        </span>
                      </>
                    ) : (
                      <LucideUser2 className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(folder.createdAt!), "dd MMM yyyy")}
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

      <ShareDialog
        open={openShare}
        onOpenChange={setOpenShare}
        onShare={handleShare}
        allowTeams
      />
      <CreateFolderModal
        isEdit={false}
        isOpen={isCreateFolderModalOpen}
        isLoading={loading}
        errorMessage={error}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreateFolder={createFolder}
      />
      {/* Update FOlder Dialog */}
      <CreateFolderModal
        isEdit={true}
        folderId={folder?.id}
        folderName={folder?.name}
        onRenameFolder={renameFolder}
        isOpen={isRenameFolderModalOpen}
        isLoading={loading}
        errorMessage={error}
        onClose={() => setIsRenameFolderModalOpen(false)}
      />
      <Toaster closeButton />
    </main>
  );
}
