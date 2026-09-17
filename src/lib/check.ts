import type { Point } from "@/data/biologia7";

export function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  const prev = new Array(n + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= m; i++) {
    let last = prev[0]!;
    prev[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = prev[j]!;
      prev[j] = Math.min(
        prev[j]! + 1,
        prev[j - 1]! + 1,
        last + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      last = tmp;
    }
  }
  return prev[n]!;
}

/** 0..1 similarity between two texts */
export function similarity(a: string, b: string) {
  const x = normalize(a);
  const y = normalize(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  if (y.includes(x) || x.includes(y)) return 0.9;
  const dist = levenshtein(x, y);
  return Math.max(0, 1 - dist / Math.max(x.length, y.length));
}

export const PASS = 0.7;

export function checkText(input: string, answers: string[]) {
  return Math.max(...answers.map((a) => similarity(input, a)));
}

/** Compare a drawing (normalized 0..1 points) to a target shape. */
export function checkDrawing(
  strokes: Point[][],
  target: Point[][],
  tolerance = 0.14,
): number {
  const drawn = strokes.flat();
  const targetPts = densify(target);
  if (drawn.length < 5 || targetPts.length === 0) return 0;

  const covered = targetPts.filter((t) => near(t, drawn, tolerance)).length / targetPts.length;
  const clean = drawn.filter((d) => near(d, targetPts, tolerance)).length / drawn.length;
  return covered * 0.65 + clean * 0.35;
}

function near(p: Point, pts: Point[], tol: number) {
  for (const q of pts) {
    const dx = p.x - q.x;
    const dy = p.y - q.y;
    if (dx * dx + dy * dy <= tol * tol) return true;
  }
  return false;
}

function densify(shape: Point[][]): Point[] {
  const out: Point[] = [];
  for (const line of shape) {
    for (let i = 0; i < line.length - 1; i++) {
      const a = line[i]!;
      const b = line[i + 1]!;
      const steps = Math.max(1, Math.round(Math.hypot(b.x - a.x, b.y - a.y) / 0.02));
      for (let s = 0; s <= steps; s++) {
        out.push({ x: a.x + ((b.x - a.x) * s) / steps, y: a.y + ((b.y - a.y) * s) / steps });
      }
    }
  }
  return out;
}
