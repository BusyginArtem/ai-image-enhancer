import React, { useEffect, useRef, useState } from "react";

type Props = {
  dimensions: {
    width: number;
    height: number;
  };
  brushSize: number;
  zoomLevel: number;
  disabled: boolean;
  onProcessImage: (mask: HTMLCanvasElement) => Promise<void>;
};

export default function Canvas({
  dimensions,
  brushSize,
  zoomLevel,
  disabled,
  onProcessImage,
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

    canvasCtxRef.current = canvas.getContext("2d");
    drawingCtxRef.current = drawingCanvas.getContext("2d");

    if (canvasCtxRef.current && drawingCtxRef.current) {
      drawingCtxRef.current.lineCap = "round";
      drawingCtxRef.current.lineJoin = "round";
      drawingCtxRef.current.strokeStyle = "rgba(255,239,0,0.3)";
      // drawingCtxRef.current.lineWidth = brushSize * zoomLevel;
      drawingCtxRef.current.lineWidth = brushSize;

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

    if (!canvas || !canvasCtxRef.current) return;

    const drawCursor = () => {
      if (!canvasCtxRef.current) return;
      canvasCtxRef.current.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtxRef.current.beginPath();
      canvasCtxRef.current.arc(
        cursorPosition.x,
        cursorPosition.y,
        // (brushSize * zoomLevel) / 2,
        brushSize / 2,
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
    drawingCtxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) * (dimensions.width / rect.width);
    const y = (e.clientY - rect.top) * (dimensions.height / rect.height);

    setCursorPosition({ x: x, y: y });

    if (!isDrawing || !drawingCtxRef.current) return;

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
      await onProcessImage(drawingCanvasRef.current);

      clearCanvas();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDrawn(false);
    }
  };

  return (
    <>
      <canvas
        ref={drawingCanvasRef}
        className="absolute inset-0 opacity-75"
        width={dimensions.width}
        height={dimensions.height}
        role="img"
        aria-label="Drawing layer for image editing"
        tabIndex={0}
      >
        This is the drawing layer for image editing.
      </canvas>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={sendDrawing}
        width={dimensions.width}
        height={dimensions.height}
        role="img"
        aria-label="Image editing canvas"
        tabIndex={0}
        aria-describedby="canvas-instructions"
      >
        This is the main image editing canvas.
      </canvas>
      <span id="canvas-instructions" className="sr-only">
        Use your mouse to draw on the canvas. Keyboard drawing is not supported.
      </span>
    </>
  );
}
