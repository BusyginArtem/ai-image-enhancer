"use client";

import { Image as ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import clientEnv from "@/env.client";
import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";
import Canvas from "./canvas";
import Controls from "./controls";
import FileUploader from "./uploader";

const apiUrl = clientEnv.NEXT_PUBLIC_SERVER_API_URL;
const DEFAULT_IMAGE_WIDTH = 600;

export default function CanvasEditor() {
  const [editedImages, setEditedImages] = useState<string[]>([]);
  const [editedImageIndex, setEditedImageIndex] = useState(-1);
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
  const [uploadButtonLabel, setUploadButtonLabel] = useState("Upload image");

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
  }, [originalImageUrl, dimensions.height, dimensions.width]);

  const handleFileUpload = (file: File) => {
    setOriginalImageFile(file);
    setUploadButtonLabel(`Uploaded: ${file.name}`);

    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;

      setOriginalImageUrl(dataUrl);
      setEditedImages([]);
      setEditedImageIndex(-1);

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

          if (editedImages[editedImageIndex] && originalImageFile) {
            const response = await fetch(editedImages[editedImageIndex]);
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

            setEditedImages((prev) => [...prev, imageUrl]);
            setEditedImageIndex((prev) => prev + 1);

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
    if (!editedImages.length) {
      console.error("No edited image available to download");
      return;
    }

    try {
      const response = await fetch(editedImages[editedImageIndex]);
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

  const handleShowPrevEditedImage = () => {
    if (editedImages.length === 0) return;

    setEditedImageIndex((prev) => {
      if (prev === 0) return 0;
      return prev - 1;
    });
  };

  const handleShowNextEditedImage = () => {
    if (editedImages.length === 0) return;

    setEditedImageIndex((prev) => {
      if (prev === editedImages.length - 1) return prev;
      return prev + 1;
    });
  };

  return (
    <section className="relative flex flex-col items-center">
      <div className="flex items-center justify-start gap-8 self-start">
        <FileUploader
          onFileUpload={handleFileUpload}
          className="border-foreground/30 z-[1] flex h-8 w-8 cursor-pointer flex-wrap place-content-center rounded-sm border-1 hover:bg-amber-300/75"
          loadArea={
            <span role="button" aria-label={uploadButtonLabel} tabIndex={0}>
              <ImageIcon size={24} aria-hidden="true" />
            </span>
          }
        />

        {originalImageUrl && (
          <p className="border-foreground/25 rounded-[3rem] border-1 p-[0.2rem_0.75rem]">{`${dimensions.width}x${dimensions.height}`}</p>
        )}
      </div>

      {!originalImageUrl && (
        <FileUploader
          onFileUpload={handleFileUpload}
          className="my-40 h-32 w-128 cursor-pointer rounded-lg hover:bg-amber-300/75"
          loadArea={
            <div className="border-foreground/30 flex h-full w-full items-center justify-center rounded-md border-2 border-dotted">
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
          {originalImageUrl && !editedImages.length && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={originalImageUrl}
              alt="Original uploaded image"
              className="pointer-events-none absolute inset-0"
              width={`${dimensions.width}px`}
              height={`${dimensions.height}px`}
            />
          )}

          {editedImages[editedImageIndex] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={editedImages[editedImageIndex]}
              alt={`Edited image ${editedImageIndex + 1} of ${editedImages.length}`}
              className="pointer-events-none absolute inset-0"
              width={`${dimensions.width}px`}
              height={`${dimensions.height}px`}
            />
          )}

          {originalImageUrl && showOriginalImageFile && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={originalImageUrl}
              alt="Original image (comparison view)"
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
              aria-hidden="true"
            />
          </div>

          <Canvas
            dimensions={dimensions}
            brushSize={brushSize}
            zoomLevel={zoomLevel}
            onProcessImage={processImage}
            disabled={uploadingImage}
            aria-label="Image editing canvas"
          />
        </div>
      )}

      <Controls
        before={
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
              disabled={!originalImageUrl}
              aria-label="Brush size"
              aria-valuemin={1}
              aria-valuemax={50}
              aria-valuenow={brushSize}
            />
          </p>
        }
        editedImagesCount={editedImages.length}
        editedImageIndex={editedImageIndex}
        onShowOriginalImageFile={setShowOriginalImageFile}
        onDownloadEditedImage={downloadImage}
        onUndoAction={handleShowPrevEditedImage}
        onRedoAction={handleShowNextEditedImage}
      />
    </section>
  );
}
