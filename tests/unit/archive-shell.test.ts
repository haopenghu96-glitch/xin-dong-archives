import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

test("SceneFrame renders a stable sticker archive instead of announcing the full scene", async () => {
  const { SceneFrame } = await import("../../src/components/scenes/SceneFrame");
  const markup = renderToStaticMarkup(
    createElement(
      SceneFrame,
      { variant: "intro", className: "example", label: "机密文件" },
      createElement("p", null, "申请内容"),
    ),
  );

  assert.match(markup, /<section[^>]+scene--intro[^>]+example/);
  assert.doesNotMatch(markup, /aria-live=/);
  assert.match(markup, /sticker-doodle--heart/);
  assert.match(markup, /sticker-doodle--star/);
  assert.match(markup, /sticker-tape--top/);
  assert.match(markup, /sticker-tape--side/);
  assert.match(markup, /scene-folder/);
  assert.match(markup, /archive-label[^>]*>机密文件/);
  assert.match(markup, /申请内容/);
});

test("ArchiveButton delegates press motion to the reduced-motion preference", async () => {
  const source = await readFile(
    new URL("../../src/components/ui/ArchivePrimitives.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /useReducedMotion/);
  assert.match(source, /const reducedMotion = useReducedMotion\(\)/);
  assert.match(source, /whileTap=\{reducedMotion \? undefined : \{ scale: 0\.96, x: 1, y: 2 \}\}/);
});

test("global archive shell uses the new semantic palette and shared sticker primitives", async () => {
  const css = await readFile(
    new URL("../../src/app/globals.css", import.meta.url),
    "utf8",
  );

  for (const token of [
    "--milk-pink",
    "--pig-pink",
    "--snout-pink",
    "--paper",
    "--sticker-white",
    "--coral",
    "--cocoa",
    "--soft-shadow",
  ]) {
    assert.match(css, new RegExp(token));
  }

  for (const selector of [
    ".scene-folder",
    ".sticker-doodle",
    ".sticker-tape",
    ".speech-bubble",
    ".comic-burst",
    ".mascot-moment",
    ".food-choice",
  ]) {
    assert.match(css, new RegExp(selector.replace(".", "\\.")));
  }

  for (const legacyToken of [
    "--pink-bg",
    "--pink:",
    "--pink-dark",
    "--card:",
    "--ink:",
    "--hard-shadow",
  ]) {
    assert.doesNotMatch(css, new RegExp(legacyToken.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&")));
  }
});
