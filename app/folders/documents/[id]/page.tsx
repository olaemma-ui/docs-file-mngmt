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
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useFolderStore } from "../../store/folder.store";
import { ArrowLeft, Share2Icon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

export default function DocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { loading, files, listFiles, uploadFile } = useDocumentsStore();
  const { currentFolder, getFolder } = useFolderStore();

  const { user } = useAuthStore();
  const { id } = use(params);
  const router = useRouter();

  useEffect(() => {
    // console.log({ currentFolder }, { user });
    const fetchFolders = async () => {
      try {
        await Promise.all([listFiles(id), getFolder(id)]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFolders();
  }, [id, listFiles, getFolder]);

  const back = () => {
    router.back();
  };

  return (
    <main className="flex-1 md:ml-64 transition-all duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 md:px-8 py-4 md:py-6">
          <div className="flex flex-col- gap-8 items-center hover:bg-transparent! justify-between-">
            <Button onClick={back} variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="w-full">
              <h4 className="text-xl md:text-xl font-mon font-normal text-foreground">
                Documents
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your documents, folders, and files
              </p>
            </div>
            <div className="justify-self-end-safe">
              {currentFolder?.owner?.id &&
                user?.id &&
                currentFolder?.owner.id === user?.id && (
                  <DocumentCreationDialog folderId={id} />
                )}
            </div>
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
          <div className="rounded-lg grid md:grid-cols-12 gap-4 border border-border bg-card p-6 items-start">
            <div className="md:col-span-8">
              <h2 className="text-lg font-mono font-semibold text-foreground">
                Uploaded Files
              </h2>
              <small className="mb-6 block">
                All your uploaded files will appear here. Upload new files to
                view and manage them.
              </small>

              <FileList files={files} />
            </div>

            <div className=" md:border-l md:pl-4 md:col-span-4 flex flex-col h-full">
              <h2 className="text-lg font-mono font-semibold text-foreground">
                Shared with
              </h2>
              <small>
                See the people you’ve shared this file with. They’ll have access
                to view or edit it.
              </small>
              <div className="border mt-6 overflow-auto pt- flex flex-col gap-2 items-center justify-start rounded-xl h-full max-h-[400px]">
                {/* your shared-with items here */}
                {currentFolder?.shares?.length ? (
                  <div className="space-y-2 w-full p-4">
                    <h4 className="text-lg font-normal text-foreground">
                      Users shared with
                    </h4>
                    {currentFolder.shares[0].sharedWithUsers?.map((u) => (
                      <div className="flex gap-4 cursor-pointer hover:bg-accent/40 transition-colors duration-300 items-start rounded-2xl border p-2">
                        <Avatar className="w-[60px] bg-muted h-[50px] flex items-center justify-center rounded-full">
                          <AvatarFallback className="font-semibold">
                            {(u?.fullName ?? "-")[0] ?? ""}
                            {(u?.fullName ?? "-")[1] ?? ""}
                          </AvatarFallback>
                        </Avatar>
                        <span className="w-full">
                          {u.fullName}{" "}
                          <small className="block"> {u.email} </small>
                        </span>
                      </div>
                    ))}
                    <h4 className="text-lg mt-3 font-normal text-foreground">
                      Teams shared with
                    </h4>
                    {currentFolder.shares[0].sharedWithTeams?.map((u) => (
                      <div className="flex items-center gap-4 cursor-pointer hover:bg-accent/40 transition-colors duration-300 rounded-2xl border p-2">
                        <Avatar className="w-[60px] bg-muted h-[50px] flex items-center justify-center rounded-full">
                          <AvatarFallback className="font-semibold">
                            {(u?.name ?? "-")[0] ?? ""}
                            {(u?.name ?? "-")[1] ?? ""}
                          </AvatarFallback>
                        </Avatar>
                        <span className="w-full block">{u.name} </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 flex flex-col justify-center items-center">
                    <Users className="w-8 h-8 text-muted-foreground/40" />
                    <p className="text-muted-foreground font-semibold text-center">
                      Collaboration starts here
                    </p>
                    <p className="text-muted-foreground text-center text-sm">
                      Add people you’d like to share this file with their names
                      will appear here once invited.
                    </p>
                    {currentFolder?.owner?.id === user?.id && (
                      <Button className="mt-5" variant={"default"}>
                        <Share2Icon />
                        {"Share Now "}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
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
