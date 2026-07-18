# Strawberry Milk Scrapbook Redesign Implementation Plan

> **状态：已被 `2026-07-14-heart-pig-comic-archive-redesign.md` 取代，禁止执行。** 本计划中的毛绒角色资产、组件表现和验收标准已经过期。

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把现有约会邀请完整升级为草莓牛奶粉「心动档案局」：幼态毛球主角、16 级连续逃跑、3×3 插画菜单、含蓄双声道情话和约会通行证，同时保留提交、恢复与分享能力。

**Architecture:** 保留现有状态机、持久化、提交适配器和 `InvitationFlow` 场景调度；把视觉职责拆成 `ScrapbookFrame`、`MascotMoment`、`FlirtNote`、`FoodChoiceCard` 与 `PlanSummaryCard`。配置层集中所有文案、菜单元数据与旧 ID 迁移；纯函数 `decline-dodge.ts` 管理可测试的 12 个安全位置。

**Tech Stack:** Next.js 16 App Router、React 19、TypeScript、Framer Motion、原生 CSS、Node test runner、Playwright。

---

## Execution constraints

- 工程路径：`/Users/mima0000/Desktop/dating app`。
- 当前目录不是 Git 仓库。不要擅自执行 `git init`；本计划以每个任务后的测试检查点代替 commit。
- 不新增 npm 依赖，不迁移 CSS Modules，不改 localStorage key，不改分享 payload 格式。
- 旧设计真源：`docs/superpowers/specs/2026-07-13-strawberry-milk-scrapbook-redesign-design.md`（已取代）。
- 当前设计真源：`docs/superpowers/specs/2026-07-14-heart-pig-comic-archive-redesign-design.md`；本计划必须重写后才能执行。
- 所有生产文件改动使用 `apply_patch`；生成的 PNG 资产由图像生成工具直接落盘。
- 计划前基线已验证：单元测试 38/38、E2E 11/11；实现后不得降低覆盖或绕过失败用例。

## File map

### Create

- `src/lib/food-migration.ts` — 新旧食物 ID 归一化。
- `src/lib/decline-dodge.ts` — 12 个安全点与边界计算。
- `src/components/ui/ScrapbookFrame.tsx` — 三层粉色拼贴外壳。
- `src/components/ui/FlirtNote.tsx` — 旁白、批注与选择反馈便签。
- `src/components/mascot/MascotMoment.tsx` — 大尺寸角色与旁白组合。
- `src/components/ui/FoodChoiceCard.tsx` — 食物插画卡、选中态、图片回退。
- `src/components/ui/PlanSummaryCard.tsx` — 成功页与共享页复用的通行证。
- `src/components/scenes/SubmittingScene.tsx` — 提交中与重试场景。
- `src/components/scenes/SuccessScene.tsx` — 成功、分享、打印与重看场景。
- `tests/unit/invitation-config.test.ts` — 16 级文案和九项菜单契约。
- `tests/unit/food-migration.test.ts` — 新旧食物 ID 迁移。
- `tests/unit/decline-dodge.test.ts` — 12 个位置和尺寸边界。
- `public/food/hotpot.png`
- `public/food/sushi.png`
- `public/food/bbq.png`
- `public/food/hunan.png`
- `public/food/western.png`
- `public/food/dessert.png`
- `public/food/coffee.png`
- `public/food/snacks.png`
- `public/food/surprise.png`
- `public/mascot/strawberry/serious-review.png`
- `public/mascot/strawberry/surprised-reaction.png`
- `public/mascot/strawberry/hunter-chase.png`
- `public/mascot/strawberry/chef-expectation.png`
- `public/mascot/strawberry/courier-envelope.png`
- `public/mascot/strawberry/cool-approved.png`

### Preserve as runtime fallbacks

- `public/mascot/serious-review.png`
- `public/mascot/surprised-reaction.png`
- `public/mascot/hunter-chase.png`
- `public/mascot/chef-expectation.png`
- `public/mascot/courier-envelope.png`
- `public/mascot/cool-approved.png`

### Modify

- `src/config/invitation.ts`
- `src/lib/state-machine.ts`
- `src/lib/invitation-progress-storage.ts`
- `src/lib/share-plan.ts`
- `src/components/mascot/Mascot.tsx`
- `src/components/ui/FoodIcon.tsx`
- `src/components/scenes/IntroScene.tsx`
- `src/components/scenes/ConfirmScene.tsx`
- `src/components/scenes/ScheduleScene.tsx`
- `src/components/scenes/FoodScene.tsx`
- `src/components/scenes/SharedPlanScene.tsx`
- `src/components/scenes/ReviewScene.tsx`
- `src/components/scenes/DeclineScene.tsx`
- `src/components/scenes/InvitationFlow.tsx`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `tests/unit/state-machine.test.ts`
- `tests/unit/invitation-progress-storage.test.ts`
- `tests/unit/share-plan.test.ts`
- `tests/e2e/invitation.spec.ts`
- `tests/e2e/visual.spec.ts`

### Delete after references are removed

- `src/components/scenes/SceneFrame.tsx`
- `src/components/scenes/SubmitSuccessScene.tsx`

## Task 1: Generate the final visual assets

**Files:**
- Create: `public/mascot/strawberry/*.png` listed above
- Create: `public/food/*.png` listed above
- Preserve: `public/mascot/*.png` as fallback assets
- Fallback: `src/components/ui/FoodIcon.tsx`

- [ ] **Step 1: Read the image generation skill and inspect all six current mascot files**

Read `/Users/mima0000/.codex/skills/.system/imagegen/SKILL.md` completely. Inspect each existing mascot with `view_image`; do not use Python for image editing.

- [ ] **Step 2: Generate the six strawberry mascot assets without overwriting the originals**

Use each current pose as the edit reference and apply this fixed style prompt:

```text
把参考角色重绘成同一只更幼态、更可爱的珊瑚粉毛绒“心动档案局管理员”。保持原图的动作和道具，但整体头身几乎一体、更圆更蓬松，豆豆手、小短腿、大而略宽距的眼睛、明显腮红，表情以害羞、惊喜、偷笑和装镇定为主；保留黑色小领带、心形档案章和可随情绪弯曲的触角。黑色手绘粗线、轻水彩颗粒、奶油白贴纸描边、草莓牛奶粉配色。单角色居中，完整身体和道具都在画面内，透明背景，无文字、无额外角色、无边框。与其他五张保持完全一致的角色比例、毛发质感、线宽和光源。
```

每次生成后将结果保存到 `public/mascot/strawberry/` 下的对应同名文件；serious 抱申请表、surprised 捂脸、hunter 持放大镜和捕心网、chef 戴厨师帽抱面碗、courier 抱爱心信封奔跑、cool 戴墨镜且触角弯成心形。不得覆盖 `public/mascot/` 现有六张文件，它们是运行时回退。

- [ ] **Step 3: Generate nine food illustrations**

所有食物图使用同一模板：

```text
为草莓牛奶粉约会手账生成一张独立的【SUBJECT】食物贴纸插画。俯视或轻微三分之二视角，食物丰盛、诱人、容易一眼识别；黑色手绘粗轮廓，轻水彩颗粒和蜡笔涂色，奶油白贴纸描边，粉彩色但食物本身颜色真实。单个主体居中，四周留足裁切空间，透明背景，无文字、无人物、无餐厅背景、无边框。风格必须与珊瑚粉毛球管理员一致。
```

将 `SUBJECT` 依次替换为并保存：

| 文件 | SUBJECT |
|---|---|
| `hotpot.png` | 冒热气的鸳鸯火锅，肉片蔬菜菌菇丰富 |
| `sushi.png` | 寿司与刺身拼盘，三文鱼、握寿司和芥末 |
| `bbq.png` | 桌面烤盘上的烤肉，肉片有焦香纹理 |
| `hunan.png` | 湘菜组合，剁椒鱼头和辣椒炒肉，红辣椒明显 |
| `western.png` | 西餐牛排拼盘，配蔬菜、意面和餐具 |
| `dessert.png` | 草莓奶油蛋糕与小浆果 |
| `coffee.png` | 拉花拿铁咖啡杯与两颗咖啡豆 |
| `snacks.png` | 纸盒装的小吃与串串，适合边走边吃 |
| `surprise.png` | 有爱心贴纸和问号的神秘手提餐盒 |

- [ ] **Step 4: Verify all assets exist and are usable**

Run:

```bash
find public/mascot/strawberry public/food -type f -name '*.png' -print | sort
file public/mascot/strawberry/*.png public/food/*.png
```

Expected: exactly six new strawberry mascot PNGs and nine food PNGs; every file is a readable PNG. Inspect a contact sheet or each file visually for consistent character identity, no cropped limbs, no embedded text, recognizable food, and clean outer corners. Keep all six original mascot files unchanged.

## Task 2: Lock the invitation data contract and legacy migration

**Files:**
- Create: `tests/unit/invitation-config.test.ts`
- Create: `tests/unit/food-migration.test.ts`
- Create: `src/lib/food-migration.ts`
- Modify: `src/config/invitation.ts`
- Modify: `src/lib/invitation-progress-storage.ts`
- Modify: `src/lib/share-plan.ts`
- Test: `tests/unit/invitation-progress-storage.test.ts`
- Test: `tests/unit/share-plan.test.ts`

- [ ] **Step 1: Write failing configuration tests**

Create `tests/unit/invitation-config.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { invitationConfig } from "../../src/config/invitation";
import { CURRENT_FOOD_IDS } from "../../src/lib/food-migration";

test("拒绝文案固定为 16 级且每级字段完整", () => {
  const steps = invitationConfig.copy.intro.declineSteps;
  assert.equal(steps.length, 16);
  assert.deepEqual(steps.map((item) => item.step), Array.from({ length: 16 }, (_, index) => index));
  for (const item of steps) {
    assert.ok(item.buttonLabel.length > 0);
    assert.ok(item.mascotNote.length > 0);
  }
});

test("菜单固定为 3x3 九项且展示字段完整", () => {
  const foods = invitationConfig.foodOptions;
  assert.equal(foods.length, 9);
  assert.deepEqual(foods.map((item) => item.id), [...CURRENT_FOOD_IDS]);
  assert.equal(new Set(foods.map((item) => item.id)).size, 9);
  assert.equal(new Set(foods.map((item) => item.imageSrc)).size, 9);
  for (const item of foods) {
    assert.ok(item.label);
    assert.ok(item.tagline);
    assert.ok(item.feedback);
    assert.match(item.imageSrc, /^\/food\/.+\.png$/);
  }
});
```

- [ ] **Step 2: Write failing migration tests**

Create `tests/unit/food-migration.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { normalizeActivityId, normalizeFoodId } from "../../src/lib/food-migration";

test("旧食物 id 迁移到新九宫格", () => {
  const cases = {
    pizza: "western",
    "dim-sum": "snacks",
    ramen: "snacks",
    mala: "hunan",
    crayfish: "hunan",
    skewers: "snacks",
  } as const;
  for (const [legacy, current] of Object.entries(cases)) {
    assert.equal(normalizeFoodId(legacy), current);
  }
});

test("当前 food id 保持不变，未知值返回 null", () => {
  for (const id of ["hotpot", "sushi", "bbq", "hunan", "western", "dessert", "coffee", "snacks", "surprise"]) {
    assert.equal(normalizeFoodId(id), id);
  }
  assert.equal(normalizeFoodId("unknown"), null);
  assert.equal(normalizeFoodId(null), null);
});

test("非食物 legacy 活动保留给旧分享链接", () => {
  assert.equal(normalizeActivityId("dinner"), "dinner");
  assert.equal(normalizeActivityId("walk"), "walk");
  assert.equal(normalizeActivityId("pizza"), "western");
});
```

- [ ] **Step 3: Run the new tests and verify failure**

Run:

```bash
npx tsx --test tests/unit/invitation-config.test.ts tests/unit/food-migration.test.ts
```

Expected: FAIL because `declineSteps`, `tagline`, `feedback`, `imageSrc`, and `food-migration.ts` do not exist.

- [ ] **Step 4: Implement the food migration module**

Create `src/lib/food-migration.ts`:

```ts
export const CURRENT_FOOD_IDS = [
  "hotpot", "sushi", "bbq", "hunan", "western", "dessert", "coffee", "snacks", "surprise",
] as const;

export type CurrentFoodId = (typeof CURRENT_FOOD_IDS)[number];

export const legacyFoodIdMap = {
  pizza: "western",
  "dim-sum": "snacks",
  ramen: "snacks",
  mala: "hunan",
  crayfish: "hunan",
  skewers: "snacks",
} as const satisfies Readonly<Record<string, CurrentFoodId>>;

const currentFoodIds = new Set<string>(CURRENT_FOOD_IDS);
const legacyActivities = new Set(["dinner", "walk", "exhibit"]);

export const normalizeFoodId = (value: unknown): CurrentFoodId | null => {
  if (typeof value !== "string") return null;
  if (currentFoodIds.has(value)) return value as CurrentFoodId;
  return legacyFoodIdMap[value as keyof typeof legacyFoodIdMap] ?? null;
};

export const normalizeActivityId = (value: string): string | null =>
  normalizeFoodId(value) ?? (legacyActivities.has(value) ? value : null);
```

- [ ] **Step 5: Replace the configuration with the fixed copy and food metadata**

In `src/config/invitation.ts`:

- Replace `intro.declineLabels` with this exact array:

```ts
const declineSteps = [
  { step: 0, buttonLabel: "暂不批准", mascotNote: "拒绝键已就位，看起来不太安分。" },
  { step: 1, buttonLabel: "欸，等一下", mascotNote: "它说还没做好被点中的准备。" },
  { step: 2, buttonLabel: "我再躲一下", mascotNote: "申请人没跑，按钮先跑了。" },
  { step: 3, buttonLabel: "这边也点不到", mascotNote: "你追得这么认真，它开始紧张。" },
  { step: 4, buttonLabel: "你怎么还追呀", mascotNote: "友情提示：追按钮，也有一点像追。" },
  { step: 5, buttonLabel: "再追就暧昧了", mascotNote: "档案局开始记录，但不作为证据。" },
  { step: 6, buttonLabel: "让我缓半秒", mascotNote: "按钮在喘气，申请人在偷笑。" },
  { step: 7, buttonLabel: "你其实在笑吧", mascotNote: "放心，表情不在采集范围。" },
  { step: 8, buttonLabel: "我快没地方跑了", mascotNote: "逃跑路线快用完，勇气倒多了一点。" },
  { step: 9, buttonLabel: "批准键在那边", mascotNote: "左边那个粉色的，看起来很适合你。" },
  { step: 10, buttonLabel: "再想我半秒嘛", mascotNote: "只见一面，不急着把话都说完。" },
  { step: 11, buttonLabel: "追到这里很可疑", mascotNote: "到底是谁舍不得结束这段追逐？" },
  { step: 12, buttonLabel: "给你留个台阶", mascotNote: "点批准不算输，只算一起吃顿饭。" },
  { step: 13, buttonLabel: "我替你保密", mascotNote: "不会告诉别人，你追了这么久。" },
  { step: 14, buttonLabel: "好啦，不跑了", mascotNote: "按钮认输，申请人也快装不住了。" },
  { step: 15, buttonLabel: "…其实想见吧", mascotNote: "如果答案是愿意，轻轻点一下就好。" },
] as const;
```
- Expand time options to `{ value, label, flirt }` using the three approved lines.
- Replace the ten old food rows with exactly these nine rows:

```ts
foodOptions: [
  { id: "hotpot", label: "火锅", emoji: "🍲", tagline: "把拘谨一起煮开", feedback: "这次见面，得热气腾腾一点。", tone: "pink", imageSrc: "/food/hotpot.png" },
  { id: "sushi", label: "日料", emoji: "🍣", tagline: "安静一点，好多看你几眼", feedback: "安静的座位，也许更适合偷偷看你。", tone: "mint", imageSrc: "/food/sushi.png" },
  { id: "bbq", label: "烤肉", emoji: "🥩", tagline: "我负责烤，你负责好看", feedback: "我会认真翻面，也会认真听你说话。", tone: "yellow", imageSrc: "/food/bbq.png" },
  { id: "hunan", label: "湘菜", emoji: "🌶️", tagline: "辣到脸红，刚好有借口", feedback: "脸红这件事，终于有合理解释。", tone: "rose", imageSrc: "/food/hunan.png" },
  { id: "western", label: "西餐", emoji: "🍝", tagline: "认真约会，假装不紧张", feedback: "那我练习一下，怎么自然地帮你拉椅子。", tone: "lavender", imageSrc: "/food/western.png" },
  { id: "dessert", label: "甜品", emoji: "🍰", tagline: "聊天不够甜，它来补位", feedback: "看来这次见面可以再甜一点。", tone: "soft-pink", imageSrc: "/food/dessert.png" },
  { id: "coffee", label: "咖啡", emoji: "☕", tagline: "先聊一杯，舍不得再续杯", feedback: "喝完舍不得走，就再点一杯。", tone: "cream", imageSrc: "/food/coffee.png" },
  { id: "snacks", label: "小吃", emoji: "🍢", tagline: "边走边吃，顺便并肩", feedback: "比起面对面，可以先从并肩走路开始。", tone: "blue", imageSrc: "/food/snacks.png" },
  { id: "surprise", label: "交给你", emoji: "🎁", tagline: "把选择交给我，期待留给你", feedback: "我会偷偷把你放在第一顺位。", tone: "yellow", imageSrc: "/food/surprise.png" },
] as const,
```

Export:

```ts
export type FoodOption = (typeof invitationConfig.foodOptions)[number];
export type FoodId = FoodOption["id"];
export type MascotMood = keyof typeof invitationConfig.mascots;
```

Point every mascot entry to the new folder while retaining an explicit fallback, for example:

```ts
serious: {
  src: "/mascot/strawberry/serious-review.png",
  fallbackSrc: "/mascot/serious-review.png",
  alt: "抱着申请表、努力装镇定的毛球管理员",
},
```

Apply the same `src`/`fallbackSrc` pattern to all six moods.

Set the scene copy to these exact values; components must only read these fields:

```ts
copy: {
  intro: {
    eyebrow: "机密文件 · 仅对你生效",
    title: "请批准一场蓄谋已久的见面",
    subtitle: "我把“想见你”写成了申请表，免得当面又假装随便。",
    approve: "批准申请 ♥",
    declineSteps,
    declineLabels: declineSteps.map(({ buttonLabel }) => buttonLabel),
  },
  confirm: {
    eyebrow: "审批异常提醒",
    title: "等等，你真的批准了？",
    subtitle: "我连被拒绝后的体面台词都准备好了，结果你让我白练了。",
    mascotNote: "报告：申请人正在努力不要笑得太明显。",
    approve: "嗯，是真的 ♥",
    slip: "刚刚手滑",
  },
  schedule: {
    eyebrow: "心动线索 · 第 1 项",
    title: "正在捕捉你的空闲时间",
    subtitle: "借我一天里的两个小时，剩下的期待我来负责。",
    dateLabel: "哪天适合偷偷见面？",
    dateFeedback: "这天被圈起来了，旁边不小心多画了一颗心。",
    timeLabel: "几点开始想你…不是，见你？",
    noteLabel: "给约会管理员留个暗号（可选）",
    notePlaceholder: "比如：想吃辣 / 别太晚 / 希望可以散散步",
    incomplete: "日期和时间还差一点，心动暂时找不到目的地。",
    next: "抓到了，去选快乐 →",
  },
  food: {
    eyebrow: "快乐补给 · 第 2 项",
    title: "这次的快乐，吃什么？",
    subtitle: "你负责挑喜欢的，我负责把你喜欢的记住。",
    submit: "装进约会计划 ♥",
  },
  submitting: {
    title: "正在把心动写进计划…",
    subtitle: "别催，申请人正在假装这是一件很平常的事。",
    errorTitle: "不是反悔，是网络比我还紧张。",
    errorBody: "刚才没写进去，计划和期待都还在。",
    retry: "再递一次申请",
  },
  success: {
    eyebrow: "约会通行证 · 已批准",
    title: "好啦，我们要见面了。",
    body: "这句话看起来很普通，但我已经偷偷开心了很久。",
    status: "申请人状态：表面镇定 / 实际心跳超速",
    passNote: "凭此通行证，兑换一次很认真又不太好意思的见面。",
    hint: "地点先保密一点，给见面留一个小惊喜。",
    share: "分享这份小秘密",
    save: "保存约会通行证",
    revisit: "再偷看一遍",
    shareOpened: "分享面板已打开，接下来请假装若无其事。",
    shareCopied: "小秘密复制好了，现在只差鼓起勇气发出去。",
    shareCancelled: "没关系，小秘密先替你保管。",
  },
  shared: {
    title: "这份只对你生效的见面申请，已经批准啦。",
    hint: "地点可以晚点一起商量，期待已经先到了。",
    start: "我也要发起邀请 ♥",
  },
  review: {
    title: "最后看一眼：真的要见面啦",
    subtitle: "时间、快乐补给和一点点小心思，都装好了。",
    status: "申请人状态：表面镇定 / 实际心跳加速",
    submit: "装进约会计划 ♥",
  },
  decline: {
    title: "这份邀请先好好收起来",
    body: "今天不方便也没关系，你不用解释。",
    return: "再看看这份邀请",
    today: "今天先不约",
    saved: "收到。等你哪天想见面了，这份勇气还在。",
  },
}
```

`declineLabels` and each food `emoji` are temporary compatibility fields for the still-unmigrated Intro/Food scenes. Keep them through Task 7, then they may remain as harmless fallbacks or be removed only after `rg` proves no production consumer depends on them.

- [ ] **Step 6: Migrate restored state instead of rejecting it**

In `src/lib/invitation-progress-storage.ts`, remove the local `foodIds` set and normalize decoded IDs:

```ts
import { normalizeFoodId } from "@/lib/food-migration";

const normalizedFoodId = value.foodId === null ? null : normalizeFoodId(value.foodId);
if (value.foodId !== null && normalizedFoodId === null) return null;

const state: InvitationState = {
  phase: value.phase,
  declineStep: value.declineStep,
  date: value.date,
  time: value.time,
  note: value.note,
  foodId: normalizedFoodId,
};
```

Keep `INVITATION_STORAGE_KEY` unchanged.

- [ ] **Step 7: Preserve share payloads while normalizing old food IDs**

In `src/lib/share-plan.ts`, allow current IDs, old food IDs, and legacy activities. After decoding, validate before reading fields, then return the canonical ID:

```ts
if (!isSharePlan(plan)) return null;
const activityId = normalizeActivityId(plan.activityId);
return activityId === null ? null : { ...plan, activityId };
```

Update `getActivityLabel` to normalize food IDs before looking up labels; retain the existing legacy labels for `dinner`, `walk`, and `exhibit`.
Remove `coffee` from `legacyActivityLabels` because it is now a current nine-grid food ID whose label is `咖啡`.

- [ ] **Step 8: Add migration assertions to storage and share tests**

Add to `tests/unit/invitation-progress-storage.test.ts`:

```ts
test("旧食物进度恢复时迁移而不是清空", () => {
  assert.deepEqual(
    parseInvitationState(JSON.stringify({ ...validState, foodId: "pizza" })),
    { ...validState, foodId: "western" },
  );
});
```

Replace the old test that treated `coffee` as invalid with:

```ts
test("foodId 接受新九宫格 id，未知 id 才回退", () => {
  for (const foodId of ["hotpot", "western", "dessert", "coffee", "surprise"] as const) {
    assert.deepEqual(
      parseInvitationState(JSON.stringify({ ...validState, foodId })),
      { ...validState, foodId },
    );
  }
  assert.deepEqual(
    parseInvitationState(JSON.stringify({ ...validState, foodId: "unknown" })),
    createInitialState(),
  );
});
```

Replace the legacy-`coffee` test with these assertions:

```ts
test("九项新菜单都可分享往返", async () => {
  const sharePlan = await loadSharePlan();
  for (const activityId of ["hotpot", "sushi", "bbq", "hunan", "western", "dessert", "coffee", "snacks", "surprise"]) {
    const url = sharePlan.createSharePlanUrl("https://date.example", {
      date: "2026-08-08", time: "19:00", activityId,
    });
    assert.deepEqual(
      sharePlan.parseSharePlan(new URL(url).searchParams.get("plan")),
      { date: "2026-08-08", time: "19:00", activityId },
    );
  }
});

test("旧食物分享 id 解析为新菜单 id", async () => {
  const sharePlan = await loadSharePlan();
  const migrations = {
    pizza: "western", "dim-sum": "snacks", ramen: "snacks",
    mala: "hunan", crayfish: "hunan", skewers: "snacks",
  } as const;
  for (const [legacyId, activityId] of Object.entries(migrations)) {
    assert.deepEqual(
      sharePlan.parseSharePlan(encodePlan({ date: "2026-08-08", time: "19:00", activityId: legacyId })),
      { date: "2026-08-08", time: "19:00", activityId },
    );
  }
});
```

Keep separate tests for `dinner`, `walk`, and `exhibit` legacy activities.

- [ ] **Step 9: Run unit tests**

Run:

```bash
npm test
```

Expected: all unit tests pass. The old 1–5 decline loop remains green until Task 3 deliberately replaces that contract.

## Task 3: Implement 16-level copy and 12 safe dodge positions

**Files:**
- Create: `tests/unit/decline-dodge.test.ts`
- Create: `src/lib/decline-dodge.ts`
- Modify: `tests/unit/state-machine.test.ts`
- Modify: `src/lib/state-machine.ts`
- Modify: `tests/unit/invitation-progress-storage.test.ts`

- [ ] **Step 1: Write the failing state-machine loop test**

Replace the existing 1–5 loop assertion with:

```ts
test("拒绝文案推进到 15 后在 12 到 15 之间循环", () => {
  let state = createInitialState();
  const expected = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,12,13,14,15,12];
  for (const declineStep of expected) {
    state = transition(state, { type: "DECLINE_PLAY" });
    assert.equal(state.declineStep, declineStep);
    assert.equal(state.phase, "INTRO");
  }
});
```

Replace the old “选定后直接生成” test with the explicit state contract:

```ts
test("选择菜单可改选，显式提交后才进入提交中", () => {
  let state = {
    ...createInitialState(),
    phase: "FOOD" as const,
    date: toLocalDateString(new Date()),
    time: "19:00",
  };
  state = transition(state, { type: "SELECT_FOOD", foodId: "hotpot" });
  assert.equal(state.phase, "FOOD");
  state = transition(state, { type: "SELECT_FOOD", foodId: "dessert" });
  assert.equal(state.foodId, "dessert");
  state = transition(state, { type: "SUBMIT" });
  assert.equal(state.phase, "SUBMITTING");
});

test("未选菜单时显式提交仍停留在 FOOD", () => {
  const state = { ...createInitialState(), phase: "FOOD" as const };
  assert.deepEqual(transition(state, { type: "SUBMIT" }), state);
});
```

Update storage bounds: step `15` is valid and `16`, `-1`, `1.5` are invalid.

- [ ] **Step 2: Write failing dodge geometry tests**

Create `tests/unit/decline-dodge.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { DODGE_SAFE_POINTS, getDodgePosition } from "../../src/lib/decline-dodge";

test("十二个安全点完整且第十三次复用第一个", () => {
  assert.equal(DODGE_SAFE_POINTS.length, 12);
  const cycle = Array.from({ length: 12 }, (_, step) =>
    getDodgePosition(step, { width: 328, height: 280 }, { width: 132, height: 54 }),
  );
  assert.equal(new Set(cycle.map(({ x, y }) => `${x}:${y}`)).size, 12);
  assert.deepEqual(
    getDodgePosition(0, { width: 328, height: 280 }, { width: 132, height: 54 }),
    getDodgePosition(12, { width: 328, height: 280 }, { width: 132, height: 54 }),
  );
});

test("长按钮在 360 390 430 宽度都不会越界", () => {
  for (const width of [328, 358, 398]) {
    for (let step = 0; step < 16; step += 1) {
      const result = getDodgePosition(step, { width, height: 290 }, { width: 156, height: 58 });
      assert.ok(result.x >= 0 && result.y >= 0);
      assert.ok(result.x + 156 <= width);
      assert.ok(result.y + 58 <= 290);
    }
  }
});
```

- [ ] **Step 3: Run focused tests and verify failure**

Run:

```bash
npx tsx --test tests/unit/state-machine.test.ts tests/unit/decline-dodge.test.ts tests/unit/invitation-progress-storage.test.ts
```

Expected: FAIL on the old `DeclineStep` upper bound, old loop, and missing geometry module.

- [ ] **Step 4: Implement decline-step progression**

In `src/lib/state-machine.ts`:

```ts
export type DeclineStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export const nextDeclineStep = (step: DeclineStep): DeclineStep =>
  (step === 15 ? 12 : step + 1) as DeclineStep;
```

Use `nextDeclineStep(state.declineStep)` in `DECLINE_PLAY`. Update storage validation to accept integers `0` through `15`.

- [ ] **Step 5: Implement deterministic safe-point geometry**

Create `src/lib/decline-dodge.ts`:

```ts
export type ElementSize = { width: number; height: number };
export type DodgePosition = { x: number; y: number; rotate: number };

export const DODGE_SAFE_POINTS = [
  { x: 0.68, y: 0.78, rotate: 2 },
  { x: 0.96, y: 0.58, rotate: 4 },
  { x: 0.72, y: 0.08, rotate: -3 },
  { x: 0.36, y: 0.23, rotate: 2 },
  { x: 0.02, y: 0.48, rotate: -4 },
  { x: 0.08, y: 0.88, rotate: 3 },
  { x: 0.46, y: 0.68, rotate: -2 },
  { x: 0.94, y: 0.9, rotate: 4 },
  { x: 0.6, y: 0.42, rotate: -3 },
  { x: 0.04, y: 0.06, rotate: 3 },
  { x: 0.88, y: 0.28, rotate: -2 },
  { x: 0.25, y: 0.84, rotate: 2 },
] as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const getDodgePosition = (
  step: number,
  bounds: ElementSize,
  button: ElementSize,
): DodgePosition => {
  const point = DODGE_SAFE_POINTS[step % DODGE_SAFE_POINTS.length];
  const maxX = Math.max(0, bounds.width - button.width);
  const maxY = Math.max(0, bounds.height - button.height);
  return {
    x: clamp(point.x * maxX, 0, maxX),
    y: clamp(point.y * maxY, 0, maxY),
    rotate: point.rotate,
  };
};
```

- [ ] **Step 6: Run focused tests**

Run:

```bash
npx tsx --test tests/unit/state-machine.test.ts tests/unit/decline-dodge.test.ts tests/unit/invitation-progress-storage.test.ts
```

Expected: all focused tests pass.

## Task 4: Build the reusable scrapbook visual primitives

**Files:**
- Create: `src/components/ui/ScrapbookFrame.tsx`
- Create: `src/components/ui/FlirtNote.tsx`
- Create: `src/components/mascot/MascotMoment.tsx`
- Create: `src/components/ui/FoodChoiceCard.tsx`
- Create: `src/components/ui/PlanSummaryCard.tsx`
- Modify: `src/components/mascot/Mascot.tsx`
- Modify: `src/components/ui/FoodIcon.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add the final design tokens and global texture**

Replace the top-level variables in `src/app/globals.css` with:

```css
:root {
  --strawberry-milk: #f8cfdb;
  --folder-pink: #efa2b7;
  --cream-paper: #fff9ed;
  --heart-rose: #ed3f78;
  --coral-pink: #ff6e8c;
  --note-yellow: #f4cf5e;
  --note-mint: #a8dfd3;
  --note-blue: #a8d5ef;
  --note-lavender: #d0c3e9;
  --ink: #1c1719;
  --muted: #74636a;
  --hard-shadow: 0 5px 0 var(--ink);
  --paper-texture: url("/textures/paper-noise.svg");
  --font-sans: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  /* Temporary aliases keep old scenes readable during incremental migration. */
  --pink-bg: var(--strawberry-milk);
  --pink: var(--coral-pink);
  --pink-dark: var(--heart-rose);
  --card: var(--cream-paper);
  --yellow: var(--note-yellow);
  --mint-wash: var(--note-mint);
}
```

Set `html` and `body` background to `var(--strawberry-milk)` and overlay `var(--paper-texture)`. Preserve focus-visible and reduced-motion rules.

- [ ] **Step 2: Create `ScrapbookFrame`**

Create `src/components/ui/ScrapbookFrame.tsx`:

```tsx
import type { ReactElement, ReactNode } from "react";

export type ScrapbookVariant = "intro" | "confirm" | "schedule" | "food" | "submitting" | "success" | "shared" | "legacy";

export function ScrapbookFrame({ variant, label, children, className = "", decorations }: {
  variant: ScrapbookVariant;
  label?: string;
  children: ReactNode;
  className?: string;
  decorations?: ReactNode;
}): ReactElement {
  return (
    <section className={`scrapbook scrapbook--${variant} ${className}`.trim()} aria-live="polite">
      <div className="scrapbook__folder" aria-hidden="true" />
      {label ? <div className="scrapbook__label">{label}</div> : null}
      <span className="scrapbook__clip" aria-hidden="true">⌕</span>
      <div className="scrapbook__decorations" aria-hidden="true">{decorations}</div>
      <div className="scrapbook__paper">{children}</div>
    </section>
  );
}
```

CSS requirements: pink folder bottom layer, cream torn-paper content layer, fixed clip path, no decorative pointer events, min-height matching current mobile stage, maximum six decorations.

- [ ] **Step 3: Create `FlirtNote`**

Create `src/components/ui/FlirtNote.tsx` with fixed tone and live-region API:

```tsx
import type { ReactElement, ReactNode } from "react";

export type FlirtNoteTone = "cream" | "pink" | "mint" | "yellow" | "blue" | "lavender";
export type FlirtNoteKind = "speech" | "scribble" | "feedback";

export function FlirtNote({ children, tone = "cream", kind = "speech", live = false, className = "" }: {
  children: ReactNode;
  tone?: FlirtNoteTone;
  kind?: FlirtNoteKind;
  live?: boolean;
  className?: string;
}): ReactElement {
  return <div className={`flirt-note flirt-note--${tone} flirt-note--${kind} ${className}`.trim()} role={live ? "status" : undefined}>{children}</div>;
}
```

- [ ] **Step 4: Upgrade mascot rendering and create `MascotMoment`**

Export `MascotMood` from config and use it in `Mascot.tsx`. Remove the global square-avatar assumption; keep `next/image`, `useReducedMotion`, and mood-specific motion presets. Track `currentSrc` in local state, reset it when `mood` changes, and switch to `mascot.fallbackSrc` in the image `onError` handler so the original six files remain the runtime fallback.

Create `src/components/mascot/MascotMoment.tsx`:

```tsx
import { Mascot } from "./Mascot";
import { FlirtNote, type FlirtNoteTone } from "@/components/ui/FlirtNote";
import type { MascotMood } from "@/config/invitation";

export function MascotMoment({ mood, note, size = "large", align = "right", noteTone = "mint", live = false, priority = false, className = "" }: {
  mood: MascotMood;
  note: string;
  size?: "medium" | "large" | "hero";
  align?: "left" | "center" | "right";
  noteTone?: FlirtNoteTone;
  live?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`mascot-moment mascot-moment--${size} mascot-moment--${align} ${className}`.trim()}>
      <Mascot mood={mood} priority={priority} />
      <FlirtNote tone={noteTone} live={live}>{note}</FlirtNote>
    </div>
  );
}
```

- [ ] **Step 5: Create `FoodChoiceCard` with image fallback**

Export `FoodIconName` from `FoodIcon.tsx` and ensure all nine new IDs resolve. Create `FoodChoiceCard.tsx` using `next/image`, `aria-pressed`, `data-testid`, and a local `imageFailed` boolean. On failure render `<FoodIcon name={option.id} />`; do not render Emoji as the primary asset.

Add a dedicated `snacks` branch before the final surprise fallback; it must draw a paper tray with three small skewers. Do not allow `snacks` to fall through to the surprise suitcase. Keep the existing `hunan`, `western`, and `dessert` branches.

The button API must be:

```tsx
export function FoodChoiceCard({ option, selected, onSelect }: {
  option: FoodOption;
  selected: boolean;
  onSelect: (id: FoodId) => void;
})
```

Selected cards add class `is-selected` and a visible `就它了！` stamp.

- [ ] **Step 6: Create the shared pass card**

Create `src/components/ui/PlanSummaryCard.tsx` accepting `{ date, time, activityId, note, title, kicker, subtitle, status, passNote, testId }`. It must render:

- `约会通行证 · 已批准` kicker,
- date/time/menu/note ticket grid,
- `APPROVED` stamp,
- large cool mascot,
- default note `到时候见。以及，我会早点到。`.

`subtitle`, `status`, and `passNote` are visible text blocks inside the pass, not optional data that may be silently dropped. Success passes `copy.success.body`, `copy.success.status`, and `copy.success.passNote`; Shared passes its own title/hint and the same pass-note sentence.

Use `getActivityLabel` and `getTimeLabel` inside this component so Success and Shared do not duplicate mappings.

- [ ] **Step 7: Lint the new primitives without running the premature full type gate**

Run:

```bash
npx eslint src/components/ui/ScrapbookFrame.tsx src/components/ui/FlirtNote.tsx src/components/ui/FoodChoiceCard.tsx src/components/ui/PlanSummaryCard.tsx src/components/mascot/Mascot.tsx src/components/mascot/MascotMoment.tsx
```

Expected: zero ESLint errors in the new files. Do not run the full `tsc` gate yet: Task 3 intentionally expands `DeclineStep` before Intro migrates from its old six-position local tuple. The full type gate resumes after Intro is migrated in Task 5.

## Task 5: Rebuild the intro and second-confirm scenes

**Files:**
- Modify: `src/components/scenes/IntroScene.tsx`
- Modify: `src/components/scenes/ConfirmScene.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/e2e/invitation.spec.ts`

- [ ] **Step 1: Update the E2E expectations before implementation**

Change the first heading expectation to `请批准一场蓄谋已久的见面`. Add stable test IDs `decline-arena` and `decline-aside`, plus `data-dodge-position` on the button. Extend the touch loop to 20 triggers and assert steps:

```ts
expect(steps).toEqual(["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","12","13","14","15","12"]);
```

For every trigger, compare the button and `decline-arena` bounding boxes and prove the button remains inside the arena, not merely inside the viewport. Assert the first 12 `data-dodge-position` values are unique. Assert `page.getByTestId("decline-aside")` contains the current mascot note.

Add a behavior assertion for the visual story:

```ts
await expect(page.getByTestId("intro-mascot")).toHaveAttribute("data-mood", "serious");
await page.getByTestId("decline-action").dispatchEvent("pointerdown", { pointerType: "touch" });
await expect(page.getByTestId("intro-mascot")).toHaveAttribute("data-mood", "hunter");
await expect(page.getByTestId("dodge-trail")).toBeVisible();
```

Replace the synthetic keyboard click with real input: focus the button, press `Enter`, wait past the 260ms debounce, press `Space`, and assert both key presses advance the step.

- [ ] **Step 2: Run the focused E2E and verify failure**

Run:

```bash
npx playwright test tests/e2e/invitation.spec.ts -g "不要按钮连续逃跑"
```

Expected: FAIL because the current title, six-step loop, and old markup remain.

- [ ] **Step 3: Rebuild `IntroScene` with measured button geometry**

Keep the existing `approveTimerRef`, 260ms debounce, desktop `pointerenter`, touch/pen `pointerdown`, and keyboard `detail === 0`. Replace fixed button constants with two `ResizeObserver`s: one for the interaction area and one for the actual decline button. Compute position with `getDodgePosition(declineStep, bounds, buttonSize)`.

Use:

```ts
const declineCopy = invitationConfig.copy.intro.declineSteps[declineStep];
```

Render `ScrapbookFrame`, approval stamp, one fading dashed trail keyed by `declineStep`, main button, and moving decline button. The mascot is `serious` only at step 0 and switches to `hunter` after the first escape. Set `data-testid="intro-mascot"` plus `data-mood`, `data-testid="dodge-trail"`, `data-testid="decline-arena"` on the activity area, `data-testid="decline-aside"` on the live note, and `data-dodge-position={declineStep % 12}` on the button. Set its visible label and `aria-label` to `declineCopy.buttonLabel`.

- [ ] **Step 4: Rebuild `ConfirmScene`**

Use the approved `审批异常提醒` copy, surprised `MascotMoment`, cream torn paper, pink confetti, and the existing 280ms confirmation timer. Preserve `data-testid="confirm-approval"` and the slip callback.

- [ ] **Step 5: Run focused unit and E2E checks**

Run:

```bash
npm test
npx playwright test tests/e2e/invitation.spec.ts -g "不要按钮|桌面靠近|场景切换"
npx tsc --noEmit
npm run lint
```

Expected: all selected tests pass with 20 sequential dodges, no arena or viewport overflow, and zero type/lint errors.

## Task 6: Rebuild date and time selection as a scrapbook clue page

**Files:**
- Modify: `src/components/scenes/ScheduleScene.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/e2e/invitation.spec.ts`
- Modify: `tests/e2e/visual.spec.ts`

- [ ] **Step 1: Change tests from select to time tickets**

Update helper `chooseSchedule`:

```ts
await page.getByTestId("date-input").fill(date);
await page.getByTestId("time-option-19:00").click();
await page.getByTestId("schedule-next").click();
```

Add an assertion that exactly three elements matching `[data-testid^="time-option-"]` exist and the selected ticket has `aria-pressed="true"`.

Add the incomplete-schedule E2E contract:

```ts
await expect(page.getByTestId("schedule-next")).toBeDisabled();
await page.getByTestId("date-input").fill(getLocalDate(7));
await expect(page.getByTestId("schedule-next")).toBeDisabled();
await page.getByTestId("time-option-19:00").click();
await expect(page.getByTestId("schedule-next")).toBeEnabled();
```

- [ ] **Step 2: Run the schedule E2E and verify failure**

Run:

```bash
npx playwright test tests/e2e/invitation.spec.ts -g "愿意后|刷新后恢复"
```

Expected: FAIL because `time-option-19:00` does not exist.

- [ ] **Step 3: Replace the select with three accessible tickets**

Keep the native date input and note textarea. Render time options as:

```tsx
<div className="time-ticket-grid" role="group" aria-label="约会时间">
  {invitationConfig.timeOptions.map((option) => (
    <button
      type="button"
      key={option.value}
      data-testid={`time-option-${option.value}`}
      className={`time-ticket ${state.time === option.value ? "is-selected" : ""}`}
      aria-pressed={state.time === option.value}
      onClick={() => onEvent("TIME", option.value)}
    >
      <strong>{option.label}</strong>
      <span>{option.flirt}</span>
    </button>
  ))}
</div>
```

Show a live `FlirtNote` after date/time selection. Preserve `isScheduleComplete`, min-date calculation, note max length, back action, and `data-testid="schedule-next"`.

- [ ] **Step 4: Apply the calendar-paper layout**

Use `ScrapbookFrame variant="schedule"`, label `心动线索 · 第 1 项`, hunter mascot, cream calendar paper, yellow selected ticket, and the approved title/subtitle. Ensure every ticket remains at least 44px tall.

- [ ] **Step 5: Run schedule tests and type checks**

Run:

```bash
npm test
npx playwright test tests/e2e/invitation.spec.ts -g "愿意后|刷新后恢复|场景切换"
npx tsc --noEmit
```

Expected: all pass.

## Task 7: Build the illustrated 3×3 menu with explicit confirmation

**Files:**
- Modify: `src/components/scenes/FoodScene.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/e2e/invitation.spec.ts`
- Modify: `tests/e2e/visual.spec.ts`

- [ ] **Step 1: Write the failing explicit-submit E2E**

Replace the old ten-card/auto-submit assertions with:

```ts
await expect(page.locator('[data-testid^="food-"]')).toHaveCount(9);
await page.getByTestId("food-hotpot").click();
await expect(page.getByText("这次见面，得热气腾腾一点。")).toBeVisible();
await expect(page.getByText("正在把心动写进计划…")).toHaveCount(0);
await page.getByTestId("food-dessert").click();
await expect(page.getByTestId("food-dessert")).toHaveAttribute("aria-pressed", "true");
const illustrations = page.locator('img[data-food-illustration]');
await expect(illustrations).toHaveCount(9);
await expect.poll(() => illustrations.evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
await page.getByTestId("submit-plan").click();
await expect(page.getByText("正在把心动写进计划…")).toBeVisible();
```

- [ ] **Step 2: Run focused E2E and verify failure**

Run:

```bash
npx playwright test tests/e2e/invitation.spec.ts -g "愿意后经二次确认"
```

Expected: FAIL on count 9, feedback, and missing `submit-plan`.

- [ ] **Step 3: Remove auto-submit from `FoodScene`**

Delete `isChoosing`, `timerRef`, the cleanup effect, and the 480ms timeout. On card click call only `onSelect(foodId)`. Find the selected option once:

```ts
const selectedOption = invitationConfig.foodOptions.find((option) => option.id === selected) ?? null;
```

Render a chef `MascotMoment` beside the title, nine `FoodChoiceCard`s, one live `FlirtNote` for `selectedOption.feedback`, and:

```tsx
<ArchiveButton data-testid="submit-plan" disabled={!selected} onClick={onSubmit}>
  {copy.submit}
</ArchiveButton>
```

Keep the back button usable before submission.

- [ ] **Step 4: Apply the rich paper-card layout**

Use a three-column grid at 360–430px, different tone classes from config, 72–96px food illustrations, name and tagline, selected rose outline, raised shadow, and `就它了！` stamp. No card may rely on Emoji for its main visual.

Add `data-food-illustration` to each successfully loaded `<img>`. Add `data-testid={`food-${option.id}-fallback`}` to the SVG fallback wrapper. To exercise Next Image failure in E2E, route `**/_next/image?*`, inspect `new URL(route.request().url()).searchParams.get("url")`, abort only when it equals `/food/hotpot.png`, and continue all other requests. Reload the menu state, then assert `food-hotpot-fallback` is visible and the card remains selectable.

- [ ] **Step 5: Run menu and failure-retry tests**

Update both hidden auto-submit assumptions before running:

```ts
await page.getByTestId("food-hotpot").click();
await page.getByTestId("submit-plan").click();
```

Use that sequence in the write-failure test and the initial SUBMITTING-refresh setup. After refresh, assert `food-hotpot` still has `aria-pressed="true"`, wait two seconds and prove no submitting or success heading appears, then click `submit-plan` explicitly.

Run:

```bash
npx playwright test tests/e2e/invitation.spec.ts -g "愿意后|提交写入失败|提交中刷新"
```

Expected: selection is editable, submission happens only after CTA, retry retains the chosen food.

## Task 8: Rebuild submitting, success, shared, and legacy compatibility scenes

**Files:**
- Create: `src/components/scenes/SubmittingScene.tsx`
- Create: `src/components/scenes/SuccessScene.tsx`
- Modify: `src/components/scenes/SharedPlanScene.tsx`
- Modify: `src/components/scenes/ReviewScene.tsx`
- Modify: `src/components/scenes/DeclineScene.tsx`
- Modify: `src/components/scenes/InvitationFlow.tsx`
- Delete: `src/components/scenes/SubmitSuccessScene.tsx`
- Delete: `src/components/scenes/SceneFrame.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Extract submitting without changing adapter behavior**

Move the existing submission promise/ref, retry, and active cleanup logic into `SubmittingScene.tsx`. Replace only presentation: courier mascot and approved copy; on error use surprised mascot and `不是反悔，是网络比我还紧张。`. Keep `data-testid="retry-submit"`.

- [ ] **Step 2: Extract success and reuse `PlanSummaryCard`**

Move share/clipboard state into `SuccessScene.tsx`. Render the shared `PlanSummaryCard` with `activityId={state.foodId ?? "surprise"}`, `subtitle={copy.body}`, `status={copy.status}`, and `passNote={copy.passNote}`. Keep `navigator.share`, clipboard fallback, print, reset, and `data-testid="share-plan"`; move all status strings to config.
Pass `testId="plan-pass"` on the local success card so print layout has a stable target.
Set `data-testid="save-pass"` on the print action and `data-testid="revisit-plan"` on reset. In E2E, stub `navigator.clipboard.writeText` and `window.print`; click share and assert the copied-status text, click save and assert the print stub ran once, then click revisit and assert the intro heading is visible.

- [ ] **Step 3: Migrate shared plan**

Change `SharedPlanScene.tsx` to import `PlanSummaryCard` from `@/components/ui/PlanSummaryCard`. Pass `activityId={plan.activityId}` and the shared title/config. Ensure `data-testid="shared-plan-card"` remains.

In E2E, construct a genuinely old link without `createSharePlanUrl` normalization:

```ts
const legacyPlan = Buffer.from(JSON.stringify({
  date: legacyDate,
  time: "20:30",
  activityId: "pizza",
}), "utf8").toString("base64url");
await page.goto(`/?plan=${legacyPlan}`);
await expect(page.getByTestId("shared-plan-card")).toBeVisible();
await expect(page.getByText("西餐")).toBeVisible();
```

- [ ] **Step 4: Migrate legacy compatibility pages**

Keep `REVIEW`, `SERIOUS_CHOICE`, and `DECLINED` phases for old saved state, but replace old `SceneFrame` with `ScrapbookFrame` and use the new primitives. Do not add these pages to the new primary flow.

- [ ] **Step 5: Update flow imports and remove obsolete files**

In `InvitationFlow.tsx`, import Submitting and Success from their new files. Keep the scene switch and focus-follow logic unchanged. Run:

```bash
rg -n 'from .*SceneFrame|from .*SubmitSuccessScene' src \
  --glob '!**/SceneFrame.tsx' \
  --glob '!**/SubmitSuccessScene.tsx'
```

Expected before delete: no remaining imports. Then delete the two obsolete files.

- [ ] **Step 6: Update metadata**

In `src/app/layout.tsx`, set the title to `心动档案局｜一份只对你生效的见面申请` and description to `请批准一场蓄谋已久、又有点不好意思的见面。`.

- [ ] **Step 7: Add print rules**

In `globals.css` print media, hide folders, decoration, action buttons, and mascot motion while retaining the complete ticket and approved stamp. Remove fixed min-heights and shadows that would crop the pass.

- [ ] **Step 8: Run the full functional test suite**

First remove stale selectors and copy assertions:

```bash
rg -n '可以和我|等下，你真的点了愿意|我们吃点什么|正在写进约会计划|真开心你没有拒绝|约会计划没写进去|time-select|喝杯咖啡|toHaveCount\(10\)' tests
```

Expected: zero matches. Update each remaining match to the approved copy, stable test IDs, or the new nine-card contract before running the suite.

Run:

```bash
npm test
npm run lint
npx tsc --noEmit
npx playwright test tests/e2e/invitation.spec.ts
```

Expected: zero failures and zero lint/type errors.

## Task 9: Refresh visual coverage and inspect every required viewport

**Files:**
- Modify: `tests/e2e/visual.spec.ts`
- Replace: `public/screenshots/*.png` generated by this test

- [ ] **Step 1: Update the visual journey**

The test must capture the full journey at 390×844:

1. `01-intro-390x844.png`
2. `02-dodge-1-390x844.png`
3. `03-dodge-8-390x844.png`
4. `04-dodge-15-390x844.png`
5. `05-confirm-390x844.png`
6. `06-schedule-390x844.png`
7. `07-food-390x844.png`
8. `08-food-selected-390x844.png`
9. `09-submitting-390x844.png`
10. `10-success-390x844.png`
11. `11-shared-390x844.png`

Use `time-option-19:00` and click `submit-plan` after the selected-food screenshot.

For each of 360×800, 430×932, and 1280×900, also capture `intro`, `dodge-15`, `confirm`, `schedule`, `food`, `food-selected`, and `success` under `public/screenshots/strawberry-milk/<width>x<height>/`. Seed valid localStorage state for static scene screenshots where that avoids repeated 1.65-second submits; do not seed the main 390 functional journey. Before every screenshot run `document.fonts.ready`, emulate reduced motion, and call the overflow assertion.

Add a print screenshot: emulate `media: "print"` on success, assert the actions are hidden and `[data-testid="plan-pass"]` has a non-cropped bounding box, then write `public/screenshots/strawberry-milk/print-success.png`.

- [ ] **Step 2: Add responsive and visual invariants**

For 360×800, 390×844, 430×932, and 1280×900 assert:

```ts
await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
await expect(page.locator("body")).toHaveCSS("background-color", "rgb(248, 207, 219)");
```

On the menu page assert all nine cards have non-zero bounding boxes, all nine illustrations are loaded or visibly using their SVG fallback, and every card is inside the viewport width. On every dodge screenshot assert the moving button is inside the interaction region.

- [ ] **Step 3: Run the visual suite**

Run:

```bash
npx playwright test tests/e2e/visual.spec.ts
```

Expected: PASS with no console errors and all listed screenshots written.

- [ ] **Step 4: Inspect screenshots visually**

Open the key intro, dodge-15, food-selected, success, 360px success, 430px success, and desktop intro images. Verify:

- pink covers the majority of the page;
- yellow is only an accent;
- character occupies 25%–40% of the scene and is not a tiny avatar;
- title, task, role note, and CTA are visually distinct;
- menu art is readable and all nine cards fit;
- no paper, stamp, mascot, button, or text is cropped;
- final pass prints as a self-contained card.

If a screenshot fails any item, patch the relevant CSS and rerun the visual suite before proceeding.

## Task 10: Final verification and requirement audit

**Files:**
- Read: approved design spec
- Read: all modified source and test files

- [ ] **Step 1: Run every automated check from a clean process**

Run sequentially:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npm run e2e
```

Expected: all commands exit 0.

- [ ] **Step 2: Audit the nine completion requirements**

Record evidence for each requirement from the spec:

1. every primary scene uses the strawberry-milk scrapbook frame;
2. six new large mascot poses exist and render;
3. 20-trigger E2E proves 16-level continuous dodge, 12 safe positions, and the 12–15 copy cycle;
4. food page renders nine illustrated cards;
5. food can be reselected and requires explicit submit;
6. every scene takes dual-voice copy from config;
7. submit, recovery, retry, sharing, print, and legacy links pass;
8. all automated checks pass;
9. all required screenshots pass manual inspection.

Treat missing or indirect evidence as incomplete and keep fixing until all nine are directly proven.

- [ ] **Step 3: Open the final local app**

Start or reuse `npm run dev -- --port 3000`, open `http://localhost:3000`, and walk through the invitation once with touch-style dodge, selected date/time, two different food choices, explicit submit, success, and share fallback.

- [ ] **Step 4: Hand off exact results**

Report modified files, generated assets, test command results, screenshot paths, and the local URL. Because the directory has no Git repository, explicitly state that no commit was created.
