"use client";

import { Download, Eye, Redo2 as Redo, Undo2 as Undo } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  editedImagesCount: number;
  editedImageIndex: number;
  before?: React.ReactNode;
  after?: React.ReactNode;
  onShowOriginalImageFile: (showOriginalImage: boolean) => void;
  onDownloadEditedImage: () => void;
  onUndoAction: () => void;
  onRedoAction: () => void;
};

function IconContainer({
  disabled,
  children,
}: {
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("flex h-8 w-8 flex-wrap place-content-center rounded-sm", {
        "cursor-pointer hover:bg-amber-300/75": !disabled,
      })}
    >
      {children}
    </div>
  );
}

export default function Controls({
  before,
  after,
  editedImagesCount,
  editedImageIndex,
  onUndoAction,
  onRedoAction,
  onDownloadEditedImage,
  onShowOriginalImageFile,
}: Props) {
  const handleEyePress = () => {
    onShowOriginalImageFile(true);
  };

  const handleEyeRelease = () => {
    onShowOriginalImageFile(false);
  };

  const undoDisabled = !editedImagesCount || editedImageIndex === 0;
  const redoDisabled =
    !editedImagesCount || editedImageIndex === editedImagesCount - 1;
  const downloadDisabled = !editedImagesCount;
  const eyeDisabled = !editedImagesCount;

  return (
    <div className="bg-background border-foreground/25 fixed bottom-6 flex animate-[slideUp_0.2s_ease-out] items-center justify-center gap-8 rounded-[3rem] border-1 p-[0.8rem_2rem]">
      {before}

      <div className="flex items-center gap-4">
        <IconContainer disabled={undoDisabled}>
          <Undo
            className={cn("", {
              "cursor-default text-gray-500": undoDisabled,
            })}
            onClick={onUndoAction}
          />
        </IconContainer>
        <IconContainer disabled={redoDisabled}>
          <Redo
            className={cn("", {
              "cursor-default text-gray-500": redoDisabled,
            })}
            onClick={onRedoAction}
          />
        </IconContainer>
        <IconContainer disabled={downloadDisabled}>
          <Download
            className={cn("", {
              "cursor-default text-gray-500": downloadDisabled,
            })}
            size={24}
            onClick={onDownloadEditedImage}
          />
        </IconContainer>
        <IconContainer disabled={eyeDisabled}>
          <Eye
            className={cn("", {
              "cursor-default text-gray-500": eyeDisabled,
            })}
            size={24}
            onMouseDown={handleEyePress}
            onMouseUp={handleEyeRelease}
            onMouseLeave={handleEyeRelease}
          />
        </IconContainer>
      </div>

      {after}
    </div>
  );
}
