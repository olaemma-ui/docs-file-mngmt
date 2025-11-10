import { UploadedFile } from "@/components/file-upload";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



  export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const processFiles = (fileList: File[]) => {
    fileList.forEach((file) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newFile: UploadedFile = {
        id,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "uploading",
      };

      // setFiles((prev) => [...prev, newFile]);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          // setFiles((prev) =>
          //   prev.map((f) =>
          //     f.id === id ? { ...f, progress: 100, status: "completed" } : f
          //   )
          // );
        } else {
          // setFiles((prev) =>
          //   prev.map((f) => (f.id === id ? { ...f, progress } : f))
          // );
        }
      }, 500);
    });
  };
