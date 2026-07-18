import test from "node:test";
import assert from "node:assert/strict";

import {
  DODGE_SAFE_POINTS,
  getDeclineComicStage,
  getDeclineMascotMood,
  getDodgePosition,
} from "../../src/lib/decline-dodge";

const expectedSafePoints = [
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

test("逃跑区域恰好提供 12 个归一化且互不重复的安全锚点", () => {
  assert.deepEqual(DODGE_SAFE_POINTS, expectedSafePoints);
  assert.equal(DODGE_SAFE_POINTS.length, 12);

  const uniquePoints = new Set(
    DODGE_SAFE_POINTS.map((point) => `${point.x}:${point.y}`),
  );
  assert.equal(uniquePoints.size, 12);

  for (const point of DODGE_SAFE_POINTS) {
    assert.ok(point.x >= 0 && point.x <= 1);
    assert.ok(point.y >= 0 && point.y <= 1);
  }
});

test("拒绝步骤映射到 idle、ready、lunge、miss 三段漫画与对应角色", () => {
  assert.equal(getDeclineComicStage(0), "idle");
  assert.equal(getDeclineMascotMood(0), "serious");

  for (const step of [1, 2, 3, 4] as const) {
    assert.equal(getDeclineComicStage(step), "ready");
    assert.equal(getDeclineMascotMood(step), "hunterReady");
  }

  for (const step of [5, 6, 7, 8, 9] as const) {
    assert.equal(getDeclineComicStage(step), "lunge");
    assert.equal(getDeclineMascotMood(step), "hunterLunge");
  }

  for (const step of [10, 11, 12, 13, 14, 15] as const) {
    assert.equal(getDeclineComicStage(step), "miss");
    assert.equal(getDeclineMascotMood(step), "hunterMiss");
  }
});

test("前 12 步在标准逃跑区域内得到 12 个四舍五入后仍唯一的位置", () => {
  const arena = { width: 328, height: 248 };
  const button = { width: 168, height: 58 };
  const positions = Array.from({ length: 12 }, (_, step) =>
    getDodgePosition(step, arena, button),
  );
  const uniqueRoundedPositions = new Set(
    positions.map(({ x, y }) => `${Math.round(x)}:${Math.round(y)}`),
  );

  assert.deepEqual(
    positions.map(({ x, y, rotate }) => ({
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      rotate,
    })),
    [
      { x: 13.76, y: 21.92, rotate: -2 },
      { x: 82.88, y: 14.96, rotate: 2 },
      { x: 149.12, y: 28.88, rotate: 3 },
      { x: 114.56, y: 81.08, rotate: -3 },
      { x: 39.68, y: 74.12, rotate: 2 },
      { x: 10.88, y: 122.84, rotate: -2 },
      { x: 77.12, y: 133.28, rotate: 3 },
      { x: 146.24, y: 150.68, rotate: -3 },
      { x: 120.32, y: 178.52, rotate: 2 },
      { x: 56.96, y: 171.56, rotate: -2 },
      { x: 19.52, y: 164.6, rotate: 3 },
      { x: 137.6, y: 105.44, rotate: -2 },
    ],
  );

  assert.equal(uniqueRoundedPositions.size, 12);
  for (const position of positions) {
    assert.ok(position.x >= 0);
    assert.ok(position.y >= 0);
    assert.ok(position.x + button.width <= arena.width);
    assert.ok(position.y + button.height <= arena.height);
  }
});

test("第 12 步循环复用第 0 步锚点", () => {
  const arena = { width: 328, height: 248 };
  const button = { width: 168, height: 58 };

  assert.deepEqual(
    getDodgePosition(12, arena, button),
    getDodgePosition(0, arena, button),
  );
});

test("逃跑区域小于按钮时位置归零避免几何越界", () => {
  const position = getDodgePosition(
    0,
    { width: 100, height: 40 },
    { width: 168, height: 58 },
  );

  assert.equal(position.x, 0);
  assert.equal(position.y, 0);
});
