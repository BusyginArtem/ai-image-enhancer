"use client";

import { cn } from "@/lib/utils";
import { ChangeEvent, ReactNode } from "react";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  loadArea: ReactNode;
  className?: string;
}

export default function FileUploader({
  onFileUpload,
  loadArea,
  className,
}: FileUploaderProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        id="picture"
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleFileChange}
        className="absolute inset-0 z-[1] h-full w-full cursor-pointer opacity-0"
      />

      {loadArea}
    </div>
  );
}
