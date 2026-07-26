import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

test("SpeechBubble renders a polite mint live region with forwarded test id", async () => {
  const { SpeechBubble } = await import(
    "../../src/components/ui/SpeechBubble"
  );
  const markup = renderToStaticMarkup(
    createElement(
      SpeechBubble,
      { tone: "mint", live: true, testId: "bubble" },
      "今晚见",
    ),
  );

  assert.match(markup, /class="speech-bubble speech-bubble--mint"/);
  assert.match(markup, /role="status"/);
  assert.match(markup, /aria-live="polite"/);
  assert.match(markup, /data-testid="bubble"/);
  assert.match(markup, />今晚见<\/p>/);
});

test("SpeechBubble stays silent when live is false", async () => {
  const { SpeechBubble } = await import(
    "../../src/components/ui/SpeechBubble"
  );
  const markup = renderToStaticMarkup(
    createElement(SpeechBubble, { live: false }, "安静提示"),
  );

  assert.doesNotMatch(markup, /role=/);
  assert.doesNotMatch(markup, /aria-live=/);
  assert.match(markup, /安静提示/);
});

test("ComicBurst renders nothing while inactive", async () => {
  const { ComicBurst } = await import("../../src/components/ui/ComicBurst");

  assert.equal(
    renderToStaticMarkup(createElement(ComicBurst, { label: "咻", active: false })),
    "",
  );
});

test("ComicBurst renders an accessible-hidden blue burst while active", async () => {
  const { ComicBurst } = await import("../../src/components/ui/ComicBurst");
  const markup = renderToStaticMarkup(
    createElement(ComicBurst, {
      label: "等等！",
      active: true,
      tone: "blue",
      testId: "burst",
    }),
  );

  assert.match(markup, /class="comic-burst comic-burst--blue"/);
  assert.match(markup, /aria-hidden="true"/);
  assert.match(markup, /data-testid="burst"/);
  assert.match(markup, /等等！/);
});

test("FoodIcon snacks uses the snack-basket drawing and cocoa line color", async () => {
  const { FoodIcon } = await import("../../src/components/ui/FoodIcon");
  const markup = renderToStaticMarkup(createElement(FoodIcon, { name: "snacks" }));

  assert.match(markup, /^<svg/);
  assert.match(markup, /M18 28h60l-7 34H25z/);
  assert.match(markup, /#a9d9ec/);
  assert.match(markup, /#403433/);
  assert.doesNotMatch(markup, /#181511/);
});

test("Mascot exposes its serious mood and responsive image contract", async () => {
  const { Mascot } = await import("../../src/components/mascot/Mascot");
  const markup = renderToStaticMarkup(
    createElement(Mascot, { mood: "serious", animate: false }),
  );

  assert.match(markup, /data-mood="serious"/);
  assert.match(markup, /alt="抱着小信封、认真等待回复的奶油小猫管理员"/);
  assert.match(markup, /sizes="\(max-width: 480px\) 52vw, 240px"/);
});

test("MascotMoment composes a large centered serious mascot with its note", async () => {
  const { MascotMoment } = await import(
    "../../src/components/mascot/MascotMoment"
  );
  const markup = renderToStaticMarkup(
    createElement(MascotMoment, {
      mood: "serious",
      note: "档案审核中",
      size: "large",
      align: "center",
    }),
  );

  assert.match(markup, /data-mood="serious"/);
  assert.match(markup, /mascot-moment--large/);
  assert.match(markup, /mascot-moment--center/);
  assert.match(markup, /档案审核中/);
});

test("DodgeComicBeat maps step five to the lunge comic beat", async () => {
  const { DodgeComicBeat } = await import(
    "../../src/components/mascot/DodgeComicBeat"
  );
  const markup = renderToStaticMarkup(
    createElement(DodgeComicBeat, { step: 5, note: "别跑" }),
  );

  assert.match(markup, /data-chase-phase="lunge"/);
  assert.match(markup, /data-testid="decline-aside"/);
  assert.match(markup, /data-testid="decline-sfx"/);
  assert.match(markup, /等等！/);
});

test("DodgeComicBeat keeps the idle step free of burst copy", async () => {
  const { DodgeComicBeat } = await import(
    "../../src/components/mascot/DodgeComicBeat"
  );
  const markup = renderToStaticMarkup(
    createElement(DodgeComicBeat, { step: 0, note: "先看看" }),
  );

  assert.match(markup, /data-chase-phase="idle"/);
  assert.doesNotMatch(markup, /data-testid="decline-sfx"/);
  assert.doesNotMatch(markup, />咻<|>等等！<|>扑空！</);
});

test("FoodChoiceCard renders the unselected hotpot option without eager loading", async () => {
  const [{ FoodChoiceCard }, { invitationConfig }] = await Promise.all([
    import("../../src/components/ui/FoodChoiceCard"),
    import("../../src/config/invitation"),
  ]);
  const markup = renderToStaticMarkup(
    createElement(FoodChoiceCard, {
      food: invitationConfig.foodOptions[0],
      selected: false,
      onSelect: () => undefined,
    }),
  );

  assert.match(markup, /^<button/);
  assert.match(markup, /data-testid="food-hotpot"/);
  assert.match(markup, /aria-pressed="false"/);
  assert.match(markup, /火锅/);
  assert.match(markup, /把拘谨一起煮开/);
  assert.match(markup, /sizes="110px"/);
  assert.doesNotMatch(markup, /fetchPriority="high"|fetchpriority="high"/);
  assert.doesNotMatch(markup, /<link[^>]+rel="preload"[^>]+as="image"/);
});

test("FoodChoiceCard marks the selected hotpot option", async () => {
  const [{ FoodChoiceCard }, { invitationConfig }] = await Promise.all([
    import("../../src/components/ui/FoodChoiceCard"),
    import("../../src/config/invitation"),
  ]);
  const markup = renderToStaticMarkup(
    createElement(FoodChoiceCard, {
      food: invitationConfig.foodOptions[0],
      selected: true,
      onSelect: () => undefined,
    }),
  );

  assert.match(markup, /aria-pressed="true"/);
  assert.match(markup, /就它了！/);
});

test("image primitives reset failure state by resource key instead of delayed timers", async () => {
  const [mascotSource, foodCardSource] = await Promise.all([
    readFile(new URL("../../src/components/mascot/Mascot.tsx", import.meta.url), "utf8"),
    readFile(new URL("../../src/components/ui/FoodChoiceCard.tsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(mascotSource, /useEffect|setTimeout/);
  assert.doesNotMatch(foodCardSource, /useEffect|setTimeout/);
  assert.match(mascotSource, /key=\{mascot\.src\}/);
  assert.match(foodCardSource, /key=\{food\.imageSrc\}/);
});

test("FoodChoiceCard suppresses its tap and selection motion for reduced-motion users", async () => {
  const foodCardSource = await readFile(
    new URL("../../src/components/ui/FoodChoiceCard.tsx", import.meta.url),
    "utf8",
  );

  assert.match(foodCardSource, /useReducedMotion/);
  assert.match(foodCardSource, /const reducedMotion = useReducedMotion\(\)/);
  assert.match(foodCardSource, /whileTap=\{reducedMotion \? undefined : \{ scale: 0\.96 \}\}/);
  assert.match(foodCardSource, /previewed \? -6 : 0/);
});
