import React, { useEffect, useRef, useState } from "react";

type Props = {
  dimensions: {
    width: number;
    height: number;
  };
  brushSize: number;
};

export default function ({ dimensions, brushSize }: Props) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;

    if (!canvas || !drawingCanvas) return;

    const ctx = canvas.getContext("2d");
    const drawingCtx = drawingCanvas.getContext("2d");

    if (ctx && drawingCtx) {
      ctxRef.current = drawingCtx;

      // Drawing context setup
      drawingCtx.lineCap = "round";
      drawingCtx.lineJoin = "round";
      drawingCtx.strokeStyle = "rgba(255, 239, 0, 0.3)";
      drawingCtx.lineWidth = brushSize;

      // Cursor context setup
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }

    // Cleanup animation frame on unmount
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [brushSize]);

  // Cursor animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawCursor = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(
        cursorPosition.x,
        cursorPosition.y,
        brushSize / 2,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = "rgba(255, 239, 0, 0.3)";
      ctx.fill();

      // animationFrameId.current = requestAnimationFrame(drawCursor);
    };

    // Start animation
    animationFrameId.current = requestAnimationFrame(drawCursor);

    // Cleanup
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [cursorPosition, brushSize]);

  const startDrawing = (e: React.MouseEvent) => {
    if (!ctxRef.current) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();

    if (rect) {
      setCursorPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    if (!isDrawing || !ctxRef.current) return;

    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!ctxRef.current) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!ctxRef.current || !canvasRef.current) return;
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );
  };

  return (
    <>
      <canvas
        ref={drawingCanvasRef}
        className="absolute top-0 left-0"
        width={dimensions.width}
        height={dimensions.height}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 cursor-none"
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </>
  );
}
