import type { MascotMood } from "@/config/invitation";
import type { DeclineStep } from "@/lib/state-machine";

export type ElementSize = {
  width: number;
  height: number;
};

export type DeclineComicStage = "idle" | "ready" | "lunge" | "miss";

export const DODGE_SAFE_POINTS = [
  { x: 0.04, y: 0.08, rotate: -2 },
  { x: 0.52, y: 0.04, rotate: 2 },
  { x: 0.98, y: 0.12, rotate: 3 },
  { x: 0.74, y: 0.42, rotate: -3 },
  { x: 0.22, y: 0.38, rotate: 2 },
  { x: 0.02, y: 0.66, rotate: -2 },
  { x: 0.48, y: 0.72, rotate: 3 },
  { x: 0.96, y: 0.82, rotate: -3 },
  { x: 0.78, y: 0.98, rotate: 2 },
  { x: 0.34, y: 0.94, rotate: -2 },
  { x: 0.08, y: 0.9, rotate: 3 },
  { x: 0.9, y: 0.56, rotate: -2 },
] as const;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const getDodgePosition = (
  step: number,
  arena: ElementSize,
  button: ElementSize,
): { x: number; y: number; rotate: number } => {
  const point = DODGE_SAFE_POINTS[step % DODGE_SAFE_POINTS.length];
  const padding = 8;
  const maxX = Math.max(0, arena.width - button.width);
  const maxY = Math.max(0, arena.height - button.height);
  const startX = Math.min(padding, maxX);
  const startY = Math.min(padding, maxY);
  const endX = Math.max(startX, maxX - padding);
  const endY = Math.max(startY, maxY - padding);

  return {
    x: clamp(startX + (endX - startX) * point.x, 0, maxX),
    y: clamp(startY + (endY - startY) * point.y, 0, maxY),
    rotate: point.rotate,
  };
};

export const getDeclineComicStage = (
  step: DeclineStep,
): DeclineComicStage => {
  if (step === 0) return "idle";
  if (step <= 4) return "ready";
  if (step <= 9) return "lunge";
  return "miss";
};

const mascotMoodByStage: Readonly<Record<DeclineComicStage, MascotMood>> = {
  idle: "serious",
  ready: "hunterReady",
  lunge: "hunterLunge",
  miss: "hunterMiss",
};

export const getDeclineMascotMood = (step: DeclineStep): MascotMood =>
  mascotMoodByStage[getDeclineComicStage(step)];
