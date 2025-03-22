"use client";

import { useState, ChangeEvent } from "react";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      onFileUpload(selectedFile);
    }
  };

  return (
    <div className='p-4 border-dashed border-2 border-gray-300 rounded-lg'>
      <input
        type='file'
        accept='image/*,video/*'
        onChange={handleFileChange}
        className='w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
      />
      {file && <p className='mt-2 text-gray-600'>Selected: {file.name}</p>}
    </div>
  );
}
