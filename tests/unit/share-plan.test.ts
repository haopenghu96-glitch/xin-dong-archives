import test from "node:test";
import assert from "node:assert/strict";

const encodePlan = (value: unknown) => Buffer.from(JSON.stringify(value), "utf8").toString("base64url");

const loadSharePlan = async () => {
  const sharePlan = await import("../../src/lib/share-plan").catch(() => undefined);
  assert.ok(sharePlan, "share-plan module must exist");

  return sharePlan;
};

test("分享链接可完整往返当前 hotpot 活动", async () => {
  const sharePlan = await loadSharePlan();

  const url = sharePlan.createSharePlanUrl("https://date.example", {
    date: "2026-08-08",
    time: "19:00",
    activityId: "hotpot",
  });
  const encodedPlan = new URL(url).searchParams.get("plan");

  assert.equal(url.startsWith("https://date.example/?plan="), true);
  assert.deepEqual(sharePlan.parseSharePlan(encodedPlan), {
    date: "2026-08-08",
    time: "19:00",
    activityId: "hotpot",
  });
});

test("分享链接可完整往返当前 coffee 活动", async () => {
  const sharePlan = await loadSharePlan();

  const url = sharePlan.createSharePlanUrl("https://date.example", {
    date: "2026-08-08",
    time: "19:00",
    activityId: "coffee",
  });
  const encodedPlan = new URL(url).searchParams.get("plan");

  assert.equal(url.startsWith("https://date.example/?plan="), true);
  assert.deepEqual(sharePlan.parseSharePlan(encodedPlan), {
    date: "2026-08-08",
    time: "19:00",
    activityId: "coffee",
  });
});

test("旧菜单分享链接解析为当前菜单 id", async () => {
  const sharePlan = await loadSharePlan();
  const migrations = {
    pizza: "western",
    "dim-sum": "snacks",
    ramen: "snacks",
    mala: "hunan",
    crayfish: "hunan",
    skewers: "snacks",
  } as const;

  for (const [legacyId, currentId] of Object.entries(migrations)) {
    const encodedPlan = encodePlan({
      date: "2026-08-08",
      time: "19:00",
      activityId: legacyId,
    });

    assert.equal(
      sharePlan.parseSharePlan(encodedPlan)?.activityId,
      currentId,
    );
  }
});

test("历史 dinner、walk、exhibit 分享链接继续可读", async () => {
  const sharePlan = await loadSharePlan();

  for (const activityId of ["dinner", "walk", "exhibit"] as const) {
    const plan = {
      date: "2026-08-08",
      time: "19:00",
      activityId,
    };

    assert.deepEqual(sharePlan.parseSharePlan(encodePlan(plan)), plan);
  }
});

test("parseSharePlan 拒绝 null 和非法 base64", async () => {
  const sharePlan = await loadSharePlan();

  assert.equal(sharePlan.parseSharePlan(null), null);
  assert.equal(sharePlan.parseSharePlan("%%%not-base64%%%"), null);
});

test("parseSharePlan 拒绝任一空字段", async () => {
  const sharePlan = await loadSharePlan();
  const validPlan = { date: "2026-08-08", time: "19:00", activityId: "hotpot" };

  for (const field of ["date", "time", "activityId"] as const) {
    assert.equal(
      sharePlan.parseSharePlan(encodePlan({ ...validPlan, [field]: "" })),
      null,
      `${field} 为空时应拒绝`,
    );
  }
});

test("parseSharePlan 拒绝超长字段和超过 1024 字符的编码参数", async () => {
  const sharePlan = await loadSharePlan();

  assert.equal(
    sharePlan.parseSharePlan(encodePlan({ date: "2026-08-080", time: "19:00", activityId: "hotpot" })),
    null,
  );
  assert.equal(
    sharePlan.parseSharePlan(encodePlan({ date: "2026-08-08", time: "19:000", activityId: "hotpot" })),
    null,
  );
  assert.equal(
    sharePlan.parseSharePlan(
      encodePlan({ date: "2026-08-08", time: "19:00", activityId: "a".repeat(33) }),
    ),
    null,
  );
  assert.equal(sharePlan.parseSharePlan("A".repeat(1025)), null);
});

test("parseSharePlan 只接受当前和 legacy 活动白名单", async () => {
  const sharePlan = await loadSharePlan();

  assert.equal(
    sharePlan.parseSharePlan(
      encodePlan({ date: "2026-08-08", time: "19:00", activityId: "not-an-activity" }),
    ),
    null,
  );
});

test("parseSharePlan 接受合法历史日期并拒绝错误格式或不存在的日期", async () => {
  const sharePlan = await loadSharePlan();
  const historicalPlan = { date: "2020-02-29", time: "15:00", activityId: "dinner" };

  assert.deepEqual(sharePlan.parseSharePlan(encodePlan(historicalPlan)), historicalPlan);
  assert.equal(
    sharePlan.parseSharePlan(
      encodePlan({ date: "2026-2-08", time: "19:00", activityId: "hotpot" }),
    ),
    null,
  );
  assert.equal(
    sharePlan.parseSharePlan(
      encodePlan({ date: "2025-02-29", time: "19:00", activityId: "hotpot" }),
    ),
    null,
  );
  assert.equal(
    sharePlan.parseSharePlan(
      encodePlan({ date: "2026-04-31", time: "19:00", activityId: "hotpot" }),
    ),
    null,
  );
});

test("parseSharePlan 只接受 invitationConfig.timeOptions 中的时间", async () => {
  const sharePlan = await loadSharePlan();

  assert.equal(
    sharePlan.parseSharePlan(
      encodePlan({ date: "2026-08-08", time: "18:00", activityId: "hotpot" }),
    ),
    null,
  );
});
