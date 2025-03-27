import React, { useEffect, useRef, useState } from "react";

type Props = {
  dimensions: {
    width: number;
    height: number;
  };
  brushSize: number;
  zoomLevel: number;
  disabled: boolean;
  handleProcessImage: (mask: HTMLCanvasElement) => Promise<void>;
};

export default function Canvas({
  dimensions,
  brushSize,
  zoomLevel,
  disabled,
  handleProcessImage,
}: Props) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawn, setIsDrawn] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    if (!canvas || !drawingCanvas) return;

    // const scaledWidth = dimensions.width * zoomLevel;
    // const scaledHeight = dimensions.height * zoomLevel;
    // const scaledWidth = dimensions.width;
    // const scaledHeight = dimensions.height;
    // canvas.width = scaledWidth;
    // canvas.height = scaledHeight;
    // drawingCanvas.width = scaledWidth;
    // drawingCanvas.height = scaledHeight;

    canvasCtxRef.current = canvas.getContext("2d");
    drawingCtxRef.current = drawingCanvas.getContext("2d");

    if (canvasCtxRef.current && drawingCtxRef.current) {
      drawingCtxRef.current.lineCap = "round";
      drawingCtxRef.current.lineJoin = "round";
      drawingCtxRef.current.strokeStyle = "rgba(255,239,0,0.3)";
      drawingCtxRef.current.lineWidth = brushSize * zoomLevel;
      // drawingCtxRef.current.lineWidth = brushSize;

      canvasCtxRef.current.lineCap = "round";
      canvasCtxRef.current.lineJoin = "round";
    }

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [brushSize, zoomLevel, dimensions.height, dimensions.width]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // const ctx = canvas.getContext("2d");
    if (!canvasCtxRef.current) return;

    const drawCursor = () => {
      if (!canvasCtxRef.current) return;
      canvasCtxRef.current.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtxRef.current.beginPath();
      canvasCtxRef.current.arc(
        cursorPosition.x,
        cursorPosition.y,
        (brushSize * zoomLevel) / 2,
        // brushSize / 2,
        0,
        Math.PI * 2,
      );
      canvasCtxRef.current.fillStyle = "rgba(255,239,0,0.3)";
      canvasCtxRef.current.fill();

      animationFrameId.current = requestAnimationFrame(drawCursor);
    };

    animationFrameId.current = requestAnimationFrame(drawCursor);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [cursorPosition, brushSize, zoomLevel]);

  const startDrawing = (e: React.MouseEvent) => {
    if (!drawingCtxRef.current || disabled) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) * (dimensions.width / rect.width);
    const y = (e.clientY - rect.top) * (dimensions.height / rect.height);

    drawingCtxRef.current.beginPath();
    // drawingCtxRef.current.moveTo(x * zoomLevel, y * zoomLevel);
    drawingCtxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) * (dimensions.width / rect.width);
    const y = (e.clientY - rect.top) * (dimensions.height / rect.height);

    // setCursorPosition({ x: x * zoomLevel, y: y * zoomLevel });
    setCursorPosition({ x: x, y: y });

    if (!isDrawing || !drawingCtxRef.current) return;

    // drawingCtxRef.current.lineTo(x * zoomLevel, y * zoomLevel);
    drawingCtxRef.current.lineTo(x, y);
    drawingCtxRef.current.stroke();
    setIsDrawn(true);
  };

  const stopDrawing = () => {
    if (!drawingCtxRef.current) return;
    drawingCtxRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!drawingCtxRef.current || !canvasRef.current) return;
    drawingCtxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );
  };

  const sendDrawing = async () => {
    if (!drawingCtxRef.current) return;
    drawingCtxRef.current.closePath();
    setIsDrawing(false);

    if (!drawingCanvasRef.current || disabled || !isDrawn) return;
    try {
      await handleProcessImage(drawingCanvasRef.current);
      setIsDrawn(false);
      clearCanvas();
    } catch (error) {
      console.log("Something went wrong:", error);
    }
  };

  return (
    <>
      <canvas
        ref={drawingCanvasRef}
        className="absolute inset-0 opacity-75"
        style={
          {
            // width: `${dimensions.width}px`,
            // height: `${dimensions.height}px`,
            // scale: zoomLevel,
          }
        }
        width={dimensions.width}
        height={dimensions.height}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-none"
        style={
          {
            // width: `${dimensions.width}px`,
            // height: `${dimensions.height}px`,
            // scale: zoomLevel,
          }
        }
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={sendDrawing}
        width={dimensions.width}
        height={dimensions.height}
      />
    </>
  );
}
