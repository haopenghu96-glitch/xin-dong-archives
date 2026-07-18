# Video-Faithful Date Invitation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the scrapbook archive interface with the approved video-faithful pink/white/black invitation flow, including an endlessly escaping “不要” control, second confirmation, date/time form, food grid, and compact success card.

**Architecture:** Keep the existing reducer-driven React flow and submission/share logic. Change state transitions first, then rebuild scene components around a simplified `SceneFrame`; keep dodge coordinates deterministic so behavior is responsive and testable. Upgrade the local-storage key to prevent stale archive phases from restoring into the new experience.

**Tech Stack:** Next.js 16, React 19, TypeScript, Framer Motion, CSS, Node test runner, Playwright.

**Execution note:** This directory is not a Git worktree, so commit steps are replaced with verification checkpoints. Do not add dependencies.

---

### Task 1: Lock the new state flow with failing unit tests

**Files:**
- Modify: `tests/unit/state-machine.test.ts`
- Modify: `src/lib/state-machine.ts`
- Modify: `src/hooks/useInvitationProgress.ts`

- [ ] **Step 1: Replace old transition expectations with the approved flow**

Write tests that assert:

```ts
test("愿意后先二次确认，再进入日程", () => {
  let state = createInitialState();
  state = transition(state, { type: "APPROVE" });
  assert.equal(state.phase, "SECOND_CONFIRM");
  state = transition(state, { type: "CONFIRM_APPROVAL" });
  assert.equal(state.phase, "SCHEDULE");
});

test("不要按钮连续逃跑且永不离开首屏", () => {
  let state = createInitialState();
  const observed: number[] = [];
  for (let index = 0; index < 12; index += 1) {
    state = transition(state, { type: "DECLINE_PLAY" });
    observed.push(state.declineStep);
    assert.equal(state.phase, "INTRO");
  }
  assert.deepEqual(observed.slice(0, 6), [1, 2, 3, 4, 5, 1]);
});
```

Update the happy-path tests so every schedule flow dispatches `APPROVE`, then `CONFIRM_APPROVAL`.

- [ ] **Step 2: Run the unit suite and verify RED**

Run: `npm test`

Expected: failure because `APPROVE` still goes directly to `SCHEDULE`, `declineStep` only supports `0 | 1 | 2 | 3`, and the fourth decline enters `SERIOUS_CHOICE`.

- [ ] **Step 3: Implement the minimal reducer changes**

Change `declineStep` to:

```ts
export type DeclineStep = 0 | 1 | 2 | 3 | 4 | 5;
```

Change the two transitions to:

```ts
case "APPROVE":
  return state.phase === "INTRO" ? { ...state, phase: "SECOND_CONFIRM" } : state;
case "DECLINE_PLAY": {
  if (state.phase !== "INTRO") return state;
  const nextStep = state.declineStep >= 5 ? 1 : state.declineStep + 1;
  return { ...state, declineStep: nextStep as DeclineStep };
}
```

Make `BACK_TO_CONFIRM` return from `SCHEDULE` to `SECOND_CONFIRM`. Keep legacy decline phases for type compatibility, but remove all new-flow transitions into them.

Upgrade the progress key:

```ts
const STORAGE_KEY = "xin-dong:video-invitation-v2";
```

- [ ] **Step 4: Run the unit suite and verify GREEN**

Run: `npm test`

Expected: all unit tests pass with zero failures.

---

### Task 2: Specify the escape interaction and main flow in Playwright

**Files:**
- Modify: `tests/e2e/invitation.spec.ts`
- Modify: `tests/e2e/visual.spec.ts`

- [ ] **Step 1: Write failing end-to-end expectations**

Add a helper that dispatches the correct pointer event and reads the button position:

```ts
async function dodgeDecline(page: Page) {
  const button = page.getByTestId("decline-action");
  await button.dispatchEvent("pointerdown", { pointerType: "touch" });
  await page.waitForTimeout(320);
  return button.boundingBox();
}
```

Assert:

```ts
await expect(page.getByRole("heading", { name: "可以和我一起约会嘛？！" })).toBeVisible();
await expect(page.getByTestId("decline-now")).toHaveCount(0);

const positions = [];
for (let index = 0; index < 6; index += 1) {
  positions.push(await dodgeDecline(page));
}
expect(new Set(positions.map((box) => `${Math.round(box!.x)}:${Math.round(box!.y)}`)).size).toBeGreaterThanOrEqual(5);
await expect(page.getByRole("heading", { name: "可以和我一起约会嘛？！" })).toBeVisible();
```

Update the happy path to expect `confirm-approval` after the first approve click. Update the food flow to expect automatic submission after selecting an option.

- [ ] **Step 2: Run the targeted E2E suite and verify RED**

Run: `npx playwright test tests/e2e/invitation.spec.ts`

Expected: failure on the new title, missing dodge behavior, and missing second-confirm transition.

---

### Task 3: Rebuild the invitation and second-confirm scenes

**Files:**
- Modify: `src/components/scenes/InvitationFlow.tsx`
- Modify: `src/components/scenes/IntroScene.tsx`
- Modify: `src/components/scenes/ConfirmScene.tsx`
- Modify: `src/components/scenes/SceneFrame.tsx`
- Modify: `src/components/ui/ArchivePrimitives.tsx`
- Modify: `src/config/invitation.ts`

- [ ] **Step 1: Stop remounting the whole intro on every dodge**

Use only the phase as the page-transition key:

```tsx
<motion.div key={state.phase} ...>
```

Remove `secretClicks`, `onDeclineNow`, archive easter eggs, and all new-flow routes into the serious decline scenes.

- [ ] **Step 2: Replace the intro with deterministic dodge positions**

Define six responsive positions and labels:

```ts
const dodgePositions = [
  { left: "57%", top: "73%", rotate: 0 },
  { left: "82%", top: "70%", rotate: 4 },
  { left: "72%", top: "48%", rotate: -4 },
  { left: "58%", top: "74%", rotate: 2 },
  { left: "8%", top: "54%", rotate: -3 },
  { left: "9%", top: "78%", rotate: 3 },
] as const;

const dodgeLabels = ["不要", "不要哇", "点不到吧", "不要嘛", "你抓不到", "别点我啦"];
```

Render the secondary button as an absolutely positioned Framer Motion button with `data-dodge-step={declineStep}`. Trigger `onDecline` on mouse `pointerenter`, touch/pen `pointerdown`, and keyboard click. Suppress duplicate pointer events within `260ms` with a ref. Animate with a fast spring around `stiffness: 480`, `damping: 30`.

The visible copy must be:

```ts
title: "可以和我一起约会嘛？！"
subtitle: "系统检测到：对方已经紧张到开始写网页了。"
approve: "愿意 ♥"
```

- [ ] **Step 3: Simplify the shared frame**

`SceneFrame` should only render:

```tsx
<section className={`scene scene--${variant}`} aria-live="polite">
  <span className="flower flower--one" aria-hidden="true">✿</span>
  <span className="flower flower--two" aria-hidden="true">✿</span>
  <div className="scene-card">{children}</div>
</section>
```

Remove folder tabs, paper clip, archive brand, and tint names tied to paper colors.

- [ ] **Step 4: Restyle the second confirmation**

Use the text:

```ts
title: "等下，你真的点了愿意？"
subtitle: "我都已经准备好被你点“不要”了。"
approve: "好啦好啦，我愿意 →"
slip: "刚刚手滑了"
```

Keep `data-testid="confirm-approval"` and the delayed confirmation transition.

- [ ] **Step 5: Run the targeted E2E suite**

Run: `npx playwright test tests/e2e/invitation.spec.ts --grep "不要|二次确认"`

Expected: dodge and second-confirm tests pass.

---

### Task 4: Rebuild schedule and food selection around the video

**Files:**
- Modify: `src/config/invitation.ts`
- Modify: `src/components/scenes/ScheduleScene.tsx`
- Modify: `src/components/scenes/FoodScene.tsx`
- Modify: `src/components/scenes/InvitationFlow.tsx`

- [ ] **Step 1: Expand food configuration**

Use stable IDs with a simple emoji field:

```ts
foodOptions: [
  { id: "pizza", label: "披萨", emoji: "🍕" },
  { id: "sushi", label: "寿司", emoji: "🍣" },
  { id: "hotpot", label: "火锅", emoji: "🍲" },
  { id: "bbq", label: "烤肉", emoji: "🥩" },
  { id: "dim-sum", label: "早茶", emoji: "🥟" },
  { id: "ramen", label: "拉面", emoji: "🍜" },
  { id: "mala", label: "麻辣烫", emoji: "🌶️" },
  { id: "crayfish", label: "小龙虾", emoji: "🦞" },
  { id: "skewers", label: "烧烤", emoji: "🍢" },
  { id: "surprise", label: "其他", emoji: "🍌" },
]
```

Keep a legacy label map for shared plans whose activity ID is `coffee`, `walk`, or `exhibit`.

- [ ] **Step 2: Simplify the schedule form**

Keep `data-testid="date-input"`, the three time values, note state, and validation. Replace tickets and stamps with a date input, a single time `select`, a note textarea, and a full-width `确定时间 ♥` button.

- [ ] **Step 3: Make food choice auto-submit once**

In `FoodScene`, use local `isChoosing` state. When an item is clicked, call `onSelect(food.id)`, set the selected visual state, start one `480ms` timeout, then call `onSubmit()`. Disable all options while the timeout is pending and clear the timeout on unmount.

- [ ] **Step 4: Run unit and E2E tests**

Run: `npm test && npx playwright test tests/e2e/invitation.spec.ts`

Expected: reducer and complete-flow tests pass.

---

### Task 5: Simplify loading, success, and shared-plan views

**Files:**
- Modify: `src/components/scenes/SubmitSuccessScene.tsx`
- Modify: `src/components/scenes/SharedPlanScene.tsx`
- Modify: `src/components/scenes/ReviewScene.tsx`
- Modify: `src/components/scenes/DeclineScene.tsx`

- [ ] **Step 1: Replace archive loading visuals**

Keep the existing API call and completion callback, but render only a small mascot/avatar, animated hearts, and one status line. Remove the flying envelope and archive-specific messages.

- [ ] **Step 2: Build the compact result card**

Show:

```tsx
<h1>真开心你没有拒绝～<br />我会准时来接你！</h1>
```

Render DATE, TIME, and MENU cells with the selected data. Keep one primary `分享约会卡` button; render save and reset as low-emphasis text controls.

- [ ] **Step 3: Apply the same result card language to shared links**

Keep `data-testid="shared-plan-card"` and existing parsing behavior. Ensure old activity IDs use the legacy label map rather than a blank label.

- [ ] **Step 4: Keep unreachable legacy scenes render-safe**

Update their `SceneFrame` props and basic class names so a stale in-memory state cannot crash, without adding a route back into those scenes.

---

### Task 6: Replace the scrapbook stylesheet with the video design system

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Define the approved tokens**

Use:

```css
:root {
  --pink-bg: #f7d7e6;
  --pink: #ec4ba8;
  --pink-dark: #d93696;
  --card: #fffdfb;
  --ink: #171317;
  --muted: #766c73;
  --hard-shadow: 0 7px 0 var(--ink);
}
```

- [ ] **Step 2: Implement the clean stage and card**

Desktop and mobile both use the blush background. The mobile stage is at most `430px`; `.scene-card` uses a white background, 3px black border, `28px` radius, and hard shadow. Remove all texture URLs, clipped paper edges, folder tabs, rotations, stamps, tape, and dark desk styles.

- [ ] **Step 3: Implement responsive dodge and grid bounds**

Give the intro interaction area a fixed responsive height so every percentage coordinate is stable. Allow the decline button to overlap the main-card border but keep `.scene` overflow visible and `.mobile-stage` overflow hidden only at the viewport edge. Use media queries for 360px and reduced motion.

- [ ] **Step 4: Update metadata**

Change the page title and description from archive language to the direct date invitation experience.

- [ ] **Step 5: Run lint and build**

Run: `npm run lint && npm run build`

Expected: both commands exit 0 with no TypeScript or ESLint errors.

---

### Task 7: Refresh visual evidence and run the full verification gate

**Files:**
- Modify: `tests/e2e/visual.spec.ts`
- Regenerate: `public/screenshots/*.png`

- [ ] **Step 1: Capture the approved sequence**

Capture at 390×844:

```text
intro → dodge 1 → dodge 2 → dodge 3 → second confirm → schedule → food → success
```

Also check 360×800, 430×932, and 1280×900 for overflow.

- [ ] **Step 2: Run all automated checks fresh**

Run:

```bash
npm test
npm run lint
npm run build
npm run e2e
```

Expected: every command exits 0 and Playwright reports zero failed tests.

- [ ] **Step 3: Inspect the generated screenshots**

Open the intro, third dodge, food, and success screenshots and verify against the design spec: blush/white/black palette, sparse flowers, small mascot avatar, no archive decorations, at least three visibly distinct dodge locations, compact food grid, and clean result card.

- [ ] **Step 4: Report actual verification evidence**

List the changed files, exact test counts, and clickable screenshot paths. Do not claim completion if any command or visual check failed.
