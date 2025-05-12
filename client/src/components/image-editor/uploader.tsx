"use client";

import { cn } from "@/lib/utils";
import { ChangeEvent, ReactNode, useRef } from "react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("relative", className)}>
      <input
        id="file-upload-input"
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleFileChange}
        className="absolute inset-0 z-[1] h-full w-full cursor-pointer opacity-0"
        aria-describedby="file-upload-instructions"
      />

      <label htmlFor="file-upload-input" className="cursor-pointer" onClick={handleClick}>
        {loadArea}
      </label>

      <p id="file-upload-instructions" className="sr-only">
        Select an image file to upload (PNG or JPEG).
      </p>
    </div>
  );
}
