"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Upload, X, File, CheckCircle } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "completed" | "error";
}

export function FileUpload({
  onFileSelected,
}: {
  onFileSelected: (file: File) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFileSelected(droppedFiles[0]);
    setFiles(droppedFiles);
    // processFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileSelected(e.target.files[0]);
      setFiles(Array.from(e.target.files)); 
      // processFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (id: string) => {
    setFiles([]);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}

      {/* Upload Queue */}
      {files.length <= 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative rounded-lg border-2 border-dashed transition-all duration-200 p-8 text-center cursor-pointer",
            isDragging
              ? "border-accent bg-accent/10"
              : "border-border hover:border-accent/50 hover:bg-accent/5"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            // multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="space-y-3"
          >
            <div className="flex justify-center">
              <div className="p-3 rounded-lg bg-accent/10 text-accent">
                <Upload className="w-8 h-8" />
              </div>
            </div>

            <div>
              <p className="text-lg font-mono font-semibold text-foreground">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT, PPT, PPTX
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-mono font-semibold text-foreground">
            Upload Queue ({files.length})
          </h3>

          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.name}
                className="group p-4 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <File className="w-5 h-5 text-accent flex-shrink-0" />

                  <div className="flex-1 min-w-0 w-full max-w-xs">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* {file.status === "completed" && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )} */}

                  <button
                    onClick={() => removeFile(file.name)}
                    className="p-1 rounded hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                {/* <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-accent/50 transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div> */}

                {/* <p className="text-xs text-muted-foreground mt-2">
                  {file.status === "completed"
                    ? "Upload complete"
                    : `${Math.round(file.progress)}% uploaded`}
                </p> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
