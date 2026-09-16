import assert from "node:assert/strict";
import test from "node:test";
import { classifyModel } from "./domains.ts";
import { scoreModel } from "./score.ts";
import { applyExceptions, pickShelf } from "./triage.ts";
import { DEFAULT_SETTINGS } from "./types.ts";

test("classify routes whisper to audio and llama to language", () => {
  assert.equal(
    classifyModel({ id: "openai/whisper-large-v3", pipeline_tag: "automatic-speech-recognition" }, []),
    "audio",
  );
  assert.equal(
    classifyModel({ id: "meta-llama/Llama-3.1-8B", pipeline_tag: "text-generation" }, []),
    "language",
  );
  assert.equal(
    classifyModel({ id: "bigcode/starcoder2-15b", pipeline_tag: "text-generation", tags: ["code"] }, []),
    "code",
  );
});

test("domain rules beat default classification", () => {
  const domain = classifyModel(
    { id: "acme/custom-vision-llm", pipeline_tag: "text-generation" },
    [{ id: "r1", kind: "keyword", match: "vision-llm", domain: "vision" }],
  );
  assert.equal(domain, "vision");
});

test("score prefers high downloads and recency", () => {
  const now = Date.parse("2026-09-15T00:00:00Z");
  const hot = scoreModel(
    {
      downloads: 4_000_000,
      likes: 3000,
      lastModified: "2026-09-10T00:00:00Z",
      pipeline_tag: "text-generation",
      hasSafetensors: true,
      license: "mit",
    },
    "language",
    now,
  );
  const cold = scoreModel(
    {
      downloads: 200,
      likes: 2,
      lastModified: "2022-01-01T00:00:00Z",
      pipeline_tag: "text-generation",
    },
    "language",
    now,
  );
  assert.ok(hot.total > cold.total);
  assert.ok(hot.downloads > cold.downloads);
  assert.ok(hot.recency > cold.recency);
});

test("exclusions drop models and pins survive quota", () => {
  const scored = applyExceptions(
    [
      { id: "org/a", downloads: 9_000_000, pipeline_tag: "text-generation" },
      { id: "org/skip", downloads: 8_000_000, pipeline_tag: "text-generation" },
      { id: "org/pin", downloads: 10, pipeline_tag: "text-generation" },
    ],
    ["org/skip"],
    [],
  );
  assert.equal(scored.some((s) => s.id === "org/skip"), false);
  const kept = pickShelf(scored, { "org/pin": { policy: "follow" } }, {
    ...DEFAULT_SETTINGS,
    keepPerDomain: 1,
    maxModels: 8,
  });
  assert.ok(kept.some((k) => k.id === "org/pin"));
  assert.equal(kept.filter((k) => k.domain === "language").length <= 2, true);
});
