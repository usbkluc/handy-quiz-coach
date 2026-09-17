import { useEffect, useRef, useState } from "react";
import type { Point } from "@/data/biologia7";

type Props = {
  strokes: Point[][];
  onChange: (s: Point[][]) => void;
  showTarget?: Point[][] | null;
  disabled?: boolean;
};

const SIZE = 320;

export function DrawPad({ strokes, onChange, showTarget, disabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, SIZE, SIZE);

    if (showTarget) {
      ctx.strokeStyle = "oklch(0.72 0.14 150)";
      ctx.lineWidth = 6;
      ctx.setLineDash([8, 8]);
      for (const line of showTarget) drawLine(ctx, line);
      ctx.setLineDash([]);
    }

    ctx.strokeStyle = "oklch(0.32 0.05 160)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const line of strokes) drawLine(ctx, line);
  }, [strokes, showTarget]);

  const pos = (e: React.PointerEvent): Point => {
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  };

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        className="w-full max-w-[320px] touch-none rounded-xl border border-border bg-card"
        onPointerDown={(e) => {
          if (disabled) return;
          (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
          setDrawing(true);
          onChange([...strokes, [pos(e)]]);
        }}
        onPointerMove={(e) => {
          if (!drawing || disabled) return;
          const next = strokes.slice();
          const last = next[next.length - 1];
          if (!last) return;
          next[next.length - 1] = [...last, pos(e)];
          onChange(next);
        }}
        onPointerUp={() => setDrawing(false)}
        onPointerLeave={() => setDrawing(false)}
      />
      {!disabled && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent"
        >
          Vymazať kresbu
        </button>
      )}
    </div>
  );
}

function drawLine(ctx: CanvasRenderingContext2D, line: Point[]) {
  if (line.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(line[0]!.x * SIZE, line[0]!.y * SIZE);
  for (const p of line.slice(1)) ctx.lineTo(p.x * SIZE, p.y * SIZE);
  ctx.stroke();
}
