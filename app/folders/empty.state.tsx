"use client";

import { FolderPlus, ArrowUpRight, Folder } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";

interface EmptyFoldersProps {
  onCreateFolder: () => void;
}

export function EmptyFolders({ onCreateFolder }: EmptyFoldersProps) {
  return (
    <Empty className="md:h-[70vh]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Folder size={40} className="text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No Folders Found</EmptyTitle>
        <EmptyDescription>
          You don’t have any folders yet. Start organizing your documents by
          creating your first folder.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <Button onClick={onCreateFolder} className="gap-2">
            <FolderPlus className="w-4 h-4" />
            New Folder
          </Button>
          {/* <Button variant="outline">Import Folder</Button> */}
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground mt-2"
        size="sm"
      >
        <Link href="/">
          Learn how it works <ArrowUpRight className="w-4 h-4 ml-1" />
        </Link>
      </Button>
    </Empty>
  );
}
