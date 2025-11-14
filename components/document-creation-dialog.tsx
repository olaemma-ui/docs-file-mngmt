"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUpload, UploadedFile } from "./file-upload";
import { useDocumentsStore } from "@/app/folders/documents/store/documents.store";
import { toast } from "sonner";

export function DocumentCreationDialog({ folderId }: { folderId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>();

  const { uploadFile, uploading, listFiles } = useDocumentsStore();

  const handleUploadDocument = async () => {
    if (!selectedFile || !name) {
      toast.error("Please select a file to upload");
      return;
    }
    if (!name) {
      toast.error("Please input file name");
      return;
    }

    // Prepare FormData for API
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("fileName", name);
    formData.append("folderId", folderId);

    toast.promise(uploadFile(formData), {
      loading: "Uploading document...",
      description: name,
      success: async (result) => {
        await listFiles(); // refresh list after upload
        setSelectedFile(null);
        setOpen(false);
        return "Document uploaded successfully!";
      },
      error: "Failed to upload document",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary cursor-pointer hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a new document and keep them organized
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              File Name
            </label>
            <Input
              placeholder="Enter document name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary/50 border-border/50"
            />
          </div>

          <FileUpload onFileSelected={(file) => setSelectedFile(file)} />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-10 gap-3 justify-end pt-4 border-t border-border">
          <Button
            variant="outline"
            className="w-fit col-span-2"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUploadDocument}
            disabled={!name.trim()}
            className="bg-primary w-full col-span-8 hover:bg-accent/90 text-primary-foreground"
          >
            Upload Document
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
