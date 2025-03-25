"use client";

import { useState, ChangeEvent } from "react";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile) {
      setFile(selectedFile);
      onFileUpload(selectedFile);
    }
  };

  if (file) {
    return null;
  }

  return (
    <div className="border-foreground/30 relative my-40 flex h-32 w-128 items-center justify-center rounded-lg border-2 border-dotted hover:bg-amber-300/75">
      <input
        id="picture"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute h-full w-full cursor-pointer opacity-0"
      />

      <p>Tap here to load your picture</p>
    </div>
  );
}
