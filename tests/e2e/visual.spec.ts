import { expect, test, type Page } from "@playwright/test";

const screenshotDirectory = "public/screenshots";

const getFutureDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBeTruthy();
}

async function settleScene(page: Page) {
  await page.waitForTimeout(380);
}

async function touchDodge(page: Page) {
  await page.getByTestId("decline-action").dispatchEvent("pointerdown", { pointerType: "touch" });
  await page.waitForTimeout(320);
  await expectNoHorizontalOverflow(page);
}

test("视频邀请关键状态在移动端与桌面均无横向溢出", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByTestId("approve-action")).toBeVisible();
  await settleScene(page);
  await page.screenshot({ path: `${screenshotDirectory}/01-intro-390x844.png`, fullPage: true });
  await expectNoHorizontalOverflow(page);

  for (let step = 1; step <= 3; step += 1) {
    await touchDodge(page);
    await page.screenshot({
      path: `${screenshotDirectory}/0${step + 1}-dodge-${step}-390x844.png`,
      fullPage: true,
    });
  }

  await page.getByTestId("approve-action").click();
  await expect(page.getByRole("heading", { name: "等等，你真的批准了？" })).toBeVisible();
  await settleScene(page);
  await page.screenshot({ path: `${screenshotDirectory}/05-confirm-390x844.png`, fullPage: true });
  await expectNoHorizontalOverflow(page);

  await page.getByTestId("confirm-approval").click();
  await expect(page.getByTestId("date-input")).toBeVisible();
  await settleScene(page);
  await page.screenshot({ path: `${screenshotDirectory}/06-schedule-390x844.png`, fullPage: true });
  await page.getByTestId("date-input").fill(getFutureDate());
  await page.getByTestId("time-1900").click();
  await page.getByTestId("schedule-next").click();

  await expect(page.getByTestId("food-hotpot")).toBeVisible();
  await settleScene(page);
  await page.screenshot({ path: `${screenshotDirectory}/07-food-390x844.png`, fullPage: true });
  await expectNoHorizontalOverflow(page);

  await page.getByTestId("food-hotpot").click();
  await page.getByTestId("submit-plan").click();
  await expect(page.getByText("正在把心动写进计划…")).toBeVisible({ timeout: 2_000 });
  await page.screenshot({ path: `${screenshotDirectory}/08-submitting-390x844.png`, fullPage: true });
  await expect(page.getByRole("heading", { name: "好啦，我们要见面了。" })).toBeVisible({ timeout: 8_000 });
  await settleScene(page);
  await page.screenshot({ path: `${screenshotDirectory}/09-success-390x844.png`, fullPage: true });
  await expectNoHorizontalOverflow(page);

  for (const viewport of [
    { width: 360, height: 800 },
    { width: 430, height: 932 },
  ]) {
    await page.setViewportSize(viewport);
    await page.screenshot({
      path: `${screenshotDirectory}/success-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    });
    await expectNoHorizontalOverflow(page);
  }

  await page.evaluate(() => window.localStorage.clear());
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(page.getByTestId("approve-action")).toBeVisible();
  await settleScene(page);
  await page.screenshot({ path: `${screenshotDirectory}/intro-1280x900.png`, fullPage: true });
  await expectNoHorizontalOverflow(page);

  expect(consoleErrors).toEqual([]);
});
