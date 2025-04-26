"use client";

import { Download, Eye, Image as ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import clientEnv from "@/env.client";
import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";
import Canvas from "./canvas";
import FileUploader from "./uploader";

const apiUrl = clientEnv.NEXT_PUBLIC_SERVER_API_URL
const DEFAULT_IMAGE_WIDTH = 600;

export default function CanvasEditor() {
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  const [brushSize, setBrushSize] = useState(10);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showOriginalImageFile, setShowOriginalImageFile] = useState(false);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    const zoomStep = 0.1;
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep;

    setZoomLevel((prev) => {
      const newZoom = Math.max(0.25, Math.min(2, prev + delta));
      return newZoom;
    });
  };

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, [uploadedImage, dimensions.height, dimensions.width]);

  const handleFileUpload = (file: File) => {
    setOriginalImageFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;

      setUploadedImage(dataUrl);
      setOriginalImageUrl(dataUrl);
      setEditedImage(null);

      const img = new Image();

      img.onload = () => {
        const imageRatio = DEFAULT_IMAGE_WIDTH / img.naturalWidth;
        setZoomLevel(imageRatio < 1 ? imageRatio : 1);

        setDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  };

  const uploadImage = async (fileToUpload: File): Promise<string | null> => {
    if (!originalImageFile) return null;

    const formData = new FormData();

    formData.append("file", fileToUpload);

    try {
      const response = await fetch(`${apiUrl}/inpaint/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.filename;
      } else {
        console.error("Image upload failed.");
        return null;
      }
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const processImage = async (mask: HTMLCanvasElement): Promise<void> => {
    if (!mask) return;

    return new Promise((resolve, reject) => {
      mask.toBlob(async (blob: Blob | null) => {
        if (!blob) return;

        setUploadingImage(true);

        try {
          const formData = new FormData();
          formData.append("mask", blob, "mask.png");

          let uploadedImageName: string | null;

          if (editedImage && originalImageFile) {
            const response = await fetch(editedImage);
            const imageBlob = await response.blob();
            const imageFileFromBlob = new File(
              [imageBlob],
              originalImageFile?.name,
              {
                type: "image/png",
                lastModified: Date.now(),
              },
            );
            uploadedImageName = await uploadImage(imageFileFromBlob);
          } else if (originalImageFile) {
            uploadedImageName = await uploadImage(originalImageFile);
          } else {
            throw new Error("No image available to process");
          }

          if (!uploadedImageName) return;

          formData.append("image_unique_name", uploadedImageName);

          const response = await fetch(`${apiUrl}/inpaint/process`, {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setEditedImage(imageUrl);

            return resolve();
          } else {
            console.error("Image processing failed.");

            return reject();
          }
        } catch (error) {
          console.error("Processing failed:", error);
          return reject();
        } finally {
          setUploadingImage(false);
        }
      }, "image/png");
    });
  };

  const downloadImage = async () => {
    if (!editedImage) {
      console.error("No edited image available to download");
      return;
    }

    try {
      const response = await fetch(editedImage);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = originalImageFile?.name || "edited_image.png";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleEyePress = () => {
    setShowOriginalImageFile(true);
  };

  const handleEyeRelease = () => {
    setShowOriginalImageFile(false);
  };

  return (
    <section className="relative flex flex-col items-center">
      <div className="absolute top-0 left-4 flex w-full items-center justify-start gap-8">
        <FileUploader
          onFileUpload={handleFileUpload}
          className="h-6 w-6"
          loadArea={
            <ImageIcon size={24} cursor="pointer" />
          }
        />

        {uploadedImage && (
          <p className="border-foreground/25 rounded-[3rem] border-1 p-[0.2rem_0.75rem]">{`${dimensions.width}x${dimensions.height}`}</p>
        )}
      </div>

      {!uploadedImage && (
        <FileUploader
          onFileUpload={handleFileUpload}
          className="my-40 h-32 w-128"
          loadArea={
            <div className="border-foreground/30 flex h-full w-full items-center justify-center rounded-lg border-2 border-dotted hover:bg-amber-300/75">
              <p>Tap here to load your picture</p>
            </div>
          }
        />
      )}

      {!!dimensions.height && !!dimensions.width && (
        <div
          ref={containerRef}
          style={{
            scale: zoomLevel,
            transformOrigin: "top center",
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
          }}
          className={cn("relative mt-12 flex justify-center select-none", {
            "animate-pulsate": uploadingImage,
          })}
        >
          {uploadedImage && !editedImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="pointer-events-none absolute inset-0"
              width={`${dimensions.width}px`}
              height={`${dimensions.height}px`}
            />
          )}

          {editedImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={editedImage}
              alt="Edited"
              className="pointer-events-none absolute inset-0"
              width={`${dimensions.width}px`}
              height={`${dimensions.height}px`}
            />
          )}

          {originalImageUrl && showOriginalImageFile && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={originalImageUrl}
              alt="Original"
              className="pointer-events-none absolute inset-0 z-[2]"
              width={`${dimensions.width}px`}
              height={`${dimensions.height}px`}
            />
          )}

          <div className="relative w-full overflow-hidden">
            <div
              className={cn(
                "absolute z-[3] ml-[-2%] h-full w-1.5 bg-[var(--yellow-accent)] transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]",
                showOriginalImageFile ? "ml-[calc(100%_-_4px)]" : "ml-[-2%]",
              )}
            />
          </div>

          <Canvas
            dimensions={dimensions}
            brushSize={brushSize}
            zoomLevel={zoomLevel}
            handleProcessImage={processImage}
            disabled={uploadingImage}
          />
        </div>
      )}

      <div className="bg-background border-foreground/25 fixed bottom-6 flex animate-[slideUp_0.2s_ease-out] items-center justify-center gap-8 rounded-[3rem] border-1 p-[0.8rem_2rem]">
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

        <div className="flex items-center gap-4">
          <Download
            className={cn("cursor-pointer", {
              "cursor-default text-gray-500": !editedImage,
            })}
            size={24}
            onClick={downloadImage}
          />

          <Eye
            className={cn("cursor-pointer", {
              "cursor-default text-gray-500": !editedImage,
            })}
            size={24}
            onMouseDown={handleEyePress}
            onMouseUp={handleEyeRelease}
            onMouseLeave={handleEyeRelease}
          />
        </div>
      </div>
    </section>
  );
}
