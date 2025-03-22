"use client";
import { useRef, useState, useEffect } from "react";

export default function CanvasEditor({
  imageUrl,
  onMaskDrawn,
}: {
  imageUrl: string;
  onMaskDrawn: (mask: Blob) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(10);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctxRef.current = ctx;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "black"; // Mask will be black
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

  const exportMask = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        onMaskDrawn(blob);
      }
    }, "image/png");
  };

  return (
    <div className='relative flex flex-col items-center space-y-4'>
      <div className='relative'>
        <img src={imageUrl} alt='Editable' className='absolute top-0 left-0 pointer-events-none' />
        <canvas
          ref={canvasRef}
          className='absolute top-0 left-0'
          width={500} // Adjust to match image size
          height={500}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      <div className='flex space-x-4'>
        <button className='px-4 py-2 bg-red-500 text-white rounded' onClick={clearCanvas}>
          Clear
        </button>
        <button className='px-4 py-2 bg-blue-500 text-white rounded' onClick={exportMask}>
          Process Image
        </button>
        <input type='range' min='5' max='50' value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} />
      </div>
    </div>
  );
}
