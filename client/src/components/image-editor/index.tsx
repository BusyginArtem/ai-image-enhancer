"use client";

import { useState } from "react";

import Canvas from "./canvas";
import FileUploader from "./uploader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";

export default function CanvasEditor() {
  const [brushSize, setBrushSize] = useState(10);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const handleFileUpload = (file: File) => {
    setImageFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;

      setUploadedImage(dataUrl);

      const img = new Image();

      img.onload = () => {
        setDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.path;
      } else {
        console.error("Image upload failed.");
        return null;
      }
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const exportMask = async (canvasRef: any) => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob(async (blob: Blob) => {
      if (!blob) return;

      try {
        const formData = new FormData();
        formData.append("mask", blob, "mask.png");

        // First, upload the image
        const uploadedImagePath = await uploadImage();

        if (!uploadedImagePath) return;

        formData.append("image_path", uploadedImagePath);

        const response = await fetch("http://localhost:8000/process", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setEditedImage(data.output_url);
        } else {
          console.error("Image processing failed.");
        }
      } catch (error) {
        console.error("Processing failed:", error);
      }
    }, "image/png");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <FileUploader onFileUpload={handleFileUpload} />

      {uploadedImage && (
        <div className="relative flex h-128 w-128 justify-center">
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="pointer-events-none absolute top-0 left-0"
          />

          <Canvas dimensions={dimensions} brushSize={brushSize} />
        </div>
      )}

      <div className="bg-background fixed bottom-6 flex animate-[slideUp_0.2s_ease-out] items-center justify-center gap-8 rounded-[3rem] border-1 border-foreground/25 p-[0.8rem_2rem]">
        <div className="flex gap-4">
          <Button onClick={exportMask}>Process Image</Button>
          <Button variant="destructive" onClick={() => {}}>
            Clear
          </Button>
        </div>

        <Slider
          className="w-50"
          defaultValue={[brushSize]}
          max={50}
          min={1}
          step={1}
          onValueChange={(value) => setBrushSize(Number(value))}
          disabled={!uploadedImage}
        />
      </div>

      {editedImage && (
        <div className="mt-4">
          <h2>Edited Image:</h2>
          <img src={editedImage} alt="Edited result" />
        </div>
      )}
    </div>
  );
}
