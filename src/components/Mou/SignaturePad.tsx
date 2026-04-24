"use client";

import React, { useRef, useEffect } from "react";

type Props = {
  onEnd?: (dataUrl: string) => void;
  className?: string;
};

export default function SignaturePad({ onEnd, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(ratio, ratio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#111827";
      ctxRef.current = ctx;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const toClientPos = (e: PointerEvent | TouchEvent | MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    if (e instanceof PointerEvent || (e as any).clientX !== undefined) {
      clientX = (e as any).clientX;
      clientY = (e as any).clientY;
    } else if ((e as TouchEvent).touches && (e as TouchEvent).touches[0]) {
      clientX = (e as TouchEvent).touches[0].clientX;
      clientY = (e as TouchEvent).touches[0].clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    drawing.current = true;
    const pos = toClientPos(e.nativeEvent as PointerEvent);
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const pos = toClientPos(e.nativeEvent as PointerEvent);
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current!;
    const dataUrl = canvas.toDataURL("image/png");
    onEnd?.(dataUrl);
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onEnd?.("");
  };

  return (
    <div className={className}>
      <div className="border rounded-md overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-48 touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <button
          type="button"
          onClick={clear}
          className="px-3 py-1 text-sm bg-grey-100 rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
