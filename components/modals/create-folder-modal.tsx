"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Folder, Loader, InfoIcon } from "lucide-react";
import {
  CreateFolderDTO,
  CreateFolderSchema,
} from "@/app/folders/dto/create-folder.dto";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { toast } from "sonner";

interface CreateFolderModalProps {
  isOpen: boolean;

  // This is to parse the Id on update cxall
  isEdit: boolean;
  folderName?: string;
  folderId?: string;

  onClose: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  onCreateFolder?: (payload: CreateFolderDTO) => Promise<void>;
  onRenameFolder?: (
    folderId: string,
    payload: CreateFolderDTO
  ) => Promise<void>;
}

export function CreateFolderModal({
  isOpen,
  isEdit,
  folderName,
  folderId,
  onClose,
  errorMessage,
  isLoading,
  onCreateFolder,
  onRenameFolder,
}: CreateFolderModalProps) {
  useEffect(() => {
    if (folderName) {
      setFields((prev) => ({ ...prev, name: folderName }));
    }
  }, [folderName]);


  const [fields, setFields] = useState<CreateFolderDTO>({
    name: folderName ?? "",
    parentId: undefined,
  });
  const [errors, setErrors] = useState<CreateFolderDTO>({
    name: "",
  });

  const handleChange = (key: keyof CreateFolderDTO, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setErrors({ name: "" });
    console.log({ fields });
    console.log({ folderName, folderId });
    if (validate()) {
      if (isEdit) await onRenameFolder?.(folderId ?? "", fields);
      else await onCreateFolder?.(fields);
      if (!errorMessage) {
        onClose();
        setFields({ name: "", parentId: undefined });
        setErrors({ name: "" });
      }
      return;
    }
  };

  const validate = () => {
    const validation = CreateFolderSchema.safeParse(fields);
    const formattedErrors: Partial<CreateFolderDTO> = {};
    validation.error?.errors.forEach((error) => {
      const path = error.path[0] as keyof CreateFolderDTO;
      formattedErrors[path] = error.message;
    });
    setErrors(formattedErrors as CreateFolderDTO);
    return validation.success;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          {/* Centered modal with responsive width */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-md px-4"
          >
            <Card className="w-full border border-border bg-background p-6 shadow-lg">
              {errorMessage && (
                <Alert>
                  <InfoIcon />
                  <AlertTitle>Error occurred</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-primary font-semibold text-foreground">
                  {isEdit ? "Rename Folder" : " Create New Folder"}
                </h2>
                <button
                  onClick={() => {
                    setErrors({ name: "" });
                    onClose();
                  }}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    Folder Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Folder Name"
                    value={fields.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`${errors.name ? "border-destructive" : ""}`}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setErrors({ name: "" });
                    onClose();
                  }}
                  disabled={isLoading}
                  className="flex-1 bg-transparent cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="flex-1 bg-primary hover:bg-primary/70 cursor-pointer text-primary-foreground"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      {isEdit ? "Renaming Folder" : " Creating Folder"}
                    </>
                  ) : isEdit ? (
                    "Rename Folder"
                  ) : (
                    " Create New Folder"
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
