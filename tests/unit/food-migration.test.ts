import test from "node:test";
import assert from "node:assert/strict";

import {
  CURRENT_FOOD_IDS,
  normalizeActivityId,
  normalizeFoodId,
} from "../../src/lib/food-migration";

test("normalizeFoodId 保留所有当前菜单 ID", () => {
  for (const foodId of CURRENT_FOOD_IDS) {
    assert.equal(normalizeFoodId(foodId), foodId);
  }
});

test("normalizeFoodId 将旧菜单 ID 迁移到当前菜单", () => {
  const migrations = {
    pizza: "western",
    "dim-sum": "snacks",
    ramen: "snacks",
    mala: "hunan",
    crayfish: "hunan",
    skewers: "snacks",
  } as const;

  for (const [legacyId, currentId] of Object.entries(migrations)) {
    assert.equal(normalizeFoodId(legacyId), currentId);
  }
});

test("normalizeFoodId 拒绝非字符串和对象原型上的未知键", () => {
  for (const value of [
    null,
    undefined,
    1,
    {},
    "unknown",
    "__proto__",
    "constructor",
    "toString",
  ]) {
    assert.equal(normalizeFoodId(value), null);
  }
});

test("normalizeActivityId 保留历史活动并拒绝未知值", () => {
  for (const activityId of ["dinner", "walk", "exhibit"] as const) {
    assert.equal(normalizeActivityId(activityId), activityId);
  }

  assert.equal(normalizeActivityId("unknown"), null);
});
