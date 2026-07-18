import test from "node:test";
import assert from "node:assert/strict";

import {
  createInitialState,
  isScheduleComplete,
  transition,
} from "../../src/lib/state-machine";

const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

test("批准申请后先二次确认，确认后才进入日程", () => {
  let state = createInitialState();
  state = transition(state, { type: "APPROVE" });
  assert.equal(state.phase, "SECOND_CONFIRM");

  state = transition(state, { type: "CONFIRM_APPROVAL" });
  assert.equal(state.phase, "SCHEDULE");
});

test("选定约会方式后直接生成确认卡，不再增加复核页", () => {
  let state = createInitialState();
  state = transition(state, { type: "APPROVE" });
  state = transition(state, { type: "CONFIRM_APPROVAL" });
  state = transition(state, { type: "SET_DATE", date: toLocalDateString(new Date()) });
  state = transition(state, { type: "SET_TIME", time: "19:00" });
  assert.equal(isScheduleComplete(state), true);
  state = transition(state, { type: "CONTINUE_TO_FOOD" });
  state = transition(state, { type: "SELECT_FOOD", foodId: "hotpot" });
  state = transition(state, { type: "SUBMIT" });

  assert.equal(state.phase, "SUBMITTING");

  state = transition(state, { type: "SUBMIT_COMPLETE" });
  assert.equal(state.phase, "SUCCESS");
});

test("容我想想在首屏推进到 15 后只在 12 到 15 循环", () => {
  let state = createInitialState();
  const expectedSteps = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 12, 13, 14, 15, 12,
  ];

  for (const expectedStep of expectedSteps) {
    state = transition(state, { type: "DECLINE_PLAY" });
    assert.equal(state.declineStep, expectedStep);
    assert.equal(state.phase, "INTRO");
  }
});

test("DECLINE_PLAY 在非首屏保持当前状态", () => {
  const state = transition(createInitialState(), { type: "APPROVE" });
  const nextState = transition(state, { type: "DECLINE_PLAY" });

  assert.deepEqual(nextState, state);
  assert.equal(nextState.phase, "SECOND_CONFIRM");
});

test("DECLINE_NOW 在首屏不会进入 legacy 拒绝页", () => {
  const state = transition(createInitialState(), { type: "DECLINE_NOW" });

  assert.equal(state.phase, "INTRO");
});

test("DECLINE_FOR_TODAY 在首屏不会进入 legacy 拒绝页", () => {
  const state = transition(createInitialState(), { type: "DECLINE_FOR_TODAY" });

  assert.equal(state.phase, "INTRO");
});

test("日程不完整时拒绝进入快乐补给", () => {
  let state = createInitialState();
  state = transition(state, { type: "APPROVE" });
  state = transition(state, { type: "CONFIRM_APPROVAL" });
  state = transition(state, { type: "CONTINUE_TO_FOOD" });
  assert.equal(state.phase, "SCHEDULE");
});

test("只有本地今天或未来的真实 yyyy-mm-dd 日期与配置时间才算日程完整", () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const scheduleState = {
    ...createInitialState(),
    phase: "SCHEDULE" as const,
  };

  for (const time of ["15:00", "19:00", "20:30"]) {
    assert.equal(
      isScheduleComplete({
        ...scheduleState,
        date: toLocalDateString(today),
        time,
      }),
      true,
    );
  }
  assert.equal(
    isScheduleComplete({
      ...scheduleState,
      date: toLocalDateString(tomorrow),
      time: "19:00",
    }),
    true,
  );

  for (const invalidSchedule of [
    { date: toLocalDateString(yesterday), time: "19:00" },
    { date: "9999-02-30", time: "19:00" },
    { date: "9999-2-03", time: "19:00" },
    { date: toLocalDateString(today), time: "18:00" },
  ]) {
    assert.equal(
      isScheduleComplete({ ...scheduleState, ...invalidSchedule }),
      false,
    );
  }
});

test("过去日期、非法日期或配置外时间不能从日程进入快乐补给", () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const scheduleState = {
    ...createInitialState(),
    phase: "SCHEDULE" as const,
  };

  for (const invalidSchedule of [
    { date: toLocalDateString(yesterday), time: "19:00" },
    { date: "9999-04-31", time: "19:00" },
    { date: toLocalDateString(today), time: "23:59" },
  ]) {
    const nextState = transition(
      { ...scheduleState, ...invalidSchedule },
      { type: "CONTINUE_TO_FOOD" },
    );

    assert.equal(nextState.phase, "SCHEDULE");
  }
});

test("legacy 认真拒绝事件仍兼容暂存页", () => {
  const declinedForTodayState = transition(
    { ...createInitialState(), phase: "SERIOUS_CHOICE" as const },
    { type: "DECLINE_FOR_TODAY" },
  );
  const declinedNowState = transition(
    { ...createInitialState(), phase: "SERIOUS_CHOICE" as const },
    { type: "DECLINE_NOW" },
  );

  assert.equal(declinedForTodayState.phase, "DECLINED");
  assert.equal(declinedNowState.phase, "DECLINED");
});

test("手滑与日程返回都回到可预测的上一幕", () => {
  let state = createInitialState();
  state = transition(state, { type: "APPROVE" });
  state = transition(state, { type: "RETURN_TO_INVITATION" });
  assert.equal(state.phase, "INTRO");

  state = transition(state, { type: "APPROVE" });
  state = transition(state, { type: "CONFIRM_APPROVAL" });
  state = transition(state, { type: "BACK_TO_CONFIRM" });
  assert.equal(state.phase, "SECOND_CONFIRM");
});
