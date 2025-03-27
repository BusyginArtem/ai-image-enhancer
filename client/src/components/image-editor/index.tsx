"use client";

import { useState, useEffect, useRef } from "react";
import { Image as ImageIcon } from "lucide-react";

import Canvas from "./canvas";
import FileUploader from "./uploader";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_IMAGE_WIDTH = 600;

export default function CanvasEditor() {
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);

  const [brushSize, setBrushSize] = useState(10);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  // console.log(
  //   "%c uploadedImage",
  //   "color: green; font-weight: bold;",
  //   uploadedImage,
  // );
  // console.log(
  //   "%c originalImageFile",
  //   "color: green; font-weight: bold;",
  //   originalImageFile,
  // );
  // console.log(
  //   "%c editedImage",
  //   "color: green; font-weight: bold;",
  //   editedImage,
  // );
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

  const uploadImage = async (fileToUpload: File) => {
    if (!originalImageFile) return null;

    const formData = new FormData();

    // formData.append("file", originalImageFile);
    formData.append("file", fileToUpload);

    try {
      const response = await fetch(`${apiUrl}/upload`, {
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

  const processImage = async (mask: HTMLCanvasElement): Promise<void> => {
    if (!mask) return;

    return new Promise((resolve, reject) => {
      mask.toBlob(async (blob: Blob | null) => {
        if (!blob) return;

        setUploadingImage(true);
        // setEditedImage(null);

        try {
          const formData = new FormData();
          formData.append("mask", blob, "mask.png");

          // const uploadedImagePath = await uploadImage();

          // Determine which image to upload: editedImage or imageFile
          let uploadedImagePath: string | null;

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
            uploadedImagePath = await uploadImage(imageFileFromBlob);
          } else if (originalImageFile) {
            uploadedImagePath = await uploadImage(originalImageFile);
          } else {
            throw new Error("No image available to process");
          }

          if (!uploadedImagePath) return;

          formData.append("image_path", uploadedImagePath);

          const response = await fetch(`${apiUrl}/process`, {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            // const data = await response.json();
            // const fullUrl = `${apiUrl}${data.output_url}`;

            // setEditedImage(fullUrl);
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

  return (
    <section className="relative flex flex-col items-center">
      <div className="absolute top-0 left-4 flex w-full items-center justify-start gap-8">
        <ImageIcon className="cursor-pointer" size={24} />

        {uploadedImage && (
          <p className="border-foreground/25 rounded-[3rem] border-1 p-[0.2rem_0.75rem]">{`${dimensions.width}x${dimensions.height}`}</p>
        )}
      </div>

      <FileUploader onFileUpload={handleFileUpload} />

      {!!dimensions.height && !!dimensions.width && (
        <div
          ref={containerRef}
          style={{
            scale: zoomLevel,
            transformOrigin: "top center",
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
          }}
          className={cn("relative mt-10 flex justify-center select-none", {
            "animate-pulsate": uploadingImage,
          })}
        >
          {uploadedImage && !editedImage ? (
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="pointer-events-none absolute inset-0"
              width={`${dimensions.width}px`}
              height={`${dimensions.height}px`}
            />
          ) : editedImage ? (
            <img
              src={editedImage}
              alt="Uploaded"
              className="pointer-events-none absolute inset-0"
              width={`${dimensions.width}px`}
              height={`${dimensions.height}px`}
            />
          ) : null}

          <Canvas
            dimensions={dimensions}
            brushSize={brushSize}
            zoomLevel={zoomLevel}
            handleProcessImage={processImage}
            disabled={uploadingImage}
          />
        </div>
      )}

      <div className="bg-background border-foreground/25 fixed bottom-6 flex animate-[slideUp_0.2s_ease-out] items-center justify-center gap-12 rounded-[3rem] border-1 p-[0.8rem_2rem]">
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

      {/* {editedImage && (
        <div className="z-20 mt-4">
          <h2>Edited Image:</h2>
          <img src={editedImage} alt="Edited result" />
        </div>
      )} */}
    </section>
  );
}
