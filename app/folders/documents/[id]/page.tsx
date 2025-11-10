"use client";
import { SidebarNav } from "@/components/sidebar-nav";
import { SearchFilter } from "@/components/search-filter";
import { FileUpload } from "@/components/file-upload";
import { FolderStructure } from "@/components/folder-structure";
import { FileList } from "@/components/file-list";
import { DocumentCreationDialog } from "@/components/document-creation-dialog";
import { useDocumentsStore } from "../store/documents.store";
import { useAuthStore } from "@/app/auth/store/auth.store";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { Toaster } from "sonner";

export default function DocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { loading, files, listFiles, uploadFile } = useDocumentsStore();

  const { user } = useAuthStore();
  const { id } = use(params);

  const router = useRouter();
  useEffect(() => {
    const fetchFolders = async () => {
      await listFiles(id);
    };
    fetchFolders();
  }, [listFiles]);

  return (
    <main className="flex-1 md:ml-64 transition-all duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-mono font-semibold text-foreground">
                Documents
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your documents, folders, and files
              </p>
            </div>
            <DocumentCreationDialog folderId={id} />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 md:p-8 space-y-8">
        {/* Search and Filter */}
        <section>
          <SearchFilter folderId={id} />
        </section>

        {/* File List */}
        <section>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-mono font-semibold text-foreground mb-6">
              Your Files
            </h2>
            <FileList files={files} />
          </div>
        </section>

        {/* Folder Structure */}
        {/* <section>
            <FolderStructure />
          </section> */}

        {/* Footer */}
        <footer className="border-t border-border pt-8 pb-4 text-center text-sm text-muted-foreground">
          <p>Document Management System v1.0</p>
        </footer>
      </div>

      <Toaster expand position="bottom-right" />
    </main>
  );
}
