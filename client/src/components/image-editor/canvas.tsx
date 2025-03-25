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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;
    console.log("%c canvas", "color: green; font-weight: bold;", canvas);
    const ctx = canvas.getContext("2d");
    console.log("%c ctx", "color: green; font-weight: bold;", ctx);
    if (ctx) {
      ctxRef.current = ctx;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(255,239,0,0.5)";
      ctx.lineWidth = brushSize;
    }
  }, [brushSize]);

  const startDrawing = (e: React.MouseEvent) => {
    if (!ctxRef.current) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
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
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <canvas
      ref={canvasRef}
      className='absolute top-0 left-0'
      width={dimensions.width}
      height={dimensions.height}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
}
