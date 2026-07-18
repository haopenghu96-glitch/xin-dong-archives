# Heart Pig Comic Archive Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把现有约会邀请完整升级为「心动小猪恋爱档案漫画」：专属重绘小猪、16 级连续逃跑、3×3 食物贴纸墙、三层含蓄情话和约会批准终章，同时保留提交、恢复、分享、打印与历史状态兼容。

**Architecture:** 保留现有状态机、localStorage key、提交适配器、分享 payload 与 `InvitationFlow` 场景调度。数据层集中菜单迁移、追逐文案和角色资源；纯函数处理 12 个安全位置与四段漫画阶段；表现层以 `SceneFrame`、`MascotMoment`、`SpeechBubble`、`ComicBurst`、`FoodChoiceCard` 和 `PlanSummaryCard` 组合 75% 稳定档案系统与 25% 漫画高潮。

**Tech Stack:** Next.js 16 App Router、React 19、TypeScript strict、Framer Motion、原生 CSS、Next Image、Node test runner、Playwright、OpenAI image generation。

**Status:** 已完成规格覆盖、占位符和类型一致性自检，等待选择执行方式。

---

## Execution constraints

- 工程路径：`/Users/mima0000/Desktop/dating app`。
- 当前目录不是 Git 仓库。不要执行 `git init`；本计划用每个任务后的测试检查点代替 commit。
- 设计真源：`docs/superpowers/specs/2026-07-14-heart-pig-comic-archive-redesign-design.md`。
- 不新增 npm 依赖，不更换框架，不修改 localStorage key，不修改分享 payload 字段。
- 所有人工文件修改使用 `apply_patch`；图片资产由图像生成工具创建，不用 Python 抠图或改图。
- 三张用户参考图只作角色语言参考，不直接裁切、不保留水印、不移动原文件。
- 正式商业发布前需由项目方确认参考角色授权边界；实现阶段仍按“项目专属重绘、进一步统一细节”的规格执行。
- 当前实测基线：单元测试 38/38、邀请流程 E2E 10/10，视觉 E2E 另 1 条；lint 与 `npx tsc --noEmit` 通过。

## File map

### Create

- `public/mascot/heart-pig/serious-review.png`
- `public/mascot/heart-pig/surprised-reaction.png`
- `public/mascot/heart-pig/hunter-chase.png`
- `public/mascot/heart-pig/hunter-ready.png`
- `public/mascot/heart-pig/hunter-lunge.png`
- `public/mascot/heart-pig/hunter-miss.png`
- `public/mascot/heart-pig/chef-expectation.png`
- `public/mascot/heart-pig/courier-envelope.png`
- `public/mascot/heart-pig/cool-approved.png`
- `public/food/hotpot.png`
- `public/food/sushi.png`
- `public/food/bbq.png`
- `public/food/hunan.png`
- `public/food/western.png`
- `public/food/dessert.png`
- `public/food/coffee.png`
- `public/food/snacks.png`
- `public/food/surprise.png`
- `src/lib/food-migration.ts`
- `src/lib/decline-dodge.ts`
- `src/components/ui/SpeechBubble.tsx`
- `src/components/ui/ComicBurst.tsx`
- `src/components/ui/FoodChoiceCard.tsx`
- `src/components/ui/PlanSummaryCard.tsx`
- `src/components/mascot/MascotMoment.tsx`
- `src/components/mascot/DodgeComicBeat.tsx`
- `src/components/scenes/SubmittingScene.tsx`
- `src/components/scenes/SuccessScene.tsx`
- `tests/unit/invitation-config.test.ts`
- `tests/unit/food-migration.test.ts`
- `tests/unit/decline-dodge.test.ts`

### Modify

- `src/config/invitation.ts`
- `src/lib/state-machine.ts`
- `src/lib/invitation-progress-storage.ts`
- `src/lib/share-plan.ts`
- `src/components/mascot/Mascot.tsx`
- `src/components/scenes/SceneFrame.tsx`
- `src/components/scenes/IntroScene.tsx`
- `src/components/scenes/ConfirmScene.tsx`
- `src/components/scenes/ScheduleScene.tsx`
- `src/components/scenes/FoodScene.tsx`
- `src/components/scenes/ReviewScene.tsx`
- `src/components/scenes/DeclineScene.tsx`
- `src/components/scenes/SharedPlanScene.tsx`
- `src/components/scenes/InvitationFlow.tsx`
- `src/components/ui/ArchivePrimitives.tsx`
- `src/components/ui/FoodIcon.tsx`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `tests/unit/state-machine.test.ts`
- `tests/unit/invitation-progress-storage.test.ts`
- `tests/unit/share-plan.test.ts`
- `tests/e2e/invitation.spec.ts`
- `tests/e2e/visual.spec.ts`

### Delete only after references are removed

- `src/components/scenes/SubmitSuccessScene.tsx`

### Preserve unchanged as rollback evidence

- `public/mascot/serious-review.png`
- `public/mascot/surprised-reaction.png`
- `public/mascot/hunter-chase.png`
- `public/mascot/chef-expectation.png`
- `public/mascot/courier-envelope.png`
- `public/mascot/cool-approved.png`
- `public/screenshots/*` existing files; new screenshots use `pig-*` names and do not overwrite old evidence.

## Task 1: Generate and verify the exclusive visual assets

**Files:**
- Create: `public/mascot/heart-pig/*.png` listed above
- Create: `public/food/*.png` listed above
- Preserve: `public/mascot/*.png`

- [ ] **Step 1: Read the image generation instructions before any asset action**

Read `/Users/mima0000/.codex/skills/.system/imagegen/SKILL.md` completely. Use `view_image` for inspection and `image_gen__imagegen` for generation or editing. Do not use Python, screenshot cropping, background-removal scripts, or direct extraction from the sticker sheets.

- [ ] **Step 2: Inspect all three references at original detail**

Inspect these exact files with `view_image(detail="original")`:

```text
/Users/mima0000/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_o1neojn69g7522_f380/temp/RWTemp/2026-07/9e20f478899dc29eb19741386f9343c8/68f1a60fe4285a848abb6a78a7cbfbb0.jpg
/Users/mima0000/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_o1neojn69g7522_f380/temp/RWTemp/2026-07/9e20f478899dc29eb19741386f9343c8/e1ba83211c624c1e4da98c3bb409efc0.jpg
/Users/mima0000/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_o1neojn69g7522_f380/temp/RWTemp/2026-07/9e20f478899dc29eb19741386f9343c8/f9b7e4aa3f0fb3edb95452244d6b8f8f.jpg
```

Record the fixed identity before generating: pale pink one-piece body, small triangular ears, short limbs, thin curly tail, large deep-pink oval snout, two dark vertical nostrils, round blush, cocoa hand-drawn outline, cream sticker edge, small dot eyes at rest and exaggerated eyes only at comic peaks.

Prepare the output directories before the first generation:

```bash
mkdir -p public/mascot/heart-pig public/food tmp/imagegen
```

- [ ] **Step 3: Generate the master `serious-review.png`**

Use all three sticker sheets as references and this exact prompt:

```text
Create an original, app-exclusive “Heart Pig Archive Clerk” mascot derived from the broad visual language of the supplied pink pig sticker references, without copying any single sticker composition. One pale strawberry-milk pink, short and round pig with head and body nearly merged, two tiny triangular ears, short bean-like arms and legs, a thin curly tail, a large dark-rose oval snout with two vertical cocoa nostrils, small dot eyes, round blush, and an irregular cocoa-brown hand-drawn outline. The pig hugs a blank clipboard with one small heart symbol and tries to look serious while suppressing a shy smile. Flat pastel marker and light paper grain, cream-white sticker border, no fur, no antennae, no tie. Single complete character centered, all limbs and clipboard visible. Perfectly flat solid #00ff00 chroma-key background for later removal; the background must be uniform with no shadow, gradient, texture, floor, reflection or lighting variation. Do not use #00ff00 inside the character. No cast shadow, no text, no logo, no watermark, no extra characters, no scene background. Use a square high-resolution canvas with consistent generous outer padding; the character’s longest side must stay under 82 percent of the canvas.
```

Copy the selected built-in output into `tmp/imagegen/serious-review-source.png`, then remove the chroma background and save the final asset as:

```text
public/mascot/heart-pig/serious-review.png
```

Run:

```bash
python "${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/remove_chroma_key.py" \
  --input tmp/imagegen/serious-review-source.png \
  --out public/mascot/heart-pig/serious-review.png \
  --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 220 --despill
```

Inspect it before continuing. Reject and regenerate if the snout is not dominant, nostrils are horizontal, the outline is pure black/heavy, the body looks furry, the clipboard contains words, or any edge is cropped.

- [ ] **Step 4: Generate the remaining eight character assets from the approved master**

Use `public/mascot/heart-pig/serious-review.png` as the primary identity reference. Keep the exact body, snout, ears, blush, outline, sticker edge, canvas, lighting and grain. Generate one file at a time with the following pose instruction appended to the master identity prompt:

| File | Exact pose instruction |
|---|---|
| `surprised-reaction.png` | Giant protruding comic eyes, both hands touching cheeks, two small coral exclamation marks, startled but delighted. |
| `hunter-chase.png` | Holding a heart-catching net and a small magnifying glass, leaning forward and tracking a moving button. |
| `hunter-ready.png` | Crouched with the heart-catching net aimed forward, focused dot eyes, one small mint question mark. |
| `hunter-lunge.png` | Lunging forward with giant eyes and tongue out, one arm stretching the net, dynamic blue speed marks. |
| `hunter-miss.png` | Lying flat after missing, net over the head, embarrassed dot eyes and one tiny sweat drop, pretending nothing happened. |
| `chef-expectation.png` | Wearing a cream chef hat, holding a noodle bowl, eyes happily closed while stealing one noodle. |
| `courier-envelope.png` | Running with a cream envelope sealed by a coral heart, one foot lifted, tiny paper scraps trailing behind. |
| `cool-approved.png` | Wearing a tiny butter-yellow crown or heart sunglasses, holding a blank approval stamp, celebrating with two small stars. |

Every prompt must repeat: perfectly flat solid `#00ff00` chroma-key background with no shadow/gradient/texture; never use `#00ff00` inside the subject; no text, logo or watermark; one complete pig only; longest side below 82% of the same square canvas. Copy each built-in source to `tmp/imagegen/<name>-source.png`, then run the same installed `remove_chroma_key.py` helper to write `public/mascot/heart-pig/<filename>`.

- [ ] **Step 5: Generate the nine food sticker assets**

Use the approved master pig only as a style reference; the pig must not appear in any food image. Use this fixed template:

```text
Create one app-exclusive food sticker illustration for a strawberry-milk pink dating archive: [SUBJECT]. Cocoa-brown irregular hand-drawn outline, flat pastel marker color, light paper grain, realistic recognizable food colors, cream-white sticker border, and no cast shadow. One complete food subject centered on a square canvas with generous padding. Perfectly flat solid #00ff00 chroma-key background for later removal; the background must be uniform with no shadow, gradient, texture, floor, reflection or lighting variation. Do not use #00ff00 inside the food. No person, no pig, no restaurant scene, no text, no logo, no watermark, no frame, no cropped plate or utensil. Match the line weight, grain and sticker edge of the supplied Heart Pig master asset.
```

Generate and save exactly:

| File | SUBJECT |
|---|---|
| `hotpot.png` | A steaming divided hotpot filled with sliced meat, vegetables and mushrooms. |
| `sushi.png` | A compact sushi and sashimi board with salmon nigiri and wasabi. |
| `bbq.png` | A tabletop grill with browned sliced meat, tongs and a little steam. |
| `hunan.png` | A Hunan food plate led by chopped chili fish and stir-fried pork with visible red peppers. |
| `western.png` | A steak plate with vegetables, a little pasta and cutlery. |
| `dessert.png` | A strawberry cream cake slice with berries. |
| `coffee.png` | A latte cup with heart foam art and two coffee beans. |
| `snacks.png` | A paper tray of skewers and bite-sized street snacks. |
| `surprise.png` | A closed mystery lunch case with one heart sticker and a separate question-mark charm. |

For every food image, copy the built-in source into `tmp/imagegen/<name>-source.png` and run the same `remove_chroma_key.py` command to write the final alpha PNG under `public/food/`.

- [ ] **Step 6: Verify file count, format, alpha and dimensions**

Run:

```bash
find public/mascot/heart-pig -maxdepth 1 -type f -name '*.png' -print | sort
find public/food -maxdepth 1 -type f -name '*.png' -print | sort
file public/mascot/heart-pig/*.png public/food/*.png
for file in public/mascot/heart-pig/*.png public/food/*.png; do sips -g pixelWidth -g pixelHeight -g hasAlpha "$file"; done
```

Expected: 9 pig PNGs and 9 food PNGs; all readable, all have alpha, all share one square pixel size, and all are at least 960×960. If the generation tool returns a larger consistent size, keep it; do not upscale with a script.

- [ ] **Step 7: Inspect every output visually**

Open all 18 assets with `view_image`. Verify no watermark, embedded wording, white rectangular background, cropped limb/prop, accidental second character or inconsistent snout. Compare the nine pig images side by side mentally against the fixed identity. Do not switch code configuration until all nine pig images pass.

## Task 2: Lock menu migration, copy and asset contracts

**Files:**
- Create: `src/lib/food-migration.ts`
- Create: `tests/unit/food-migration.test.ts`
- Create: `tests/unit/invitation-config.test.ts`
- Modify: `src/config/invitation.ts`
- Modify: `src/lib/invitation-progress-storage.ts`
- Modify: `src/lib/share-plan.ts`
- Test: `tests/unit/invitation-progress-storage.test.ts`
- Test: `tests/unit/share-plan.test.ts`

- [ ] **Step 1: Write failing migration and configuration tests**

Create `tests/unit/food-migration.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  CURRENT_FOOD_IDS,
  normalizeActivityId,
  normalizeFoodId,
} from "../../src/lib/food-migration";

test("当前九项 food id 保持不变", () => {
  for (const id of CURRENT_FOOD_IDS) assert.equal(normalizeFoodId(id), id);
});

test("旧十宫格食物 id 迁移到新九宫格", () => {
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

test("历史活动继续可读，未知活动返回 null", () => {
  for (const id of ["dinner", "walk", "exhibit"] as const) {
    assert.equal(normalizeActivityId(id), id);
  }
  assert.equal(normalizeActivityId("not-an-activity"), null);
});
```

Create `tests/unit/invitation-config.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { invitationConfig } from "../../src/config/invitation";
import { CURRENT_FOOD_IDS } from "../../src/lib/food-migration";

test("拒绝文案固定为 16 级且字段完整", () => {
  const steps = invitationConfig.copy.intro.declineSteps;
  assert.equal(steps.length, 16);
  assert.deepEqual(steps.map((item) => item.step), Array.from({ length: 16 }, (_, index) => index));
  for (const item of steps) {
    assert.ok(item.buttonLabel.length > 0);
    assert.ok(item.mascotNote.length > 0);
  }
});

test("菜单固定为 3x3 九项并拥有独立贴纸和反馈", () => {
  const foods = invitationConfig.foodOptions;
  assert.deepEqual(foods.map((item) => item.id), [...CURRENT_FOOD_IDS]);
  assert.equal(new Set(foods.map((item) => item.imageSrc)).size, 9);
  for (const food of foods) {
    assert.match(food.imageSrc, /^\/food\/.+\.png$/);
    assert.ok(food.tagline);
    assert.ok(food.feedback);
  }
});

test("六个核心 mood 与三个追逐 mood 全部使用新小猪目录", () => {
  const expected = [
    "serious",
    "surprised",
    "hunter",
    "hunterReady",
    "hunterLunge",
    "hunterMiss",
    "chef",
    "courier",
    "cool",
  ];
  assert.deepEqual(Object.keys(invitationConfig.mascots), expected);
  for (const mascot of Object.values(invitationConfig.mascots)) {
    assert.match(mascot.src, /^\/mascot\/heart-pig\/.+\.png$/);
    assert.match(mascot.fallbackSrc, /^\/mascot\/heart-pig\/.+\.png$/);
    assert.ok(mascot.alt);
  }
});
```

- [ ] **Step 2: Run the new tests and verify the intended failure**

Run:

```bash
npx tsx --test tests/unit/food-migration.test.ts tests/unit/invitation-config.test.ts
```

Expected: FAIL because `food-migration.ts`, 16-step copy, 9-item menu metadata and new mascot paths do not exist.

- [ ] **Step 3: Implement the independent migration module**

Create `src/lib/food-migration.ts`:

```ts
export const CURRENT_FOOD_IDS = [
  "hotpot",
  "sushi",
  "bbq",
  "hunan",
  "western",
  "dessert",
  "coffee",
  "snacks",
  "surprise",
] as const;

export type CurrentFoodId = (typeof CURRENT_FOOD_IDS)[number];

export const LEGACY_ACTIVITY_IDS = ["dinner", "walk", "exhibit"] as const;
export type LegacyActivityId = (typeof LEGACY_ACTIVITY_IDS)[number];

const currentFoodIds = new Set<string>(CURRENT_FOOD_IDS);
const legacyActivityIds = new Set<string>(LEGACY_ACTIVITY_IDS);

const LEGACY_FOOD_ID_MAP: Readonly<Record<string, CurrentFoodId>> = {
  pizza: "western",
  "dim-sum": "snacks",
  ramen: "snacks",
  mala: "hunan",
  crayfish: "hunan",
  skewers: "snacks",
};

export const normalizeFoodId = (value: unknown): CurrentFoodId | null => {
  if (typeof value !== "string") return null;
  if (currentFoodIds.has(value)) return value as CurrentFoodId;
  return LEGACY_FOOD_ID_MAP[value] ?? null;
};

export const normalizeActivityId = (
  value: unknown,
): CurrentFoodId | LegacyActivityId | null => {
  const foodId = normalizeFoodId(value);
  if (foodId) return foodId;
  return typeof value === "string" && legacyActivityIds.has(value)
    ? (value as LegacyActivityId)
    : null;
};
```

- [ ] **Step 4: Replace `src/config/invitation.ts` with the approved contract**

Use the following complete data shape. Keep all copy in this file; scenes must not duplicate these strings.

```ts
import {
  normalizeActivityId,
  type CurrentFoodId,
} from "@/lib/food-migration";

const declineSteps = [
  { step: 0, buttonLabel: "暂不批准", mascotNote: "拒绝键已就位，看起来不太安分。" },
  { step: 1, buttonLabel: "欸，等一下", mascotNote: "咻——它说还没做好被点中的准备。" },
  { step: 2, buttonLabel: "我再躲一下", mascotNote: "申请人没跑，按钮先跑了。" },
  { step: 3, buttonLabel: "这边也点不到", mascotNote: "点慢一点，小猪的网快追不上了。" },
  { step: 4, buttonLabel: "你怎么还追呀", mascotNote: "友情提示：追按钮，也有一点像追。" },
  { step: 5, buttonLabel: "再追就暧昧了", mascotNote: "档案局开始记录，但暂不作为证据。" },
  { step: 6, buttonLabel: "让我缓半秒", mascotNote: "按钮在喘气，小猪也在喘气。" },
  { step: 7, buttonLabel: "你其实在笑吧", mascotNote: "放心，表情不在采集范围。" },
  { step: 8, buttonLabel: "我快没地方跑了", mascotNote: "逃跑路线快用完，勇气倒多了一点。" },
  { step: 9, buttonLabel: "批准键在那边", mascotNote: "左边那个粉色的，看起来很适合你。" },
  { step: 10, buttonLabel: "再想我半秒嘛", mascotNote: "扑空！但只见一面，不急着把话都说完。" },
  { step: 11, buttonLabel: "追到这里很可疑", mascotNote: "到底是谁舍不得结束这段追逐？" },
  { step: 12, buttonLabel: "给你留个台阶", mascotNote: "点批准不算输，只算一起吃顿饭。" },
  { step: 13, buttonLabel: "我替你保密", mascotNote: "不会告诉别人，你追了这么久。" },
  { step: 14, buttonLabel: "好啦，不跑了", mascotNote: "按钮认输，小猪还在假装没扑空。" },
  { step: 15, buttonLabel: "…其实想见吧", mascotNote: "如果答案是愿意，轻轻点一下就好。" },
] as const;

const foodOptions = [
  { id: "hotpot", label: "火锅", imageSrc: "/food/hotpot.png", fallbackIcon: "hotpot", tone: "coral", tagline: "把拘谨一起煮开", feedback: "选火锅？那脸红就有借口了。" },
  { id: "sushi", label: "日料", imageSrc: "/food/sushi.png", fallbackIcon: "sushi", tone: "mint", tagline: "安静一点，多看你几眼", feedback: "安静的座位，也许更适合偷偷看你。" },
  { id: "bbq", label: "烤肉", imageSrc: "/food/bbq.png", fallbackIcon: "bbq", tone: "yellow", tagline: "我负责烤，你负责好看", feedback: "我会认真翻面，也会认真听你说话。" },
  { id: "hunan", label: "湘菜", imageSrc: "/food/hunan.png", fallbackIcon: "hunan", tone: "coral", tagline: "辣到脸红，刚好有借口", feedback: "脸红这件事，终于有合理解释。" },
  { id: "western", label: "西餐", imageSrc: "/food/western.png", fallbackIcon: "western", tone: "lavender", tagline: "认真约会，假装不紧张", feedback: "那我练习一下，怎么自然地帮你拉椅子。" },
  { id: "dessert", label: "甜品", imageSrc: "/food/dessert.png", fallbackIcon: "dessert", tone: "rose", tagline: "聊天不够甜，它来补位", feedback: "看来这次见面可以再甜一点。" },
  { id: "coffee", label: "咖啡", imageSrc: "/food/coffee.png", fallbackIcon: "coffee", tone: "cream", tagline: "先聊一杯，舍不得再续杯", feedback: "喝完舍不得走，就再点一杯。" },
  { id: "snacks", label: "小吃", imageSrc: "/food/snacks.png", fallbackIcon: "snacks", tone: "blue", tagline: "边走边吃，顺便并肩", feedback: "比起面对面，可以先从并肩走路开始。" },
  { id: "surprise", label: "交给你", imageSrc: "/food/surprise.png", fallbackIcon: "surprise", tone: "yellow", tagline: "把选择交给我，期待留给你", feedback: "我会偷偷把你放在第一顺位。" },
] as const;

export const invitationConfig = {
  requestNo: "DATE REQUEST NO.001",
  title: "请批准一场蓄谋已久的见面",
  motion: { page: 0.28, micro: 0.22, pressScale: 0.96 },
  timeOptions: [
    { value: "15:00", label: "下午 15:00", tagline: "阳光替我打掩护" },
    { value: "19:00", label: "晚上 19:00", tagline: "晚饭刚好，心动也刚好" },
    { value: "20:30", label: "饭后 20:30", tagline: "夜色负责保密" },
  ],
  copy: {
    intro: {
      label: "机密文件 · 仅对你生效",
      title: "请批准一场蓄谋已久的见面",
      subtitle: "我把“想见你”写成了申请表，免得当面又假装随便。",
      mascotNote: "嘘，他改了八遍，最后还是只敢写“有空吗”。",
      approve: "批准申请 ♥",
      declineSteps,
    },
    confirm: {
      label: "审批异常提醒",
      title: "等等，你真的批准了？",
      subtitle: "我连被拒绝后的体面台词都准备好了，结果你让我白练了。",
      mascotNote: "第一格装镇定，第二格心里已经放烟花。",
      approve: "嗯，是真的 ♥",
      slip: "刚刚手滑",
    },
    schedule: {
      label: "心动线索 · 第 1 项",
      title: "正在捕捉你的空闲时间",
      subtitle: "借我一天里的两个小时，剩下的期待我来负责。",
      dateLabel: "哪天适合偷偷见面？",
      timeLabel: "几点开始想你…不是，见你？",
      noteLabel: "给约会管理员留个暗号（可选）",
      notePlaceholder: "比如：想吃辣、想坐靠窗……",
      next: "抓到了，去选快乐 →",
      incomplete: "日期和时间选好后，就可以继续啦。",
    },
    food: {
      label: "快乐补给 · 第 2 项",
      title: "这次的快乐，吃什么？",
      subtitle: "你负责挑喜欢的，我负责把你喜欢的记住。",
      emptyFeedback: "先挑一张，小猪保证只偷看你的答案。",
      submit: "装进约会计划 ♥",
    },
    review: {
      label: "历史计划复核",
      title: "再看一眼约会计划",
      subtitle: "旧存档也换上了新的小猪封面。",
      submit: "确认约会",
    },
    decline: {
      label: "档案暂存",
      title: "好啦，不闹了。",
      body: "你可以慢慢想，也可以认真告诉我今天不方便。",
      return: "那我再看看邀请",
      today: "今天先不约",
      saved: "收到，等你哪天想见面了，这份档案还在。",
    },
    submitting: {
      label: "正在递交",
      title: "正在把心动写进计划…",
      subtitle: "别催，申请人正在假装这是一件很平常的事。",
      errorTitle: "约会计划没写进去",
      errorBody: "不是反悔，是网络比我还紧张。",
      retry: "再递一次申请",
    },
    success: {
      label: "约会通行证 · 已批准",
      title: "好啦，我们要见面了。",
      body: "这句话看起来很普通，但我已经偷偷开心了很久。",
      status: "申请人状态：表面镇定 / 实际心跳超速",
      mascotNote: "批准章盖下去了，嘴角也别收回去了。",
      hint: "凭此通行证，兑换一次很认真又不太好意思的见面。",
      share: "分享这份小秘密",
      save: "保存约会通行证",
      revisit: "再偷看一遍",
    },
    shared: {
      label: "共享约会通行证",
      title: "这份小秘密已经送到啦。",
      hint: "地点可以晚点再一起商量。",
      start: "我也要发起邀请 ♥",
    },
  },
  foodOptions,
  mascots: {
    serious: { src: "/mascot/heart-pig/serious-review.png", fallbackSrc: "/mascot/heart-pig/serious-review.png", alt: "抱着申请板努力装镇定的小猪" },
    surprised: { src: "/mascot/heart-pig/surprised-reaction.png", fallbackSrc: "/mascot/heart-pig/serious-review.png", alt: "捂着脸惊喜睁大眼的小猪" },
    hunter: { src: "/mascot/heart-pig/hunter-chase.png", fallbackSrc: "/mascot/heart-pig/serious-review.png", alt: "拿着捕心网追线索的小猪" },
    hunterReady: { src: "/mascot/heart-pig/hunter-ready.png", fallbackSrc: "/mascot/heart-pig/hunter-chase.png", alt: "举着捕心网认真瞄准的小猪" },
    hunterLunge: { src: "/mascot/heart-pig/hunter-lunge.png", fallbackSrc: "/mascot/heart-pig/hunter-chase.png", alt: "伸出捕心网向前扑的小猪" },
    hunterMiss: { src: "/mascot/heart-pig/hunter-miss.png", fallbackSrc: "/mascot/heart-pig/hunter-chase.png", alt: "扑空后被捕心网罩住的小猪" },
    chef: { src: "/mascot/heart-pig/chef-expectation.png", fallbackSrc: "/mascot/heart-pig/serious-review.png", alt: "戴厨师帽抱着面碗的小猪" },
    courier: { src: "/mascot/heart-pig/courier-envelope.png", fallbackSrc: "/mascot/heart-pig/serious-review.png", alt: "抱着爱心信封奔跑的小猪" },
    cool: { src: "/mascot/heart-pig/cool-approved.png", fallbackSrc: "/mascot/heart-pig/serious-review.png", alt: "举着批准章庆祝的小猪" },
  },
} as const;

export type FoodId = CurrentFoodId;
export type FoodOption = (typeof invitationConfig.foodOptions)[number];
export type MascotMood = keyof typeof invitationConfig.mascots;

export const legacyActivityLabels: Readonly<Record<string, string>> = {
  dinner: "一起吃饭",
  walk: "一起散步",
  exhibit: "看场展览",
};

export const getActivityLabel = (activityId: string) => {
  const normalized = normalizeActivityId(activityId);
  if (!normalized) return "一起见面";
  return invitationConfig.foodOptions.find((option) => option.id === normalized)?.label
    ?? legacyActivityLabels[normalized]
    ?? "一起见面";
};

export const getTimeLabel = (time: string) =>
  invitationConfig.timeOptions.find((option) => option.value === time)?.label ?? time;
```

- [ ] **Step 5: Update storage and share decoding to normalize old IDs**

In `src/lib/invitation-progress-storage.ts`, import `normalizeFoodId`, remove the config-derived `foodIds` set and replace the food validation branch with normalization:

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

In `src/lib/share-plan.ts`, import `normalizeActivityId`, remove `allowedActivities`, and normalize during decoding without changing the encoded payload keys:

```ts
import { invitationConfig } from "../config/invitation";
import { normalizeActivityId } from "./food-migration";

const decodeSharePlan = (value: unknown): SharePlan | null => {
  if (!value || typeof value !== "object") return null;
  const plan = value as Record<string, unknown>;
  if (
    typeof plan.date !== "string" ||
    typeof plan.time !== "string" ||
    typeof plan.activityId !== "string"
  ) return null;
  if (
    plan.date.length === 0 || plan.date.length > MAX_DATE_LENGTH ||
    plan.time.length === 0 || plan.time.length > MAX_TIME_LENGTH ||
    plan.activityId.length === 0 || plan.activityId.length > MAX_ACTIVITY_LENGTH
  ) return null;

  const activityId = normalizeActivityId(plan.activityId);
  if (!activityId || !isValidDate(plan.date) || !allowedTimes.has(plan.time)) return null;
  return { date: plan.date, time: plan.time, activityId };
};
```

Change `parseSharePlan` to return `decodeSharePlan(plan)` instead of calling the removed `isSharePlan` predicate.

- [ ] **Step 6: Update compatibility tests with exact mappings**

In `tests/unit/invitation-progress-storage.test.ts`, change the old unsupported-food assertion to:

```ts
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
```

In `tests/unit/share-plan.test.ts`, add:

```ts
test("旧菜单分享链接解析为当前菜单 id", async () => {
  const sharePlan = await loadSharePlan();
  const cases = {
    pizza: "western",
    "dim-sum": "snacks",
    ramen: "snacks",
    mala: "hunan",
    crayfish: "hunan",
    skewers: "snacks",
  } as const;

  for (const [legacy, current] of Object.entries(cases)) {
    const encoded = encodePlan({ date: "2026-08-08", time: "19:00", activityId: legacy });
    assert.equal(sharePlan.parseSharePlan(encoded)?.activityId, current);
  }
});
```

Update the legacy `coffee` expectation to `coffee`, because it is now a current food ID; retain `dinner`, `walk` and `exhibit` compatibility cases.

- [ ] **Step 7: Run the focused contract tests**

Run:

```bash
npx tsx --test tests/unit/food-migration.test.ts tests/unit/invitation-config.test.ts tests/unit/invitation-progress-storage.test.ts tests/unit/share-plan.test.ts
```

Expected: PASS. Task 4 will export the matching `FoodIconName` UI type before `FoodChoiceCard` consumes `fallbackIcon`.

## Task 3: Expand decline progression and isolate dodge geometry

**Files:**
- Create: `src/lib/decline-dodge.ts`
- Create: `tests/unit/decline-dodge.test.ts`
- Modify: `src/lib/state-machine.ts`
- Modify: `src/lib/invitation-progress-storage.ts`
- Test: `tests/unit/state-machine.test.ts`
- Test: `tests/unit/invitation-progress-storage.test.ts`

- [ ] **Step 1: Write failing state, storage and geometry tests**

Replace the old 1–5 loop test in `tests/unit/state-machine.test.ts` with:

```ts
test("不要按钮按 1 到 15 推进，之后在 12 到 15 循环", () => {
  let state = createInitialState();
  const expectedSteps = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    12, 13, 14, 15, 12,
  ];

  for (const expectedStep of expectedSteps) {
    state = transition(state, { type: "DECLINE_PLAY" });
    assert.equal(state.declineStep, expectedStep);
    assert.equal(state.phase, "INTRO");
  }
});
```

Replace the old decline-step boundary test in `tests/unit/invitation-progress-storage.test.ts` with:

```ts
test("declineStep 0 到 15 原样恢复，异常值只归零并保留计划", () => {
  for (const declineStep of [0, 5, 6, 10, 15]) {
    assert.deepEqual(
      parseInvitationState(JSON.stringify({ ...validState, declineStep })),
      { ...validState, declineStep },
    );
  }

  for (const declineStep of [-1, 16, 1.5, "5", null]) {
    assert.deepEqual(
      parseInvitationState(JSON.stringify({ ...validState, declineStep })),
      { ...validState, declineStep: 0 },
    );
  }
});
```

Create `tests/unit/decline-dodge.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  DODGE_SAFE_POINTS,
  getDeclineComicStage,
  getDeclineMascotMood,
  getDodgePosition,
} from "../../src/lib/decline-dodge";

test("十二个安全锚点唯一且比例合法", () => {
  assert.equal(DODGE_SAFE_POINTS.length, 12);
  assert.equal(new Set(DODGE_SAFE_POINTS.map(({ x, y }) => `${x}:${y}`)).size, 12);
  for (const point of DODGE_SAFE_POINTS) {
    assert.ok(point.x >= 0 && point.x <= 1);
    assert.ok(point.y >= 0 && point.y <= 1);
  }
});

test("漫画阶段与追逐角色按 step 分段", () => {
  assert.equal(getDeclineComicStage(0), "idle");
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

test("真实按钮尺寸下始终夹在活动区安全边界内", () => {
  const arena = { width: 328, height: 248 };
  const button = { width: 168, height: 58 };
  const seen = new Set<string>();

  for (let step = 0; step < 12; step += 1) {
    const position = getDodgePosition(step, arena, button);
    seen.add(`${Math.round(position.x)}:${Math.round(position.y)}`);
    assert.ok(position.x >= 0);
    assert.ok(position.y >= 0);
    assert.ok(position.x + button.width <= arena.width);
    assert.ok(position.y + button.height <= arena.height);
  }
  assert.equal(seen.size, 12);
});
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run:

```bash
npx tsx --test tests/unit/state-machine.test.ts tests/unit/invitation-progress-storage.test.ts tests/unit/decline-dodge.test.ts
```

Expected: FAIL because `DeclineStep` still ends at 5, storage rejects 6–15, and `decline-dodge.ts` does not exist.

- [ ] **Step 3: Expand the state-machine decline contract**

In `src/lib/state-machine.ts`, replace the decline type and transition branch with:

```ts
export type DeclineStep =
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export const nextDeclineStep = (step: DeclineStep): DeclineStep => {
  if (step >= 15) return 12;
  return (step + 1) as DeclineStep;
};
```

Use it in `DECLINE_PLAY`:

```ts
case "DECLINE_PLAY":
  return state.phase === "INTRO"
    ? { ...state, declineStep: nextDeclineStep(state.declineStep) }
    : state;
```

Do not change any phase transition, schedule validator, submit event or legacy decline event in this task.

- [ ] **Step 4: Normalize decline steps during storage decoding**

In `src/lib/invitation-progress-storage.ts`, replace `isDeclineStep` with:

```ts
const normalizeDeclineStep = (value: unknown): DeclineStep =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= 0 &&
  value <= 15
    ? (value as DeclineStep)
    : 0;
```

Remove `!isDeclineStep(value.declineStep)` from the rejection condition, then construct state with:

```ts
declineStep: normalizeDeclineStep(value.declineStep),
```

This intentionally keeps the rest of a valid stored plan when only declineStep is malformed.

- [ ] **Step 5: Implement pure dodge and comic-stage helpers**

Create `src/lib/decline-dodge.ts`:

```ts
import type { MascotMood } from "@/config/invitation";
import type { DeclineStep } from "@/lib/state-machine";

export type ElementSize = { width: number; height: number };
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

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const getDodgePosition = (
  step: number,
  arena: ElementSize,
  button: ElementSize,
) => {
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

export const getDeclineMascotMood = (step: DeclineStep): MascotMood => {
  const stage = getDeclineComicStage(step);
  if (stage === "ready") return "hunterReady";
  if (stage === "lunge") return "hunterLunge";
  if (stage === "miss") return "hunterMiss";
  return "serious";
};
```

- [ ] **Step 6: Run the focused suite**

Run:

```bash
npx tsx --test tests/unit/state-machine.test.ts tests/unit/invitation-progress-storage.test.ts tests/unit/decline-dodge.test.ts
```

Expected: PASS, including the original non-INTRO and legacy-decline tests.

## Task 4: Build the reusable pig, bubble, comic and food primitives

**Files:**
- Modify: `src/components/mascot/Mascot.tsx`
- Create: `src/components/mascot/MascotMoment.tsx`
- Create: `src/components/mascot/DodgeComicBeat.tsx`
- Create: `src/components/ui/SpeechBubble.tsx`
- Create: `src/components/ui/ComicBurst.tsx`
- Create: `src/components/ui/FoodChoiceCard.tsx`
- Modify: `src/components/ui/FoodIcon.tsx`

- [ ] **Step 1: Export the food fallback icon contract and add `snacks`**

In `src/components/ui/FoodIcon.tsx`, export the name type and change the line token:

```ts
export type FoodIconName =
  | "hotpot" | "sushi" | "bbq" | "hunan" | "western"
  | "dessert" | "coffee" | "snacks" | "walk" | "exhibit" | "surprise";

const line = {
  fill: "none",
  stroke: "#403433",
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
```

Change the prop to `name: FoodIconName`. Before the final default return, add:

```tsx
if (name === "snacks") return (
  <Sketch>
    <path d="M18 28h60l-7 34H25z" fill="#a9d9ec" stroke="#403433" strokeWidth="3" />
    <path d="M30 19l18 34M46 13l10 39M64 18L50 53" {...line} />
    <circle cx="29" cy="22" r="6" fill="#f6d96b" stroke="#403433" strokeWidth="3" />
    <circle cx="47" cy="16" r="6" fill="#ff667d" stroke="#403433" strokeWidth="3" />
    <circle cx="64" cy="22" r="6" fill="#bfd8a1" stroke="#403433" strokeWidth="3" />
  </Sketch>
);
```

Replace remaining `#181511` literal strokes in this file with `#403433` so the fallback does not reveal the old ink color.

- [ ] **Step 2: Upgrade `Mascot` with new-source fallback and finite motion**

Replace `src/components/mascot/Mascot.tsx` with:

```tsx
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  invitationConfig,
  type MascotMood,
} from "@/config/invitation";

export function Mascot({
  mood,
  className = "",
  priority = false,
  animate = true,
}: {
  mood: MascotMood;
  className?: string;
  priority?: boolean;
  animate?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const mascot = invitationConfig.mascots[mood];
  const [currentSrc, setCurrentSrc] = useState(mascot.src);

  useEffect(() => setCurrentSrc(mascot.src), [mascot.src]);

  return (
    <motion.div
      className={`mascot ${className}`.trim()}
      data-mood={mood}
      initial={false}
      animate={animate && !reducedMotion ? { y: [0, -3, 0] } : { y: 0 }}
      transition={animate && !reducedMotion
        ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
        : { duration: 0.01 }}
    >
      <Image
        src={currentSrc}
        alt={mascot.alt}
        fill
        sizes="(max-width: 480px) 52vw, 240px"
        priority={priority}
        onError={() => {
          if (currentSrc !== mascot.fallbackSrc) setCurrentSrc(mascot.fallbackSrc);
        }}
      />
    </motion.div>
  );
}
```

- [ ] **Step 3: Create the accessible speech bubble**

Create `src/components/ui/SpeechBubble.tsx`:

```tsx
import type { ReactNode } from "react";

export function SpeechBubble({
  children,
  tone = "cream",
  live = false,
  className = "",
  testId,
}: {
  children: ReactNode;
  tone?: "cream" | "mint" | "yellow" | "blue" | "lavender";
  live?: boolean;
  className?: string;
  testId?: string;
}) {
  return (
    <p
      className={`speech-bubble speech-bubble--${tone} ${className}`.trim()}
      role={live ? "status" : undefined}
      aria-live={live ? "polite" : undefined}
      data-testid={testId}
    >
      {children}
    </p>
  );
}
```

- [ ] **Step 4: Create the comic burst primitive**

Create `src/components/ui/ComicBurst.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ComicBurst({
  label,
  active = true,
  tone = "coral",
  testId,
}: {
  label: string;
  active?: boolean;
  tone?: "coral" | "blue" | "yellow";
  testId?: string;
}) {
  const reducedMotion = useReducedMotion();
  if (!active) return null;

  return (
    <motion.span
      className={`comic-burst comic-burst--${tone}`}
      data-testid={testId}
      aria-hidden="true"
      initial={reducedMotion ? false : { opacity: 0, scale: 0.55, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: -3 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.24, ease: "easeOut" }}
    >
      {label}
    </motion.span>
  );
}
```

- [ ] **Step 5: Create `MascotMoment` and `DodgeComicBeat`**

Create `src/components/mascot/MascotMoment.tsx`:

```tsx
import type { MascotMood } from "@/config/invitation";
import { Mascot } from "./Mascot";
import { SpeechBubble } from "@/components/ui/SpeechBubble";

export function MascotMoment({
  mood,
  note,
  size = "large",
  align = "center",
  live = false,
  testId,
  priority = false,
}: {
  mood: MascotMood;
  note?: string;
  size?: "medium" | "large" | "hero";
  align?: "left" | "center" | "right";
  live?: boolean;
  testId?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`mascot-moment mascot-moment--${size} mascot-moment--${align}`}
      data-testid={testId}
      data-mood={mood}
    >
      <Mascot mood={mood} className="mascot-moment__art" priority={priority} />
      {note ? <SpeechBubble live={live}>{note}</SpeechBubble> : null}
    </div>
  );
}
```

Create `src/components/mascot/DodgeComicBeat.tsx`:

```tsx
import type { DeclineStep } from "@/lib/state-machine";
import {
  getDeclineComicStage,
  getDeclineMascotMood,
} from "@/lib/decline-dodge";
import { ComicBurst } from "@/components/ui/ComicBurst";
import { MascotMoment } from "./MascotMoment";

const burstByStage = {
  idle: "",
  ready: "咻",
  lunge: "等等！",
  miss: "扑空！",
} as const;

export function DodgeComicBeat({
  step,
  note,
}: {
  step: DeclineStep;
  note: string;
}) {
  const stage = getDeclineComicStage(step);
  const mood = getDeclineMascotMood(step);

  return (
    <div className={`dodge-comic dodge-comic--${stage}`} data-chase-phase={stage}>
      <MascotMoment
        mood={mood}
        note={note}
        size="large"
        align="right"
        live
        testId="decline-aside"
      />
      <ComicBurst
        label={burstByStage[stage]}
        active={stage !== "idle"}
        tone={stage === "lunge" ? "blue" : "coral"}
        testId="decline-sfx"
      />
    </div>
  );
}
```

- [ ] **Step 6: Create the image-backed food choice card**

Create `src/components/ui/FoodChoiceCard.tsx`:

```tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { FoodOption } from "@/config/invitation";
import { FoodIcon, type FoodIconName } from "./FoodIcon";

export function FoodChoiceCard({
  food,
  selected,
  onSelect,
}: {
  food: FoodOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [food.imageSrc]);

  return (
    <motion.button
      type="button"
      data-testid={`food-${food.id}`}
      className={`food-choice food-choice--${food.tone} ${selected ? "is-selected" : ""}`}
      aria-pressed={selected}
      onClick={onSelect}
      whileTap={{ scale: 0.96 }}
      animate={{ y: selected ? -4 : 0 }}
    >
      <span className="food-choice__image" aria-hidden="true">
        {failed ? (
          <FoodIcon name={food.fallbackIcon as FoodIconName} />
        ) : (
          <Image src={food.imageSrc} alt="" fill sizes="110px" onError={() => setFailed(true)} />
        )}
      </span>
      <strong>{food.label}</strong>
      <small>{food.tagline}</small>
      {selected ? <span className="food-choice__stamp">就它了！</span> : null}
    </motion.button>
  );
}
```

- [ ] **Step 7: Run lint and type checks for the primitives**

Run:

```bash
npx eslint src/components/mascot/Mascot.tsx src/components/mascot/MascotMoment.tsx src/components/mascot/DodgeComicBeat.tsx src/components/ui/SpeechBubble.tsx src/components/ui/ComicBurst.tsx src/components/ui/FoodChoiceCard.tsx src/components/ui/FoodIcon.tsx
npx tsc --noEmit
```

Expected: PASS. Fix types at their source; do not add `any`, `@ts-ignore` or image loader bypasses.

## Task 5: Establish the strawberry-milk sticker archive shell

**Files:**
- Modify: `src/components/scenes/SceneFrame.tsx`
- Modify: `src/components/ui/ArchivePrimitives.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the full-scene live region with a stable sticker archive frame**

Replace `src/components/scenes/SceneFrame.tsx` with:

```tsx
import type { ReactNode } from "react";

export function SceneFrame({
  children,
  variant = "default",
  className = "",
  label,
}: {
  children: ReactNode;
  variant?: string;
  className?: string;
  label?: string;
}) {
  return (
    <section className={`scene scene--${variant} ${className}`.trim()}>
      <span className="sticker-doodle sticker-doodle--heart" aria-hidden="true">♡</span>
      <span className="sticker-doodle sticker-doodle--star" aria-hidden="true">✦</span>
      <span className="sticker-tape sticker-tape--top" aria-hidden="true" />
      <span className="sticker-tape sticker-tape--side" aria-hidden="true" />
      <div className="scene-folder" aria-hidden="true" />
      <div className="scene-card">
        {label ? <span className="archive-label">{label}</span> : null}
        {children}
      </div>
    </section>
  );
}
```

The section no longer has `aria-live`; only `SpeechBubble live` announces changing chase copy.

- [ ] **Step 2: Make button press motion respect reduced motion**

Update `ArchiveButton` in `src/components/ui/ArchivePrimitives.tsx`:

```tsx
import { motion, useReducedMotion } from "framer-motion";

export function ArchiveButton({ variant = "primary", className = "", children, ...props }: ArchiveButtonProps) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.button
      type="button"
      whileTap={reducedMotion ? undefined : { scale: 0.96, x: 1, y: 2 }}
      className={`archive-button archive-button--${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </motion.button>
  );
}
```

- [ ] **Step 3: Replace global color tokens and shell primitives**

At the top of `src/app/globals.css`, replace the existing `:root` block with:

```css
:root {
  --milk-pink: #f8cfdb;
  --pig-pink: #f6b6c4;
  --snout-pink: #e98d9b;
  --paper: #fff9f1;
  --sticker-white: #fffdfc;
  --coral: #ff667d;
  --coral-dark: #e94e68;
  --cocoa: #403433;
  --muted: #756565;
  --butter: #f6d96b;
  --sage: #bfd8a1;
  --sky: #a9d9ec;
  --lavender: #ceb9e8;
  --soft-shadow: 0 7px 0 rgba(64, 52, 51, 0.92);
  --font-sans: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
}
```

Replace all uses of `var(--pink-bg)`, `var(--pink)`, `var(--pink-dark)`, `var(--card)`, `var(--ink)` and `var(--hard-shadow)` with the new semantic tokens. Then replace the old `.flower*`, `.scene`, `.scene-card` and `avatar-mascot` blocks with:

```css
html,
body {
  min-width: 320px;
  background: var(--milk-pink);
}

body {
  margin: 0;
  overflow-x: hidden;
  color: var(--cocoa);
  background-image:
    radial-gradient(circle at 14% 7%, rgba(255, 255, 255, 0.55), transparent 28%),
    url("/textures/paper-noise.svg");
  font-family: var(--font-sans);
}

.invitation-page {
  display: grid;
  min-height: 100dvh;
  place-items: center;
  padding: 24px;
  overflow-x: hidden;
}

.mobile-stage {
  position: relative;
  width: min(100%, 430px);
  max-width: 430px;
  overflow-x: clip;
  overflow-y: visible;
}

.scene {
  position: relative;
  min-height: min(844px, calc(100dvh - 48px));
  padding: 16px;
  isolation: isolate;
}

.scene-folder {
  position: absolute;
  inset: 34px 8px 6px;
  z-index: -2;
  background: #efa2b7;
  border: 2.5px solid var(--cocoa);
  border-radius: 30px 30px 24px 24px;
  transform: rotate(1.2deg);
}

.scene-card {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: min(812px, calc(100dvh - 80px));
  flex-direction: column;
  padding: 28px 24px 24px;
  overflow: visible;
  background: var(--paper);
  border: 2.5px solid var(--cocoa);
  border-radius: 26px 23px 28px 24px;
  box-shadow: var(--soft-shadow);
}

.archive-label {
  align-self: flex-start;
  margin-bottom: 14px;
  padding: 7px 11px 6px;
  color: var(--cocoa);
  background: var(--pig-pink);
  border: 2px solid var(--cocoa);
  border-radius: 10px 13px 9px 12px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  transform: rotate(-1deg);
}

.sticker-doodle,
.sticker-tape {
  position: absolute;
  z-index: 4;
  pointer-events: none;
}

.sticker-doodle--heart {
  top: 8px;
  left: 9px;
  color: var(--coral-dark);
  font-size: 31px;
  font-weight: 900;
  transform: rotate(-13deg);
}

.sticker-doodle--star {
  right: 5px;
  bottom: 62px;
  color: var(--butter);
  font-size: 26px;
  text-shadow: 1px 1px 0 var(--cocoa);
}

.sticker-tape {
  width: 62px;
  height: 19px;
  background: rgba(246, 217, 107, 0.82);
  border: 1px solid rgba(64, 52, 51, 0.18);
}

.sticker-tape--top {
  top: 5px;
  left: 50%;
  transform: translateX(-50%) rotate(-3deg);
}

.sticker-tape--side {
  right: -8px;
  top: 31%;
  background: rgba(169, 217, 236, 0.8);
  transform: rotate(83deg);
}

.avatar-mascot {
  width: 168px;
  height: 168px;
  overflow: visible;
}

.avatar-mascot img,
.mascot img {
  object-fit: contain;
}
```

- [ ] **Step 4: Add shared bubble, burst, mascot and food-card CSS**

Append these exact component rules to `globals.css`:

```css
.speech-bubble {
  position: relative;
  max-width: 260px;
  margin: 0;
  padding: 10px 13px;
  color: var(--cocoa);
  background: var(--sticker-white);
  border: 2px solid var(--cocoa);
  border-radius: 16px 17px 15px 18px;
  box-shadow: 3px 3px 0 rgba(64, 52, 51, 0.18);
  font-size: 13px;
  font-weight: 750;
  line-height: 1.45;
}

.speech-bubble::after {
  position: absolute;
  bottom: -8px;
  left: 22px;
  width: 13px;
  height: 13px;
  content: "";
  background: inherit;
  border-right: 2px solid var(--cocoa);
  border-bottom: 2px solid var(--cocoa);
  transform: rotate(45deg);
}

.speech-bubble--mint { background: #edf6e5; }
.speech-bubble--yellow { background: #fff4bd; }
.speech-bubble--blue { background: #e5f4fb; }
.speech-bubble--lavender { background: #f0eafb; }

.mascot-moment {
  position: relative;
  display: grid;
  justify-items: center;
}

.mascot-moment__art {
  position: relative;
  width: 100%;
  height: 100%;
}

.mascot-moment--medium { width: 132px; }
.mascot-moment--medium .mascot-moment__art { height: 132px; }
.mascot-moment--large { width: 190px; }
.mascot-moment--large .mascot-moment__art { height: 190px; }
.mascot-moment--hero { width: 230px; }
.mascot-moment--hero .mascot-moment__art { height: 230px; }
.mascot-moment .speech-bubble { margin-top: -10px; }

.comic-burst {
  position: absolute;
  z-index: 6;
  display: grid;
  min-width: 72px;
  min-height: 48px;
  place-items: center;
  padding: 7px 10px;
  color: var(--cocoa);
  background: var(--butter);
  clip-path: polygon(50% 0, 61% 22%, 83% 7%, 79% 31%, 100% 38%, 79% 52%, 95% 74%, 69% 72%, 64% 100%, 48% 78%, 27% 96%, 29% 70%, 2% 67%, 23% 48%, 0 33%, 27% 29%, 31% 4%);
  font-size: 14px;
  font-weight: 950;
}

.comic-burst--coral { background: #ff9aad; }
.comic-burst--blue { background: var(--sky); }
.comic-burst--yellow { background: var(--butter); }

.food-choice {
  position: relative;
  display: grid;
  min-width: 0;
  min-height: 146px;
  align-content: start;
  justify-items: center;
  gap: 3px;
  padding: 8px 5px 9px;
  cursor: pointer;
  color: var(--cocoa);
  background: var(--sticker-white);
  border: 2px solid var(--cocoa);
  border-radius: 16px 19px 15px 18px;
  box-shadow: 0 4px 0 rgba(64, 52, 51, 0.82);
}

.food-choice--coral,
.food-choice--rose { background: #ffe3e8; }
.food-choice--mint { background: #eaf4df; }
.food-choice--yellow { background: #fff2b5; }
.food-choice--lavender { background: #eee7fa; }
.food-choice--blue { background: #e3f2fa; }
.food-choice--cream { background: #fff3da; }

.food-choice__image {
  position: relative;
  display: block;
  width: 68px;
  height: 68px;
}

.food-choice__image img { object-fit: contain; }
.food-choice .food-icon { width: 68px; height: 58px; }
.food-choice strong { font-size: 13px; font-weight: 900; }
.food-choice small {
  display: -webkit-box;
  overflow: hidden;
  font-size: 9px;
  font-weight: 700;
  line-height: 1.25;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.food-choice.is-selected {
  border-color: var(--coral-dark);
  box-shadow: 0 5px 0 var(--coral-dark);
}

.food-choice__stamp {
  position: absolute;
  top: 5px;
  right: -3px;
  padding: 3px 5px;
  color: var(--coral-dark);
  background: var(--paper);
  border: 2px solid var(--coral-dark);
  border-radius: 5px;
  font-size: 8px;
  font-weight: 950;
  transform: rotate(8deg);
}
```

- [ ] **Step 5: Verify foundation styles compile before scene work**

Run:

```bash
npx eslint src/components/scenes/SceneFrame.tsx src/components/ui/ArchivePrimitives.tsx
npx tsc --noEmit
```

Expected: PASS. The app may still look partially mixed because scenes have not migrated; do not perform visual acceptance until Task 10.

## Task 6: Rebuild the intro as the chase-comic highlight

**Files:**
- Modify: `src/components/scenes/IntroScene.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/e2e/invitation.spec.ts`

- [ ] **Step 1: Write the failing 18-step chase E2E contract**

Replace the first decline-button test in `tests/e2e/invitation.spec.ts` with:

```ts
test("不要按钮连续逃跑 18 次并切换三段小猪漫画", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const button = page.getByTestId("decline-action");
  const arena = page.getByTestId("decline-arena");
  const observedPositions = new Set<string>();
  const observedSteps: string[] = [];

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
```

- [ ] **Step 2: Run the chase test and verify failure**

Run:

```bash
npx playwright test tests/e2e/invitation.spec.ts -g "连续逃跑 18 次"
```

Expected: FAIL because the current intro has only six fixed positions, a static 112×54 size and no chase phase.

- [ ] **Step 3: Replace `IntroScene.tsx` with real-size geometry and comic feedback**

Use this complete implementation:

```tsx
"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DodgeComicBeat } from "@/components/mascot/DodgeComicBeat";
import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { invitationConfig } from "@/config/invitation";
import { getDodgePosition, type ElementSize } from "@/lib/decline-dodge";
import type { DeclineStep } from "@/lib/state-machine";
import { SceneFrame } from "./SceneFrame";

const DEFAULT_ARENA = { width: 328, height: 176 };
const DEFAULT_BUTTON = { width: 128, height: 54 };

export function IntroScene({
  declineStep,
  onApprove,
  onDecline,
}: {
  declineStep: DeclineStep;
  onApprove: () => void;
  onDecline: () => void;
}) {
  const [approving, setApproving] = useState(false);
  const [arenaSize, setArenaSize] = useState<ElementSize>(DEFAULT_ARENA);
  const [buttonSize, setButtonSize] = useState<ElementSize>(DEFAULT_BUTTON);
  const arenaRef = useRef<HTMLDivElement>(null);
  const declineButtonRef = useRef<HTMLButtonElement>(null);
  const approveTimerRef = useRef<number | null>(null);
  const lastDodgeAt = useRef(Number.NEGATIVE_INFINITY);
  const reducedMotion = useReducedMotion();
  const copy = invitationConfig.copy.intro;
  const declineCopy = copy.declineSteps[declineStep];
  const position = getDodgePosition(declineStep, arenaSize, buttonSize);

  const dodge = useCallback(() => {
    const now = performance.now();
    if (now - lastDodgeAt.current < 260) return;
    lastDodgeAt.current = now;
    onDecline();
  }, [onDecline]);

  useLayoutEffect(() => {
    const arena = arenaRef.current;
    const button = declineButtonRef.current;
    if (!arena || !button) return;

    const update = () => {
      setArenaSize({ width: arena.clientWidth, height: arena.clientHeight });
      setButtonSize({ width: button.offsetWidth, height: button.offsetHeight });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(arena);
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const button = declineButtonRef.current;
    if (!button) return;
    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") dodge();
    };
    button.addEventListener("pointerenter", onPointerEnter);
    return () => button.removeEventListener("pointerenter", onPointerEnter);
  }, [dodge]);

  useEffect(() => () => {
    if (approveTimerRef.current !== null) window.clearTimeout(approveTimerRef.current);
  }, []);

  const approve = () => {
    if (approving) return;
    setApproving(true);
    approveTimerRef.current = window.setTimeout(onApprove, 280);
  };

  return (
    <SceneFrame variant="intro" label={copy.label}>
      <header className="intro-copy">
        <h1>{copy.title}</h1>
        <p className="scene-subtitle">{copy.subtitle}</p>
      </header>

      <DodgeComicBeat step={declineStep} note={declineStep === 0 ? copy.mascotNote : declineCopy.mascotNote} />

      <div className="decline-arena" ref={arenaRef} data-testid="decline-arena">
        <AnimatePresence>
          {declineStep > 0 ? (
            <motion.span
              key={declineStep}
              className="dodge-trail"
              data-testid="dodge-trail"
              aria-hidden="true"
              style={{ left: position.x, top: position.y }}
              initial={{ opacity: 0.9, scaleX: 0.4 }}
              animate={{ opacity: 0, scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.35 }}
            >
              · · ·
            </motion.span>
          ) : null}
        </AnimatePresence>
        <motion.button
          ref={declineButtonRef}
          type="button"
          className="decline-action"
          data-testid="decline-action"
          data-dodge-step={declineStep}
          data-dodge-position={declineStep % 12}
          aria-label={declineCopy.buttonLabel}
          onPointerDown={(event) => {
            if (event.pointerType === "touch" || event.pointerType === "pen") {
              event.preventDefault();
              dodge();
            }
          }}
          onClick={(event) => {
            if (event.detail === 0) dodge();
          }}
          initial={false}
          animate={{ x: position.x, y: position.y, rotate: position.rotate }}
          transition={reducedMotion
            ? { duration: 0.01 }
            : { type: "spring", stiffness: 480, damping: 30 }}
        >
          {declineCopy.buttonLabel}
        </motion.button>
      </div>

      <ArchiveButton
        data-testid="approve-action"
        className="approve-action"
        onClick={approve}
        disabled={approving}
      >
        {copy.approve}
      </ArchiveButton>
      {approving ? <motion.span className="approval-heart" initial={{ scale: 0 }} animate={{ scale: 1.2 }} aria-hidden="true">♥</motion.span> : null}
    </SceneFrame>
  );
}
```

- [ ] **Step 4: Add intro-specific layout styles**

Replace the old intro CSS blocks with:

```css
.scene--intro .scene-card {
  justify-content: flex-start;
  padding-top: 26px;
}

.intro-copy {
  display: grid;
  justify-items: center;
  text-align: center;
}

.intro-copy h1 {
  max-width: 330px;
  font-size: clamp(35px, 9.8vw, 43px);
  line-height: 1.05;
}

.intro-copy .scene-subtitle { max-width: 310px; }

.dodge-comic {
  position: relative;
  min-height: 236px;
  margin-top: 4px;
}

.dodge-comic .mascot-moment {
  margin-inline: auto;
}

.dodge-comic .comic-burst {
  top: 34px;
  right: 12px;
}

.decline-arena {
  position: relative;
  width: 100%;
  height: 176px;
  margin-top: -12px;
  border: 2px dashed rgba(64, 52, 51, 0.22);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.34);
}

.decline-action {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  min-width: 122px;
  min-height: 52px;
  padding: 8px 13px;
  touch-action: none;
  cursor: pointer;
  white-space: nowrap;
  color: var(--cocoa);
  background: var(--sticker-white);
  border: 2.5px solid var(--cocoa);
  border-radius: 999px;
  box-shadow: 0 4px 0 var(--cocoa);
  font-size: 14px;
  font-weight: 900;
}

.dodge-trail {
  position: absolute;
  z-index: 2;
  color: var(--sky);
  font-size: 26px;
  font-weight: 900;
  transform-origin: right center;
}

.approve-action {
  width: 100%;
  margin-top: 16px;
}

.approval-heart {
  position: absolute;
  right: 34px;
  bottom: 78px;
  color: var(--coral-dark);
  font-size: 40px;
  text-shadow: 2px 2px 0 var(--cocoa);
}
```

- [ ] **Step 5: Run state, chase and input-method tests**

Run:

```bash
npx tsx --test tests/unit/state-machine.test.ts tests/unit/decline-dodge.test.ts
npx playwright test tests/e2e/invitation.spec.ts -g "连续逃跑 18 次|桌面靠近|360 和 430"
```

Expected: PASS. Confirm the main approval CTA is outside `decline-arena`; the moving button must not overlap it by construction.

## Task 7: Convert confirmation and schedule into controlled comic beats

**Files:**
- Modify: `src/components/scenes/ConfirmScene.tsx`
- Modify: `src/components/scenes/ScheduleScene.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/e2e/invitation.spec.ts`

- [ ] **Step 1: Update the E2E schedule helper before changing the UI**

Replace `chooseSchedule` in `tests/e2e/invitation.spec.ts` with:

```ts
async function chooseSchedule(page: Page, date = getLocalDate(7)) {
  await page.getByTestId("date-input").fill(date);
  await page.getByTestId("time-1900").click();
  await expect(page.getByTestId("time-1900")).toHaveAttribute("aria-pressed", "true");
  await page.getByTestId("schedule-next").click();
}
```

Change heading expectations to `等等，你真的批准了？`, `正在捕捉你的空闲时间` and `这次的快乐，吃什么？`.

- [ ] **Step 2: Rebuild confirmation as two static comic panels**

Replace `ConfirmScene.tsx` with:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mascot } from "@/components/mascot/Mascot";
import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { ComicBurst } from "@/components/ui/ComicBurst";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { invitationConfig } from "@/config/invitation";
import { SceneFrame } from "./SceneFrame";

export function ConfirmScene({ onConfirm, onSlip }: { onConfirm: () => void; onSlip: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const timerRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const copy = invitationConfig.copy.confirm;

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const confirm = () => {
    if (confirmed) return;
    setConfirmed(true);
    timerRef.current = window.setTimeout(onConfirm, 280);
  };

  return (
    <SceneFrame variant="confirm" label={copy.label}>
      <header className="scene-heading confirm-heading">
        <h1>{copy.title}</h1>
        <p className="scene-subtitle">{copy.subtitle}</p>
      </header>
      <div className="confirm-panels" aria-label="小猪从装镇定到惊喜的两格漫画">
        <div className="comic-panel">
          <Mascot mood="serious" className="comic-panel__mascot" animate={false} />
          <span aria-hidden="true">第一格：装镇定</span>
        </div>
        <motion.div className="comic-panel comic-panel--surprise" animate={confirmed && !reducedMotion ? { rotate: [-1, 2, 0], scale: [1, 1.04, 1] } : undefined}>
          <Mascot mood="surprised" className="comic-panel__mascot" animate={false} />
          <span aria-hidden="true">第二格：心里放烟花</span>
          <ComicBurst label="真的？！" tone="yellow" />
        </motion.div>
      </div>
      <SpeechBubble>{copy.mascotNote}</SpeechBubble>
      <div className="stacked-actions">
        <ArchiveButton data-testid="confirm-approval" onClick={confirm} disabled={confirmed}>{copy.approve}</ArchiveButton>
        <ArchiveButton variant="plain" onClick={onSlip}>{copy.slip}</ArchiveButton>
      </div>
    </SceneFrame>
  );
}
```

- [ ] **Step 3: Replace the time select with three accessible tickets**

Replace `ScheduleScene.tsx` with:

```tsx
"use client";

import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { invitationConfig } from "@/config/invitation";
import { isScheduleComplete, type InvitationState } from "@/lib/state-machine";
import { SceneFrame } from "./SceneFrame";

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function ScheduleScene({
  state,
  onEvent,
}: {
  state: InvitationState;
  onEvent: (event: "BACK" | "NEXT" | "DATE" | "TIME" | "NOTE", value?: string) => void;
}) {
  const copy = invitationConfig.copy.schedule;
  const complete = isScheduleComplete(state);

  return (
    <SceneFrame variant="schedule" label={copy.label}>
      <div className="schedule-hero">
        <div className="scene-heading schedule-heading">
          <h1>{copy.title}</h1>
          <p className="scene-subtitle">{copy.subtitle}</p>
        </div>
        <MascotMoment mood="hunter" size="medium" align="right" />
      </div>

      <div className="schedule-form">
        <label className="field-label" htmlFor="date-input">{copy.dateLabel}</label>
        <input id="date-input" data-testid="date-input" type="date" min={getToday()} value={state.date} onChange={(event) => onEvent("DATE", event.target.value)} />

        <fieldset className="time-fieldset">
          <legend className="field-label">{copy.timeLabel}</legend>
          <div className="time-tickets">
            {invitationConfig.timeOptions.map((option) => {
              const selected = state.time === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`time-ticket ${selected ? "is-selected" : ""}`}
                  data-testid={`time-${option.value.replace(":", "")}`}
                  aria-pressed={selected}
                  onClick={() => onEvent("TIME", option.value)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.tagline}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="field-label" htmlFor="note-input">{copy.noteLabel}</label>
        <textarea id="note-input" data-testid="note-input" value={state.note} maxLength={48} placeholder={copy.notePlaceholder} onChange={(event) => onEvent("NOTE", event.target.value)} />
      </div>

      {!complete ? <p className="validation-note">{copy.incomplete}</p> : null}
      <div className="schedule-actions">
        <ArchiveButton data-testid="schedule-next" disabled={!complete} onClick={() => onEvent("NEXT")}>{copy.next}</ArchiveButton>
        <ArchiveButton variant="plain" onClick={() => onEvent("BACK")}>← 返回上一步</ArchiveButton>
      </div>
    </SceneFrame>
  );
}
```

- [ ] **Step 4: Add confirmation and time-ticket CSS**

Append:

```css
.confirm-heading h1,
.schedule-heading h1 { max-width: 320px; }

.confirm-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
  margin-top: 22px;
}

.comic-panel {
  position: relative;
  display: grid;
  min-height: 180px;
  align-content: end;
  justify-items: center;
  overflow: hidden;
  background: #f6efe6;
  border: 2px solid var(--cocoa);
  border-radius: 18px 15px 17px 16px;
}

.comic-panel--surprise { background: #ffe2ea; }
.comic-panel__mascot { position: relative; width: 142px; height: 142px; }
.comic-panel span { padding-bottom: 9px; font-size: 10px; font-weight: 850; }
.comic-panel .comic-burst { top: 5px; right: 2px; transform: scale(0.78); }
.scene--confirm > .scene-card > .speech-bubble { margin: 15px auto 0; }

.schedule-hero {
  display: grid;
  grid-template-columns: 1fr 112px;
  align-items: end;
  gap: 5px;
}

.schedule-hero .mascot-moment { width: 112px; }
.schedule-hero .mascot-moment__art { height: 118px; }
.schedule-heading { text-align: left; }
.schedule-heading .scene-subtitle { margin-inline: 0; text-align: left; }

.time-fieldset {
  min-width: 0;
  margin: 4px 0 0;
  padding: 0;
  border: 0;
}

.time-tickets {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  margin-top: 8px;
}

.time-ticket {
  min-height: 78px;
  padding: 8px 5px;
  cursor: pointer;
  color: var(--cocoa);
  background: #fff3c8;
  border: 2px dashed var(--cocoa);
  border-radius: 13px 15px 12px 14px;
}

.time-ticket strong,
.time-ticket span { display: block; }
.time-ticket strong { font-size: 12px; font-weight: 900; }
.time-ticket span { margin-top: 4px; font-size: 9px; font-weight: 700; line-height: 1.3; }
.time-ticket.is-selected { background: var(--pig-pink); border-style: solid; box-shadow: 0 4px 0 var(--coral-dark); }
```

- [ ] **Step 5: Verify confirmation, schedule and focus behavior**

Run:

```bash
npx playwright test tests/e2e/invitation.spec.ts -g "愿意后|场景切换后焦点|刷新后恢复"
```

Expected: tests reach the food scene using the ticket button; confirmation still waits 280ms and does not double-dispatch.

## Task 8: Turn the menu into a selectable 3×3 sticker wall

**Files:**
- Modify: `src/components/scenes/FoodScene.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/e2e/invitation.spec.ts`

- [ ] **Step 1: Write the failing explicit-selection E2E behavior**

Replace the old automatic-submit section of the happy-path E2E test with:

```ts
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
```

- [ ] **Step 2: Run the happy-path test and verify failure**

Run:

```bash
npx playwright test tests/e2e/invitation.spec.ts -g "愿意后"
```

Expected: FAIL because the current menu has 10 Emoji options and auto-submits after 480ms.

- [ ] **Step 3: Replace `FoodScene.tsx` with explicit selection**

```tsx
"use client";

import { MascotMoment } from "@/components/mascot/MascotMoment";
import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { FoodChoiceCard } from "@/components/ui/FoodChoiceCard";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { invitationConfig, type FoodId } from "@/config/invitation";
import { SceneFrame } from "./SceneFrame";

export function FoodScene({
  selected,
  onSelect,
  onBack,
  onSubmit,
}: {
  selected: FoodId | null;
  onSelect: (food: FoodId) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const copy = invitationConfig.copy.food;
  const selectedOption = invitationConfig.foodOptions.find((food) => food.id === selected);

  return (
    <SceneFrame variant="food" label={copy.label}>
      <div className="food-hero">
        <div className="scene-heading food-heading">
          <h1>{copy.title}</h1>
          <p className="scene-subtitle">{copy.subtitle}</p>
        </div>
        <MascotMoment mood="chef" size="medium" align="right" />
      </div>

      <div className="food-grid">
        {invitationConfig.foodOptions.map((food) => (
          <FoodChoiceCard key={food.id} food={food} selected={selected === food.id} onSelect={() => onSelect(food.id)} />
        ))}
      </div>

      <SpeechBubble tone="mint" live testId="food-feedback">
        {selectedOption?.feedback ?? copy.emptyFeedback}
      </SpeechBubble>

      <div className="food-actions">
        <ArchiveButton data-testid="submit-plan" disabled={!selected} onClick={onSubmit}>{copy.submit}</ArchiveButton>
        <ArchiveButton variant="plain" onClick={onBack}>← 返回改时间</ArchiveButton>
      </div>
    </SceneFrame>
  );
}
```

- [ ] **Step 4: Replace old menu styles**

Use:

```css
.food-hero {
  display: grid;
  grid-template-columns: 1fr 108px;
  align-items: end;
  gap: 5px;
}

.food-heading { text-align: left; }
.food-heading h1 { font-size: 31px; }
.food-heading .scene-subtitle { margin-inline: 0; text-align: left; }
.food-hero .mascot-moment { width: 108px; }
.food-hero .mascot-moment__art { height: 108px; }

.food-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px 7px;
  margin-top: 12px;
}

.scene--food > .scene-card > .speech-bubble {
  min-height: 58px;
  margin: 16px auto 0;
}

.food-actions {
  display: grid;
  gap: 6px;
  margin-top: 17px;
}
```

- [ ] **Step 5: Verify selection, change and explicit submit**

Run:

```bash
npx playwright test tests/e2e/invitation.spec.ts -g "愿意后|提交写入失败|提交中刷新"
```

Expected: PASS after updating the failure and refresh tests to click `submit-plan` after choosing food. Verify the selected food remains active when a restored `SUBMITTING` state returns to FOOD.

## Task 9: Split submission and success, then migrate shared and legacy scenes

**Files:**
- Create: `src/components/ui/PlanSummaryCard.tsx`
- Create: `src/components/scenes/SubmittingScene.tsx`
- Create: `src/components/scenes/SuccessScene.tsx`
- Modify: `src/components/scenes/SharedPlanScene.tsx`
- Modify: `src/components/scenes/ReviewScene.tsx`
- Modify: `src/components/scenes/DeclineScene.tsx`
- Modify: `src/components/scenes/InvitationFlow.tsx`
- Delete: `src/components/scenes/SubmitSuccessScene.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Extract the reusable pass card**

Create `src/components/ui/PlanSummaryCard.tsx`:

```tsx
import type { ReactNode } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { getActivityLabel, getTimeLabel } from "@/config/invitation";
import { HeartRow } from "./ArchivePrimitives";

export function PlanSummaryCard({
  date,
  time,
  activityId,
  note,
  title,
  testId,
}: {
  date: string;
  time: string;
  activityId: string;
  note?: string;
  title: ReactNode;
  testId?: string;
}) {
  return (
    <div className="result-card-shell">
      <div className="result-card__heading">
        <div>
          <span className="result-card__eyebrow">DATE REQUEST · APPROVED</span>
          <h1>{title}</h1>
          <HeartRow active={5} />
        </div>
        <Mascot mood="cool" className="result-mascot" animate={false} />
      </div>
      <article className="plan-summary" data-testid={testId}>
        <div><span>DATE</span><strong>{date.replaceAll("-", ".")}</strong></div>
        <div><span>TIME</span><strong>{getTimeLabel(time)}</strong></div>
        <div><span>MENU</span><strong>{getActivityLabel(activityId)}</strong></div>
        <div><span>NOTE</span><strong>{note || "到时候见"}</strong></div>
      </article>
    </div>
  );
}
```

- [ ] **Step 2: Preserve submission behavior while replacing its presentation**

Create `src/components/scenes/SubmittingScene.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { MascotMoment } from "@/components/mascot/MascotMoment";
import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { invitationConfig } from "@/config/invitation";
import { submitInvitation } from "@/lib/invitation-service";
import type { InvitationState } from "@/lib/state-machine";
import { SceneFrame } from "./SceneFrame";

type SubmissionResult = Awaited<ReturnType<typeof submitInvitation>>;

export function SubmittingScene({ state, onComplete }: { state: InvitationState; onComplete: () => void }) {
  const submissionRef = useRef<Promise<SubmissionResult> | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [hasError, setHasError] = useState(false);
  const copy = invitationConfig.copy.submitting;

  useEffect(() => {
    let active = true;
    const submission = submissionRef.current ??= submitInvitation({
      requestNo: invitationConfig.requestNo,
      date: state.date,
      time: state.time,
      note: state.note,
      foodId: state.foodId,
      submittedAt: new Date().toISOString(),
    });

    void submission.then(
      () => { if (active) onComplete(); },
      () => { if (active) setHasError(true); },
    );
    return () => { active = false; };
  }, [attempt, onComplete, state.date, state.foodId, state.note, state.time]);

  const retry = () => {
    submissionRef.current = null;
    setHasError(false);
    setAttempt((current) => current + 1);
  };

  return (
    <SceneFrame variant="submitting" label={copy.label}>
      {hasError ? (
        <div className="submission-error" role="alert">
          <MascotMoment mood="surprised" size="hero" />
          <h1>{copy.errorTitle}</h1>
          <p>{copy.errorBody}</p>
          <ArchiveButton data-testid="retry-submit" onClick={retry}>{copy.retry}</ArchiveButton>
        </div>
      ) : (
        <div className="submitting-content">
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
          <div className="delivery-strip" role="img" aria-label="小猪依次出发、加速并送达约会申请">
            {["出发", "加速", "送达"].map((label, index) => (
              <div className="delivery-panel" key={label} aria-hidden="true">
                <Mascot mood="courier" className="delivery-panel__pig" animate={index === 1} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </SceneFrame>
  );
}
```

The promise/ref, active cleanup and retry reset match the current behavior. Do not move submission into a new hook or change the 1650ms local adapter delay.

- [ ] **Step 3: Create the success scene with pass, bubble and one-shot approval burst**

Create `src/components/scenes/SuccessScene.tsx`:

```tsx
"use client";

import { useState } from "react";
import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { ComicBurst } from "@/components/ui/ComicBurst";
import { PlanSummaryCard } from "@/components/ui/PlanSummaryCard";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { invitationConfig } from "@/config/invitation";
import { createSharePlanUrl } from "@/lib/share-plan";
import type { InvitationState } from "@/lib/state-machine";
import { SceneFrame } from "./SceneFrame";

export function SuccessScene({ state, onRevisit }: { state: InvitationState; onRevisit: () => void }) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const copy = invitationConfig.copy.success;

  const sharePlan = async () => {
    const url = createSharePlanUrl(window.location.origin, {
      date: state.date,
      time: state.time,
      activityId: state.foodId ?? "surprise",
    });

    try {
      if (navigator.share) {
        await navigator.share({ title: copy.title, text: "给你一份约会计划", url });
        setShareStatus("已打开分享面板");
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareStatus("链接已复制，快发给对方吧");
    } catch {
      setShareStatus("分享已取消，计划还好好保存在这里");
    }
  };

  return (
    <SceneFrame variant="success" label={copy.label}>
      <ComicBurst label="已批准" tone="coral" testId="approval-burst" />
      <PlanSummaryCard
        date={state.date}
        time={state.time}
        activityId={state.foodId ?? "surprise"}
        note={state.note}
        title={copy.title}
      />
      <p className="success-body">{copy.body}</p>
      <SpeechBubble tone="yellow">{copy.mascotNote}</SpeechBubble>
      <p className="success-copy" role={shareStatus ? "status" : undefined}>{shareStatus ?? copy.hint}</p>
      <div className="success-actions">
        <ArchiveButton data-testid="share-plan" onClick={() => void sharePlan()}>{copy.share}</ArchiveButton>
        <div className="text-actions">
          <ArchiveButton variant="plain" onClick={() => window.print()}>{copy.save}</ArchiveButton>
          <ArchiveButton variant="plain" onClick={onRevisit}>{copy.revisit}</ArchiveButton>
        </div>
      </div>
    </SceneFrame>
  );
}
```

- [ ] **Step 4: Migrate the shared plan scene to the same pass component**

Replace `SharedPlanScene.tsx` with:

```tsx
"use client";

import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { PlanSummaryCard } from "@/components/ui/PlanSummaryCard";
import { invitationConfig } from "@/config/invitation";
import type { SharePlan } from "@/lib/share-plan";
import { SceneFrame } from "./SceneFrame";

export function SharedPlanScene({ plan, onStartNew }: { plan: SharePlan; onStartNew: () => void }) {
  const copy = invitationConfig.copy.shared;
  return (
    <SceneFrame variant="shared" label={copy.label}>
      <PlanSummaryCard
        date={plan.date}
        time={plan.time}
        activityId={plan.activityId}
        title={copy.title}
        testId="shared-plan-card"
      />
      <p className="success-copy">{copy.hint}</p>
      <ArchiveButton onClick={onStartNew}>{copy.start}</ArchiveButton>
    </SceneFrame>
  );
}
```

- [ ] **Step 5: Restyle the historical review and decline routes instead of deleting them**

Replace `ReviewScene.tsx` with:

```tsx
"use client";

import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { PlanSummaryCard } from "@/components/ui/PlanSummaryCard";
import { invitationConfig } from "@/config/invitation";
import type { InvitationState } from "@/lib/state-machine";
import { SceneFrame } from "./SceneFrame";

export function ReviewScene({ state, onBack, onSubmit }: { state: InvitationState; onBack: () => void; onSubmit: () => void }) {
  const copy = invitationConfig.copy.review;
  return (
    <SceneFrame variant="legacy" label={copy.label}>
      <PlanSummaryCard date={state.date} time={state.time} activityId={state.foodId ?? "surprise"} note={state.note} title={copy.title} />
      <p className="scene-subtitle">{copy.subtitle}</p>
      <div className="legacy-actions">
        <ArchiveButton data-testid="submit-invitation" onClick={onSubmit}>{copy.submit}</ArchiveButton>
        <ArchiveButton variant="plain" onClick={onBack}>← 返回修改</ArchiveButton>
      </div>
    </SceneFrame>
  );
}
```

Replace `DeclineScene.tsx` with:

```tsx
"use client";

import { MascotMoment } from "@/components/mascot/MascotMoment";
import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { invitationConfig } from "@/config/invitation";
import { SceneFrame } from "./SceneFrame";

export function SeriousChoiceScene({ onReturn, onDecline }: { onReturn: () => void; onDecline: () => void }) {
  const copy = invitationConfig.copy.decline;
  return (
    <SceneFrame variant="legacy" label={copy.label}>
      <div className="legacy-scene">
        <MascotMoment mood="serious" size="hero" note={copy.body} />
        <h1>{copy.title}</h1>
        <ArchiveButton onClick={onReturn}>{copy.return}</ArchiveButton>
        <ArchiveButton data-testid="decline-today" variant="secondary" onClick={onDecline}>{copy.today}</ArchiveButton>
      </div>
    </SceneFrame>
  );
}

export function DeclinedScene({ onReturn }: { onReturn: () => void }) {
  const copy = invitationConfig.copy.decline;
  return (
    <SceneFrame variant="legacy" label={copy.label}>
      <div className="legacy-scene">
        <MascotMoment mood="serious" size="hero" note={copy.saved} />
        <h1>本次邀请先放一放</h1>
        <ArchiveButton onClick={onReturn}>{copy.return}</ArchiveButton>
      </div>
    </SceneFrame>
  );
}
```

- [ ] **Step 6: Rewire `InvitationFlow` and delete the obsolete combined scene**

Replace the old combined import with:

```ts
import { SubmittingScene } from "./SubmittingScene";
import { SuccessScene } from "./SuccessScene";
```

Keep all switch cases, focus-following logic, shared-plan parsing and scene transition keys unchanged. After `rg` confirms no production reference remains, delete:

```text
src/components/scenes/SubmitSuccessScene.tsx
```

Run:

```bash
rg -n "SubmitSuccessScene|from \"./SubmitSuccessScene\"" src tests
```

Expected: no matches.

- [ ] **Step 7: Verify submission, retry, shared plan and legacy rendering**

Run:

```bash
npm test
npx playwright test tests/e2e/invitation.spec.ts -g "愿意后|提交写入失败|提交中刷新|分享链接|场景切换"
```

Expected: PASS after updating success heading assertions to `好啦，我们要见面了。`, submission text to `正在把心动写进计划…`, and menu expectations to the selected final item.

## Task 10: Finish responsive, print and scene-specific styling

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update metadata to the new product identity**

Replace the metadata object in `src/app/layout.tsx` with:

```ts
export const metadata: Metadata = {
  title: "心动小猪恋爱档案",
  description: "一份会追着拒绝按钮跑、又认真等你批准的可爱约会邀请。",
};
```

- [ ] **Step 2: Align headings, forms and primary buttons with the new tokens**

Ensure these declarations replace the old equivalents in `globals.css`:

```css
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 3px solid var(--coral-dark);
  outline-offset: 3px;
}

h1 {
  margin: 0;
  color: var(--cocoa);
  font-size: clamp(31px, 8.8vw, 40px);
  font-weight: 950;
  line-height: 1.08;
  letter-spacing: -0.045em;
  text-wrap: balance;
}

.scene-subtitle {
  margin: 12px auto 0;
  color: var(--muted);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
  text-align: center;
  text-wrap: balance;
}

.archive-button {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 56px;
  align-items: center;
  justify-content: center;
  padding: 11px 20px;
  cursor: pointer;
  color: var(--cocoa);
  background: var(--coral);
  border: 2.5px solid var(--cocoa);
  border-radius: 999px;
  box-shadow: 0 5px 0 var(--cocoa);
  font-size: 16px;
  font-weight: 950;
  line-height: 1.1;
}

.archive-button:hover:not(:disabled) { background: #ff7890; }
.archive-button:disabled { cursor: not-allowed; opacity: 0.48; box-shadow: 0 2px 0 var(--cocoa); }
.archive-button--secondary { background: var(--sticker-white); }
.archive-button--plain {
  width: auto;
  min-height: 40px;
  margin-inline: auto;
  padding: 7px 10px;
  color: var(--muted);
  background: transparent;
  border: 0;
  box-shadow: none;
  font-size: 12px;
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.schedule-form {
  display: grid;
  gap: 8px;
  margin-top: 18px;
}

.field-label {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.02em;
}

.schedule-form input,
.schedule-form textarea {
  width: 100%;
  color: var(--cocoa);
  background: var(--sticker-white);
  border: 2px solid var(--cocoa);
  border-radius: 14px 17px 13px 16px;
  box-shadow: 0 3px 0 rgba(64, 52, 51, 0.76);
  font-size: 14px;
  font-weight: 750;
}

.schedule-form input { height: 50px; padding: 0 13px; }
.schedule-form textarea { min-height: 70px; padding: 11px 13px; resize: none; }
.validation-note { margin: 10px 0 0; color: var(--muted); font-size: 11px; font-weight: 700; text-align: center; }
.schedule-actions { display: grid; gap: 5px; margin-top: auto; padding-top: 17px; }
```

- [ ] **Step 3: Add submission, pass, shared and legacy layout rules**

Append or replace the corresponding old blocks with:

```css
.scene--submitting .scene-card { justify-content: center; }
.submitting-content,
.submission-error { display: grid; justify-items: center; text-align: center; }
.submitting-content > p,
.submission-error > p { margin: 13px 0 0; color: var(--muted); font-size: 14px; font-weight: 700; }
.submission-error .archive-button { margin-top: 22px; }

.delivery-strip {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  margin-top: 30px;
}

.delivery-panel {
  display: grid;
  min-height: 156px;
  align-content: end;
  justify-items: center;
  overflow: hidden;
  background: #fff0f3;
  border: 2px solid var(--cocoa);
  border-radius: 15px 18px 14px 17px;
}

.delivery-panel:nth-child(2) { background: #e5f4fb; }
.delivery-panel:nth-child(3) { background: #edf6e5; }
.delivery-panel__pig { position: relative; width: 118px; height: 118px; }
.delivery-panel span { padding: 0 0 9px; font-size: 10px; font-weight: 900; }

.scene--success .comic-burst {
  top: 58px;
  right: 12px;
}

.result-card-shell {
  position: relative;
  display: grid;
  width: 100%;
  padding: 18px 16px 16px;
  background: var(--sticker-white);
  border: 2.5px solid var(--cocoa);
  border-radius: 20px 18px 22px 19px;
  box-shadow: 0 5px 0 rgba(64, 52, 51, 0.86);
}

.result-card__heading {
  display: grid;
  grid-template-columns: 1fr 118px;
  align-items: end;
  gap: 4px;
}

.result-card__eyebrow { color: var(--coral-dark); font-size: 9px; font-weight: 950; letter-spacing: 0.09em; }
.result-card__heading h1 { margin-top: 6px; font-size: 28px; }
.result-mascot { position: relative; width: 126px; height: 126px; margin: -24px -10px -4px; }
.heart-row { display: flex; gap: 5px; margin-top: 8px; color: #e8d6dc; }
.heart-row .is-active { color: var(--coral); }

.plan-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 14px;
  overflow: hidden;
  border: 2px dashed var(--cocoa);
  border-radius: 14px;
}

.plan-summary > div { display: grid; min-height: 68px; align-content: center; gap: 4px; padding: 9px 10px; border-right: 1.5px solid var(--cocoa); border-bottom: 1.5px solid var(--cocoa); }
.plan-summary > div:nth-child(2n) { border-right: 0; }
.plan-summary > div:nth-last-child(-n + 2) { border-bottom: 0; }
.plan-summary span { color: var(--coral-dark); font-size: 9px; font-weight: 950; letter-spacing: 0.1em; }
.plan-summary strong { overflow-wrap: anywhere; font-size: 14px; line-height: 1.25; }

.success-body,
.success-copy { margin: 16px 0 0; color: var(--muted); font-size: 12px; font-weight: 700; line-height: 1.5; text-align: center; }
.scene--success > .scene-card > .speech-bubble { margin: 14px auto 0; }
.success-actions { display: grid; gap: 8px; margin-top: auto; padding-top: 18px; }
.text-actions { display: flex; justify-content: center; gap: 4px; }
.scene--shared .archive-button { margin-top: auto; }

.legacy-scene { display: grid; margin-block: auto; justify-items: center; gap: 13px; text-align: center; }
.legacy-actions { display: grid; width: 100%; gap: 7px; margin-top: 14px; }
.scene--legacy .result-card-shell { margin-top: 12px; }
```

- [ ] **Step 4: Replace responsive rules with explicit 360/390/430 behavior**

Use:

```css
@media (max-width: 600px) {
  .invitation-page { display: block; padding: 0; }
  .mobile-stage { width: 100%; max-width: 430px; min-height: 100dvh; margin-inline: auto; }
  .scene { min-height: 100dvh; padding: 12px; }
  .scene-card { min-height: calc(100dvh - 30px); }
}

@media (max-width: 374px) {
  .scene { padding: 9px; }
  .scene-card { padding: 22px 18px 18px; border-radius: 23px 20px 25px 21px; }
  .archive-label { margin-bottom: 10px; }
  .intro-copy h1 { font-size: 34px; }
  .dodge-comic { min-height: 214px; }
  .mascot-moment--large { width: 172px; }
  .mascot-moment--large .mascot-moment__art { height: 172px; }
  .decline-arena { height: 164px; }
  .confirm-panels { gap: 6px; }
  .comic-panel { min-height: 164px; }
  .comic-panel__mascot { width: 124px; height: 124px; }
  .food-grid { gap: 8px 5px; }
  .food-choice { min-height: 134px; padding-inline: 3px; }
  .food-choice__image { width: 60px; height: 60px; }
  .food-choice small { font-size: 8px; }
  .delivery-panel__pig { width: 103px; height: 103px; }
  .result-card__heading { grid-template-columns: 1fr 100px; }
  .result-mascot { width: 108px; height: 108px; }
}
```

At 390 and 430 widths the default rules apply. Do not add viewport-specific absolute coordinates for the decline button; geometry remains DOM-driven.

- [ ] **Step 5: Replace print rules with a pass-only print layout**

Use:

```css
@media print {
  body { background: #fff; }
  .invitation-page { display: block; padding: 0; }
  .mobile-stage { width: 100%; max-width: none; overflow: visible; }
  .scene,
  .scene-card { min-height: auto; padding: 0; }
  .scene-card { border: 0; box-shadow: none; }
  .scene-folder,
  .sticker-doodle,
  .sticker-tape,
  .archive-label,
  .success-actions,
  .success-copy,
  .success-body,
  .speech-bubble,
  .comic-burst { display: none !important; }
  .result-card-shell { break-inside: avoid; box-shadow: none; }
  .result-mascot { display: block; }
}
```

- [ ] **Step 6: Remove stale visual selectors and scan for old tokens**

Delete unused old selectors for `.flower*`, `.intro-content`, `.confirm-content`, `.food-option`, `.food-emoji`, `.submitting-hearts`, `.legacy-summary` and the square `.avatar-mascot` border/background. Then run:

```bash
rg -n "--pink-bg|--pink-dark|--hard-shadow|\.flower|\.food-option|\.food-emoji|submitting-hearts" src/app/globals.css
```

Expected: no matches.

- [ ] **Step 7: Run static checks after the single-owner CSS pass**

Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Expected: all pass. Do not allow another task or subagent to modify `globals.css` concurrently with this task.

## Task 11: Complete regression, accessibility and visual verification

**Files:**
- Modify: `tests/e2e/invitation.spec.ts`
- Modify: `tests/e2e/visual.spec.ts`
- Create/overwrite only new names: `public/screenshots/pig-*.png`

- [ ] **Step 1: Finish E2E expectations for the explicit menu and final pass**

In the happy-path test:

- fill `note-input` with `想坐靠窗的位置`;
- select hotpot, then dessert;
- click `submit-plan`;
- assert success heading `好啦，我们要见面了。`;
- assert displayed menu `甜品`, the note, formatted date and `晚上 19:00`;
- retain the `xin-dong:latest-plan` write count assertion of exactly 1.

Use these exact assertions:

```ts
await page.getByTestId("note-input").fill("想坐靠窗的位置");
await page.getByTestId("food-hotpot").click();
await page.getByTestId("food-dessert").click();
await page.getByTestId("submit-plan").click();
await expect(page.getByRole("heading", { name: "好啦，我们要见面了。" })).toBeVisible({ timeout: 8_000 });
await expect(page.getByText("甜品", { exact: true })).toBeVisible();
await expect(page.getByText("想坐靠窗的位置")).toBeVisible();
```

Update submission-error and refresh tests to select food, then explicitly click `submit-plan`.

- [ ] **Step 2: Add legacy-phase, reduced-motion and print tests**

Append to `tests/e2e/invitation.spec.ts`:

```ts
test("历史 phase 也只显示新小猪贴纸", async ({ page }) => {
  await page.goto("/");
  for (const phase of ["SERIOUS_CHOICE", "DECLINED", "REVIEW"] as const) {
    await page.evaluate(({ phase }) => {
      window.localStorage.setItem("xin-dong:video-invitation-v2", JSON.stringify({
        phase,
        declineStep: 3,
        date: "2099-08-08",
        time: "19:00",
        note: "靠窗",
        foodId: "hotpot",
      }));
    }, { phase });
    await page.reload();
    await expect(page.locator("img").first()).toHaveAttribute("src", /heart-pig/);
  }
});

test("减少动态效果下仍可完成追逐和批准", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const decline = page.getByTestId("decline-action");
  await decline.dispatchEvent("pointerdown", { pointerType: "touch" });
  await expect(decline).toHaveAttribute("data-dodge-step", "1");
  await expect(page.locator("[data-chase-phase='ready']")).toBeVisible();
  await page.getByTestId("approve-action").click();
  await expect(page.getByRole("heading", { name: "等等，你真的批准了？" })).toBeVisible();
});

test("保存通行证调用打印且票根保持可见", async ({ page }) => {
  await page.addInitScript(() => {
    const target = window as typeof window & { __printed?: boolean };
    window.print = () => { target.__printed = true; };
  });
  await page.goto("/");
  await page.getByTestId("approve-action").click();
  await page.getByTestId("confirm-approval").click();
  await page.getByTestId("date-input").fill(getLocalDate(7));
  await page.getByTestId("time-1900").click();
  await page.getByTestId("schedule-next").click();
  await page.getByTestId("food-hotpot").click();
  await page.getByTestId("submit-plan").click();
  await expect(page.getByRole("heading", { name: "好啦，我们要见面了。" })).toBeVisible({ timeout: 8_000 });
  await page.getByRole("button", { name: "保存约会通行证" }).click();
  expect(await page.evaluate(() => (window as typeof window & { __printed?: boolean }).__printed)).toBe(true);
  await expect(page.locator(".plan-summary")).toBeVisible();
});
```

- [ ] **Step 3: Update visual capture to the approved checkpoint list**

In `tests/e2e/visual.spec.ts`, retain `expectNoHorizontalOverflow` and console error collection. Use new screenshot names and capture:

```text
pig-01-intro-390x844.png
pig-02-dodge-1-390x844.png
pig-03-dodge-8-390x844.png
pig-04-dodge-15-390x844.png
pig-05-dodge-18-390x844.png
pig-06-confirm-390x844.png
pig-07-schedule-390x844.png
pig-08-food-empty-390x844.png
pig-09-food-selected-390x844.png
pig-10-submitting-390x844.png
pig-11-success-390x844.png
pig-12-success-360x800.png
pig-13-success-430x932.png
pig-14-intro-1280x900.png
pig-15-shared-390x844.png
```

Use this loop for the chase captures:

```ts
const captureAt = new Set([1, 8, 15, 18]);
for (let count = 1; count <= 18; count += 1) {
  await touchDodge(page);
  if (captureAt.has(count)) {
    await page.screenshot({
      path: `${screenshotDirectory}/pig-${String(count === 1 ? 2 : count === 8 ? 3 : count === 15 ? 4 : 5).padStart(2, "0")}-dodge-${count}-390x844.png`,
      fullPage: true,
    });
  }
}
```

For food, capture once before selection and once after selecting dessert. For shared, build a URL with `createSharePlanUrl`, navigate to it and capture `shared-plan-card`. After every scene and viewport, call `expectNoHorizontalOverflow(page)`.

- [ ] **Step 4: Run the complete automated verification gate**

Run sequentially:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npm run e2e
```

Expected: all commands exit 0; no skipped new tests, no console errors, no Playwright trace from a failure.

- [ ] **Step 5: Run asset and stale-style scans**

Run:

```bash
test "$(find public/mascot/heart-pig -maxdepth 1 -type f -name '*.png' | wc -l | tr -d ' ')" = "9"
test "$(find public/food -maxdepth 1 -type f -name '*.png' | wc -l | tr -d ' ')" = "9"
rg -n "\/mascot\/(serious|surprised|hunter|chef|courier|cool)-|毛绒小角色|food\.emoji|食物自动提交" src tests
```

Expected: both count checks pass and `rg` returns no production matches. Existing rollback PNG files may remain on disk but must not appear in config or rendered source.

- [ ] **Step 6: Inspect the generated screenshots manually**

Open every `public/screenshots/pig-*.png` with `view_image`. Check against the written spec:

1. all people are the same new pink pig; no watermark, white rectangle or old fuzzy mascot;
2. intro, chase, confirm, menu, submit and success read as one product;
3. chase screenshots show ready, lunge and miss stages clearly;
4. no bubble, pig, button, menu label or pass field is cropped;
5. 3×3 food cards remain identifiable at 360px;
6. 75% of the screen remains an orderly archive UI and comic bursts stay local;
7. success and shared passes are readable and print-safe.

If any screenshot fails, fix the smallest responsible component or CSS rule, rerun the affected Playwright test, then rerun the full gate before claiming completion.

- [ ] **Step 7: Open the finished app for the user**

Start the verified app without replacing any unrelated running service:

```bash
npm run dev -- --port 3000
```

When the server reports ready, run:

```bash
open http://127.0.0.1:3000
```

Keep the dev server alive for user review. Report the local URL, the key visual changes, automated verification results and the screenshot directory.
