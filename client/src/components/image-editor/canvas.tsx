import React, { useEffect, useRef, useState } from "react";

type Props = {
  dimensions: {
    width: number;
    height: number;
  };
  brushSize: number;
  zoomLevel: number;
  handleProcessImage: (mask: HTMLCanvasElement) => void;
};

export default function ({ dimensions, brushSize, zoomLevel, handleProcessImage }: Props) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // const brushSizeRef = useRef<number>(brushSize);

  useEffect(() => {
    const canvas = canvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    if (!canvas || !drawingCanvas) return;

    const scaledWidth = dimensions.width * zoomLevel;
    const scaledHeight = dimensions.height * zoomLevel;
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    drawingCanvas.width = scaledWidth;
    drawingCanvas.height = scaledHeight;

    if (!canvasCtxRef.current) {
      canvasCtxRef.current = canvas.getContext("2d");
    }

    if (!drawingCtxRef.current) {
      drawingCtxRef.current = drawingCanvas.getContext("2d");
    }

    if (canvasCtxRef.current && drawingCtxRef.current) {
      drawingCtxRef.current.lineCap = "round";
      drawingCtxRef.current.lineJoin = "round";
      drawingCtxRef.current.strokeStyle = "rgba(255, 239, 0, 0.3)";
      drawingCtxRef.current.lineWidth = brushSize * zoomLevel;

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
        0,
        Math.PI * 2,
      );
      canvasCtxRef.current.fillStyle = "rgba(255, 239, 0, 0.3)";
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
    if (!drawingCtxRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) * (dimensions.width / rect.width);
    const y = (e.clientY - rect.top) * (dimensions.height / rect.height);

    drawingCtxRef.current.beginPath();
    drawingCtxRef.current.moveTo(x * zoomLevel, y * zoomLevel);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) * (dimensions.width / rect.width);
    const y = (e.clientY - rect.top) * (dimensions.height / rect.height);

    setCursorPosition({ x: x * zoomLevel, y: y * zoomLevel });

    if (!isDrawing || !drawingCtxRef.current) return;

    drawingCtxRef.current.lineTo(x * zoomLevel, y * zoomLevel);
    drawingCtxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!drawingCtxRef.current) return;
    drawingCtxRef.current.closePath();
    setIsDrawing(false);

    if (!canvasRef.current) return;
    handleProcessImage(canvasRef.current)

    // TODO !!!
    // if (!canvasCtxRef.current || !canvasRef.current) return;
    // canvasCtxRef.current.clearRect(
    //   0,
    //   0,
    //   canvasRef.current.width,
    //   canvasRef.current.height,
    // );
  };

  // const clearCanvas = () => {
  //   if (!drawingCtxRef.current || !canvasRef.current) return;
  //   drawingCtxRef.current.clearRect(
  //     0,
  //     0,
  //     canvasRef.current.width,
  //     canvasRef.current.height,
  //   );
  // };

  return (
    <>
      <canvas
        ref={drawingCanvasRef}
        className="absolute inset-0"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-none"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </>
  );
}
