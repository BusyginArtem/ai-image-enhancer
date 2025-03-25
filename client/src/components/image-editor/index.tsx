"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

import Canvas from "./canvas";
import FileUploader from "./uploader";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";

export default function CanvasEditor() {
  const [brushSize, setBrushSize] = useState(10);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
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

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    const zoomStep = 0.1;
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep;

    setZoomLevel((prev) => {
      const newZoom = Math.max(0.25, Math.min(2, prev + delta));
      return newZoom;
    });
  };

  return (
    <section className="relative flex flex-col items-center">
      <div className="absolute top-0 left-4 flex w-full items-center justify-start gap-8">
        <ImageIcon className="cursor-pointer" size={24} />

        {uploadedImage && (
          <p className="border-foreground/25 rounded-[3rem] border-1 p-[0.2rem_0.75rem]">{`${dimensions.width}x${dimensions.height}`}</p>
        )}
      </div>

      <FileUploader onFileUpload={handleFileUpload} />

      {uploadedImage && dimensions.height && dimensions.width && (
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center",
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
          }}
          className="relative flex justify-center select-none"
          onWheel={handleWheel}
        >
          <img
            src={uploadedImage}
            alt="Uploaded"
            className="pointer-events-none absolute inset-0"
          />

          <Canvas dimensions={dimensions} brushSize={brushSize} />
        </div>
      )}

      <div className="bg-background border-foreground/25 fixed bottom-6 flex animate-[slideUp_0.2s_ease-out] items-center justify-center gap-12 rounded-[3rem] border-1 p-[0.8rem_2rem]">
        <div className="flex gap-4">
          <Button onClick={exportMask}>Process Image</Button>
          <Button variant="destructive" onClick={() => {}}>
            Clear
          </Button>
        </div>

        <p className="flex flex-row items-center justify-center gap-4">
          <label htmlFor="brush-size" className="text-lg">
            Brush
          </label>
          <Slider
            id="brush-size"
            className="w-50"
            defaultValue={[brushSize]}
            max={50}
            min={1}
            step={1}
            onValueChange={(value) => setBrushSize(Number(value))}
            disabled={!uploadedImage}
          />
        </p>
      </div>

      {editedImage && (
        <div className="mt-4">
          <h2>Edited Image:</h2>
          <img src={editedImage} alt="Edited result" />
        </div>
      )}
    </section>
  );
}
