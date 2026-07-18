import test from "node:test";
import assert from "node:assert/strict";

import {
  getBrowserStorage,
  INVITATION_STORAGE_KEY,
  parseInvitationState,
  persistInvitationState,
  restoreInvitationState,
} from "../../src/lib/invitation-progress-storage";
import {
  createInitialState,
  type InvitationState,
} from "../../src/lib/state-machine";

const validState: InvitationState = {
  phase: "FOOD",
  declineStep: 3,
  date: "2099-08-08",
  time: "19:00",
  note: "靠窗的位置",
  foodId: "hotpot",
};

test("localStorage getter 抛错时返回 null", () => {
  const target = Object.defineProperty({}, "localStorage", {
    get() {
      throw new Error("storage access denied");
    },
  });

  assert.equal(getBrowserStorage(target), null);
});

test("合法完整的 InvitationState JSON 可以恢复", () => {
  let requestedKey: string | undefined;
  const storage = {
    getItem(key: string) {
      requestedKey = key;
      return JSON.stringify(validState);
    },
    removeItem() {},
    setItem() {},
  };

  assert.deepEqual(restoreInvitationState(storage), validState);
  assert.equal(requestedKey, INVITATION_STORAGE_KEY);
});

test("null 会回退到初始状态", () => {
  const storage = {
    getItem() {
      return null;
    },
    removeItem() {
      assert.fail("没有持久化数据时不应清理存储");
    },
    setItem() {},
  };

  assert.deepEqual(restoreInvitationState(storage), createInitialState());
});

test("storage 不可用时恢复会回退到初始状态", () => {
  assert.deepEqual(restoreInvitationState(null), createInitialState());
});

test("非法 JSON 会回退到初始状态并清理存储", () => {
  let removedKey: string | undefined;
  const storage = {
    getItem() {
      return "{";
    },
    removeItem(key: string) {
      removedKey = key;
    },
    setItem() {},
  };

  assert.deepEqual(restoreInvitationState(storage), createInitialState());
  assert.equal(removedKey, INVITATION_STORAGE_KEY);
});

test("缺少字段的数据会回退到初始状态", () => {
  assert.deepEqual(
    parseInvitationState(JSON.stringify({ ...validState, note: undefined })),
    createInitialState(),
  );
});

test("非法 phase 会回退到初始状态", () => {
  assert.deepEqual(
    parseInvitationState(JSON.stringify({ ...validState, phase: "UNKNOWN" })),
    createInitialState(),
  );
});

test("declineStep 会原样恢复 0 到 15 的整数", () => {
  for (const declineStep of Array.from({ length: 16 }, (_, step) => step)) {
    assert.deepEqual(
      parseInvitationState(JSON.stringify({ ...validState, declineStep })),
      { ...validState, declineStep },
    );
  }
});

test("异常 declineStep 只归零并保留其余合法计划", () => {
  for (const declineStep of [-1, 16, 1.5, "5", null]) {
    assert.deepEqual(
      parseInvitationState(JSON.stringify({ ...validState, declineStep })),
      { ...validState, declineStep: 0 },
    );
  }
});

test("date、time 或 note 不是字符串时会回退到初始状态", () => {
  for (const state of [
    { ...validState, date: null },
    { ...validState, time: 19 },
    { ...validState, note: false },
  ]) {
    assert.deepEqual(
      parseInvitationState(JSON.stringify(state)),
      createInitialState(),
    );
  }
});

test("FOOD、REVIEW、SUBMITTING 中过去或非法日期与未知时间会回退到初始状态", () => {
  const invalidSchedules = [
    { date: "2000-01-01", time: "19:00" },
    { date: "2099-02-30", time: "19:00" },
    { date: "2099-08-08", time: "18:00" },
  ];

  for (const phase of ["FOOD", "REVIEW", "SUBMITTING"] as const) {
    for (const schedule of invalidSchedules) {
      assert.deepEqual(
        parseInvitationState(
          JSON.stringify({ ...validState, phase, ...schedule }),
        ),
        createInitialState(),
      );
    }
  }
});

test("SCHEDULE 可恢复非法日程数据并交给状态机禁用下一步", () => {
  const scheduleState: InvitationState = {
    ...validState,
    phase: "SCHEDULE",
    date: "2099-02-30",
    time: "18:00",
  };

  assert.deepEqual(
    parseInvitationState(JSON.stringify(scheduleState)),
    scheduleState,
  );
});

test("SUCCESS 保留已经成为历史的约会计划", () => {
  const historicalSuccessState: InvitationState = {
    ...validState,
    phase: "SUCCESS",
    date: "2000-01-01",
  };

  assert.deepEqual(
    parseInvitationState(JSON.stringify(historicalSuccessState)),
    historicalSuccessState,
  );
});

test("刷新恢复 SUBMITTING 时回退到 FOOD 并保留已选计划", () => {
  const submittingState: InvitationState = {
    ...validState,
    phase: "SUBMITTING",
  };
  const storage = {
    getItem() {
      return JSON.stringify(submittingState);
    },
    removeItem() {},
    setItem() {},
  };

  assert.deepEqual(restoreInvitationState(storage), {
    ...submittingState,
    phase: "FOOD",
  });
});

test("foodId 接受 null 或当前合法 FoodId", () => {
  assert.deepEqual(
    parseInvitationState(JSON.stringify({ ...validState, foodId: null })),
    { ...validState, foodId: null },
  );
  assert.deepEqual(
    parseInvitationState(JSON.stringify({ ...validState, foodId: "coffee" })),
    { ...validState, foodId: "coffee" },
  );
});

test("旧食物 id 在恢复时迁移，未知 foodId 仍回退", () => {
  assert.deepEqual(
    parseInvitationState(JSON.stringify({ ...validState, foodId: "pizza" })),
    { ...validState, foodId: "western" },
  );
  assert.deepEqual(
    parseInvitationState(JSON.stringify({ ...validState, foodId: "unknown" })),
    createInitialState(),
  );
});

test("getItem 抛错时不向外抛并回退到初始状态", () => {
  const storage = {
    getItem(): string | null {
      throw new Error("storage unavailable");
    },
    removeItem() {},
    setItem() {},
  };
  let restored: InvitationState | undefined;

  assert.doesNotThrow(() => {
    restored = restoreInvitationState(storage);
  });
  assert.deepEqual(restored, createInitialState());
});

test("非法数据清理失败时仍回退到初始状态", () => {
  let removeAttempted = false;
  const storage = {
    getItem() {
      return JSON.stringify({ ...validState, phase: "UNKNOWN" });
    },
    removeItem(): void {
      removeAttempted = true;
      throw new Error("remove denied");
    },
    setItem() {},
  };
  let restored: InvitationState | undefined;

  assert.doesNotThrow(() => {
    restored = restoreInvitationState(storage);
  });
  assert.deepEqual(restored, createInitialState());
  assert.equal(removeAttempted, true);
});

test("persist 使用固定 key 写入完整状态", () => {
  let savedKey: string | undefined;
  let savedValue: string | undefined;
  const storage = {
    getItem() {
      return null;
    },
    removeItem() {},
    setItem(key: string, value: string) {
      savedKey = key;
      savedValue = value;
    },
  };

  persistInvitationState(storage, validState);

  assert.equal(savedKey, INVITATION_STORAGE_KEY);
  assert.deepEqual(JSON.parse(savedValue ?? "null"), validState);
});

test("persist 时 setItem 抛错不会向外抛", () => {
  const storage = {
    getItem() {
      return null;
    },
    removeItem() {},
    setItem(): void {
      throw new Error("quota exceeded");
    },
  };

  assert.doesNotThrow(() => persistInvitationState(storage, validState));
});

test("storage 不可用时 persist 不会向外抛", () => {
  assert.doesNotThrow(() => persistInvitationState(null, validState));
});
