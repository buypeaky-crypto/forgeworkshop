import { domainMeta } from "./domains";
import type { DomainId, ScoreParts } from "./types";

const DOWNLOAD_REF = 5_000_000;
const LIKES_REF = 8_000;
const RECENCY_TAU_DAYS = 45;

const PERMISSIVE = new Set([
  "mit",
  "apache-2.0",
  "apache-2.0-like",
  "bsd-3-clause",
  "bsd-2-clause",
  "isc",
  "cc-by-4.0",
  "cc0-1.0",
  "unlicense",
  "llama3",
  "llama3.1",
  "llama3.2",
  "llama3.3",
  "gemma",
  "gemma-2",
  "qwen-research",
  "osl-3.0",
]);

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function logNorm(n: number, ref: number): number {
  return clamp01(Math.log1p(Math.max(0, n)) / Math.log1p(ref));
}

function recencyScore(lastModified?: string, now = Date.now()): number {
  if (!lastModified) return 0.25;
  const t = Date.parse(lastModified);
  if (Number.isNaN(t)) return 0.25;
  const ageDays = Math.max(0, (now - t) / 86_400_000);
  return clamp01(Math.exp(-ageDays / RECENCY_TAU_DAYS));
}

function qualityScore(model: {
  tags?: string[];
  license?: string;
  hasSafetensors?: boolean;
  likes?: number;
}): number {
  let q = 0;
  if (model.hasSafetensors) q += 0.45;
  const license = (model.license ?? "").toLowerCase();
  if (license && PERMISSIVE.has(license)) q += 0.25;
  const tags = (model.tags ?? []).map((t) => t.toLowerCase());
  if (tags.some((t) => t.startsWith("arxiv:") || t === "paper" || t === "eval-results")) {
    q += 0.2;
  }
  if ((model.likes ?? 0) >= 200) q += 0.1;
  return clamp01(q);
}

function taskFitScore(
  model: { pipeline_tag?: string; tags?: string[] },
  domain: DomainId,
): number {
  const meta = domainMeta(domain);
  const pipeline = (model.pipeline_tag ?? "").toLowerCase();
  if (pipeline && meta.pipelines.includes(pipeline)) return 1;
  const tags = (model.tags ?? []).map((t) => t.toLowerCase());
  if (tags.some((t) => meta.tags.includes(t))) return 0.7;
  if (domain === "other") return 0.4;
  return 0.35;
}

export function scoreModel(
  model: {
    downloads?: number;
    likes?: number;
    lastModified?: string;
    pipeline_tag?: string;
    tags?: string[];
    license?: string;
    hasSafetensors?: boolean;
  },
  domain: DomainId,
  now = Date.now(),
): ScoreParts {
  const downloads = logNorm(model.downloads ?? 0, DOWNLOAD_REF);
  const likes = logNorm(model.likes ?? 0, LIKES_REF);
  const recency = recencyScore(model.lastModified, now);
  const quality = qualityScore(model);
  const taskFit = taskFitScore(model, domain);
  const total = clamp01(
    0.35 * downloads + 0.15 * likes + 0.2 * recency + 0.15 * quality + 0.15 * taskFit,
  );
  return { downloads, likes, recency, quality, taskFit, total };
}

export function formatScore(n: number): string {
  return n.toFixed(2);
}
