import { expect, test, type Page } from "@playwright/test";
import { createSharePlanUrl } from "../../src/lib/share-plan";

const e2eOrigin = `http://127.0.0.1:${process.env.PLAYWRIGHT_PORT ?? 3000}`;

const getLocalDate = (daysFromToday = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (date: string) => date.replaceAll("-", ".");

async function dodgeDecline(page: Page) {
  const button = page.getByTestId("decline-action");
  const previousStep = await button.getAttribute("data-dodge-step");

  await button.dispatchEvent("pointerdown", { pointerType: "touch" });
  await expect(button).not.toHaveAttribute("data-dodge-step", previousStep ?? "");
  await page.waitForTimeout(320);

  const box = await button.boundingBox();
  expect(box).not.toBeNull();
  return { box: box!, step: await button.getAttribute("data-dodge-step") };
}

async function chooseSchedule(page: Page, date = getLocalDate(7)) {
  await page.getByTestId("date-input").fill(date);
  await page.getByTestId("time-1900").click();
  await expect(page.getByTestId("time-1900")).toHaveAttribute("aria-pressed", "true");
  await page.getByTestId("schedule-next").click();
}

test("暂不批准连续移动 18 次并切换三段贴纸短剧", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const button = page.getByTestId("decline-action");
  const arena = page.getByTestId("decline-arena");
  const observedPositions = new Set<string>();
  const observedSteps: string[] = [];

  await expect(arena).toHaveCount(0);
  const approveBox = await page.getByTestId("approve-action").boundingBox();
  const declineBox = await button.boundingBox();
  expect(approveBox).not.toBeNull();
  expect(declineBox).not.toBeNull();
  expect(approveBox!.x).toBeLessThan(declineBox!.x);
  expect(Math.abs(approveBox!.y - declineBox!.y)).toBeLessThanOrEqual(2);

  for (let index = 0; index < 18; index += 1) {
    await button.dispatchEvent("pointerdown", { pointerType: "touch" });
    await page.waitForTimeout(280);
    const buttonBox = await button.boundingBox();
    const arenaBox = await arena.boundingBox();
    expect(buttonBox).not.toBeNull();
    expect(arenaBox).not.toBeNull();
    expect(buttonBox!.x).toBeGreaterThanOrEqual(arenaBox!.x);
    expect(buttonBox!.y).toBeGreaterThanOrEqual(arenaBox!.y);
    expect(buttonBox!.x + buttonBox!.width).toBeLessThanOrEqual(arenaBox!.x + arenaBox!.width + 1);
    expect(buttonBox!.y + buttonBox!.height).toBeLessThanOrEqual(arenaBox!.y + arenaBox!.height + 1);
    observedPositions.add(await button.getAttribute("data-dodge-position") ?? "");
    observedSteps.push(await button.getAttribute("data-dodge-step") ?? "");

    if (index === 0) await expect(page.locator("[data-chase-phase='ready']")).toBeVisible();
    if (index === 4) await expect(page.locator("[data-chase-phase='lunge']")).toBeVisible();
    if (index === 9) await expect(page.locator("[data-chase-phase='miss']")).toBeVisible();
  }

  expect(observedSteps).toEqual([
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "12", "13", "14",
  ]);
  expect(observedPositions.size).toBeGreaterThanOrEqual(10);
  await expect(page.getByTestId("scene-transition")).toHaveAttribute("data-phase", "INTRO");
});

test("页面使用奶油粉彩绘本底色", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(248, 232, 232)");
});

test("桌面靠近、键盘点击均能躲避且 260ms 内只计算一次", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const decline = page.getByTestId("decline-action");

  await expect(decline).toHaveAttribute("data-dodge-step", "0");
  await decline.dispatchEvent("pointerenter", { pointerType: "mouse" });
  await expect(decline).toHaveAttribute("data-dodge-step", "1");

  await decline.dispatchEvent("pointerenter", { pointerType: "mouse" });
  await page.waitForTimeout(80);
  await expect(decline).toHaveAttribute("data-dodge-step", "1");

  await page.waitForTimeout(220);
  await decline.dispatchEvent("pointerenter", { pointerType: "mouse" });
  await expect(decline).toHaveAttribute("data-dodge-step", "2");

  await page.waitForTimeout(280);
  await decline.dispatchEvent("click", { detail: 0 });
  await expect(decline).toHaveAttribute("data-dodge-step", "3");
});

test("360 和 430 宽度连续躲避时按钮始终完整留在视口内", async ({ page }) => {
  for (const viewport of [
    { width: 360, height: 800 },
    { width: 430, height: 932 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();

    const positions: string[] = [];
    for (let index = 0; index < 6; index += 1) {
      const { box } = await dodgeDecline(page);
      positions.push(`${Math.round(box.x)}:${Math.round(box.y)}`);

      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
    }

    expect(new Set(positions).size).toBeGreaterThanOrEqual(5);
    await expect(page.getByRole("heading", { name: "请批准一场蓄谋已久的见面" })).toBeVisible();
  }
});

test("愿意后经二次确认、日程和食物自动提交到成功页", async ({ page }) => {
  await page.addInitScript(() => {
    const originalSetItem = Storage.prototype.setItem;
    const state = window as typeof window & { __latestPlanWriteCount: number };
    state.__latestPlanWriteCount = 0;
    Storage.prototype.setItem = function setItem(key: string, value: string) {
      if (key === "xin-dong:latest-plan") state.__latestPlanWriteCount += 1;
      return originalSetItem.call(this, key, value);
    };
  });
  const scheduledDate = getLocalDate(7);
  await page.goto("/");
  await page.getByTestId("approve-action").click();

  await expect(page.getByRole("heading", { name: "等等，你真的批准了？" })).toBeVisible();
  await expect(page.getByTestId("date-input")).toHaveCount(0);
  await page.getByTestId("confirm-approval").click();

  await expect(page.getByTestId("date-input")).toHaveAttribute("type", "date");
  await page.getByTestId("note-input").fill("想坐靠窗的位置");
  await chooseSchedule(page, scheduledDate);
  await expect(page.getByRole("heading", { name: "这次的快乐，吃什么？" })).toBeVisible();
  await expect(page.locator('[data-testid^="food-"]')).toHaveCount(9);

  await page.getByTestId("food-hotpot").click();
  await expect(page.getByTestId("food-hotpot")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("选火锅？那脸红就有借口了。")).toBeVisible();
  await page.waitForTimeout(650);
  await expect(page.getByText("正在把心动写进计划…")).toHaveCount(0);

  await page.getByTestId("food-dessert").click();
  await expect(page.getByTestId("food-hotpot")).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByTestId("food-dessert")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("看来这次见面可以再甜一点。")).toBeVisible();
  await page.getByTestId("submit-plan").click();
  await expect(page.getByText("正在把心动写进计划…")).toBeVisible({ timeout: 2_000 });

  await expect(page.getByRole("heading", { name: "好啦，我们要见面了。" })).toBeVisible({ timeout: 8_000 });
  await expect(page.getByText(formatDisplayDate(scheduledDate))).toBeVisible();
  await expect(page.getByText("晚上 19:00")).toBeVisible();
  await expect(page.getByText("甜品", { exact: true })).toBeVisible();
  await expect(page.getByText("想坐靠窗的位置")).toBeVisible();
  expect(await page.evaluate(() => (window as typeof window & { __latestPlanWriteCount: number }).__latestPlanWriteCount)).toBe(1);
  const hearts = page.locator(".heart-row span");
  await expect(hearts).toHaveCount(5);
  expect(await hearts.evaluateAll((elements) => elements.map((element) => element.getAttribute("aria-hidden")))).toEqual(Array(5).fill("true"));
});

test("交给猫猫会在前八个选项间轻轻跳选，并落到一个真实食物", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("approve-action").click();
  await page.getByTestId("confirm-approval").click();
  await chooseSchedule(page);

  const surprise = page.getByTestId("food-surprise");
  await surprise.click();
  await expect(page.getByText("猫猫正在替你轻轻挑一份…")).toBeVisible();
  await expect(page.locator('[data-previewed="true"]')).toHaveCount(1);
  await expect(surprise).toHaveAttribute("aria-pressed", "false");
  await expect.poll(async () => page.locator('.food-choice.is-selected').count(), {
    timeout: 3_000,
  }).toBe(1);
  await expect(page.locator('.food-choice.is-selected')).not.toHaveAttribute("data-testid", "food-surprise");
});

test("提交写入失败时停在错误态并可重试", async ({ page }) => {
  await page.addInitScript(() => {
    const originalSetItem = Storage.prototype.setItem;
    const state = window as typeof window & { __failLatestPlanWrite: boolean };
    state.__failLatestPlanWrite = false;
    Storage.prototype.setItem = function setItem(key: string, value: string) {
      if (key === "xin-dong:latest-plan" && state.__failLatestPlanWrite) {
        throw new Error("latest plan write failed");
      }
      return originalSetItem.call(this, key, value);
    };
  });

  await page.goto("/");
  await page.getByTestId("approve-action").click();
  await page.getByTestId("confirm-approval").click();
  await chooseSchedule(page);
  await page.evaluate(() => {
    (window as typeof window & { __failLatestPlanWrite: boolean }).__failLatestPlanWrite = true;
  });
  await page.getByTestId("food-hotpot").click();
  await page.getByTestId("submit-plan").click();

  await expect(page.locator('.submission-error[role="alert"]')).toContainText("约会计划没写进去", { timeout: 8_000 });
  await expect(page.getByTestId("retry-submit")).toBeVisible();
  await expect(page.getByRole("heading", { name: "好啦，我们要见面了。" })).toHaveCount(0);

  await page.evaluate(() => {
    (window as typeof window & { __failLatestPlanWrite: boolean }).__failLatestPlanWrite = false;
  });
  await page.getByTestId("retry-submit").click();
  await expect(page.getByRole("heading", { name: "好啦，我们要见面了。" })).toBeVisible({ timeout: 8_000 });
});

test("场景切换后焦点跟随当前场景", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("approve-action").click();
  await expect(page.getByTestId("scene-transition")).toBeFocused();
  await page.getByTestId("confirm-approval").click();
  await expect(page.getByTestId("date-input")).toBeVisible();
  await expect(page.getByTestId("scene-transition")).toBeFocused();
});

test("刷新后恢复未完成的日程安排", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("approve-action").click();
  await page.getByTestId("confirm-approval").click();
  await expect(page.getByTestId("date-input")).toBeVisible();

  await page.reload();
  await expect(page.getByTestId("date-input")).toBeVisible();
});

test("提交中刷新会回到食物确认且不会自动重提", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("approve-action").click();
  await page.getByTestId("confirm-approval").click();
  await chooseSchedule(page);
  await page.getByTestId("food-hotpot").click();
  await page.getByTestId("submit-plan").click();
  await expect(page.getByText("正在把心动写进计划…")).toBeVisible({ timeout: 2_000 });
  await expect.poll(() => page.evaluate(() => {
    const raw = window.localStorage.getItem("xin-dong:video-invitation-v2");
    return raw ? JSON.parse(raw).phase : null;
  })).toBe("SUBMITTING");

  await page.reload();
  await expect(page.getByRole("heading", { name: "这次的快乐，吃什么？" })).toBeVisible();
  await page.waitForTimeout(2_000);
  await expect(page.getByRole("heading", { name: "好啦，我们要见面了。" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "这次的快乐，吃什么？" })).toBeVisible();

  await page.getByTestId("food-hotpot").click();
  await page.getByTestId("submit-plan").click();
  await expect(page.getByRole("heading", { name: "好啦，我们要见面了。" })).toBeVisible({ timeout: 8_000 });
});

test("分享链接可在新设备显示当前和旧版约会菜单", async ({ page }) => {
  const currentDate = getLocalDate(7);
  const legacyDate = getLocalDate(8);
  const currentUrl = createSharePlanUrl(e2eOrigin, {
    date: currentDate,
    time: "19:00",
    activityId: "hotpot",
  });

  await page.goto(currentUrl);
  await expect(page.getByTestId("shared-plan-card")).toBeVisible();
  await expect(page.getByText(formatDisplayDate(currentDate))).toBeVisible();
  await expect(page.getByText("晚上 19:00")).toBeVisible();
  await expect(page.getByText("火锅")).toBeVisible();

  const legacyUrl = createSharePlanUrl(e2eOrigin, {
    date: legacyDate,
    time: "20:30",
    activityId: "coffee",
  });
  await page.goto(legacyUrl);
  await expect(page.getByTestId("shared-plan-card")).toBeVisible();
  await expect(page.getByText("咖啡")).toBeVisible();
});
