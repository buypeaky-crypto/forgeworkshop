import type { DomainId, DomainRule } from "./types";
import { DOMAIN_IDS } from "./types";

export const DOMAINS: {
  id: DomainId;
  label: string;
  blurb: string;
  pipelines: string[];
  tags: string[];
  keywords: string[];
}[] = [
  {
    id: "language",
    label: "Language",
    blurb: "Text generation, translation, classify, embed.",
    pipelines: [
      "text-generation",
      "text-classification",
      "summarization",
      "translation",
      "question-answering",
      "fill-mask",
      "token-classification",
      "feature-extraction",
      "sentence-similarity",
      "text2text-generation",
    ],
    tags: ["nlp", "llm", "language-model"],
    keywords: ["bert", "gpt", "llama", "mistral", "qwen", "phi", "gemma", "t5"],
  },
  {
    id: "vision",
    label: "Vision",
    blurb: "Classify, detect, segment still images.",
    pipelines: [
      "image-classification",
      "object-detection",
      "image-segmentation",
      "depth-estimation",
      "zero-shot-image-classification",
      "mask-generation",
    ],
    tags: ["computer-vision", "vision"],
    keywords: ["vit", "yolo", "resnet", "clip", "sam", "detr"],
  },
  {
    id: "audio",
    label: "Audio",
    blurb: "Speech, transcription, voice, sound.",
    pipelines: [
      "automatic-speech-recognition",
      "text-to-speech",
      "audio-classification",
      "text-to-audio",
      "voice-activity-detection",
    ],
    tags: ["audio", "speech"],
    keywords: ["whisper", "wav2vec", "speecht5", "bark", "tts"],
  },
  {
    id: "multimodal",
    label: "Multimodal",
    blurb: "Image ↔ text, vision-language, generation.",
    pipelines: [
      "text-to-image",
      "image-to-text",
      "image-text-to-text",
      "visual-question-answering",
      "any-to-any",
      "document-question-answering",
    ],
    tags: ["multimodal", "vision-language"],
    keywords: ["llava", "blip", "sdxl", "stable-diffusion", "flux", "idefics"],
  },
  {
    id: "code",
    label: "Code",
    blurb: "Coders, fill-in, repair, agents that write software.",
    pipelines: ["text-generation", "text2text-generation", "fill-mask"],
    tags: ["code", "code-generation"],
    keywords: ["coder", "code", "starcoder", "codellama", "deepseek-coder", "qwen2.5-coder"],
  },
  {
    id: "science",
    label: "Science",
    blurb: "Bio, chem, medical, protein, climate.",
    pipelines: ["text-generation", "token-classification", "fill-mask", "feature-extraction"],
    tags: ["biology", "chemistry", "medical", "science", "protein", "climate"],
    keywords: ["biomed", "chem", "protein", "esm", "mol", "clinical", "pubmed"],
  },
  {
    id: "other",
    label: "Other",
    blurb: "Useful models that do not fit a shelf.",
    pipelines: [],
    tags: [],
    keywords: [],
  },
];

export function domainMeta(id: DomainId) {
  return DOMAINS.find((d) => d.id === id) ?? DOMAINS[DOMAINS.length - 1]!;
}

function haystack(id: string, tags: string[], pipeline?: string): string {
  return `${id} ${(tags ?? []).join(" ")} ${pipeline ?? ""}`.toLowerCase();
}

export function matchesRule(
  model: { id: string; pipeline_tag?: string; tags?: string[] },
  rule: DomainRule,
): boolean {
  const needle = rule.match.trim().toLowerCase();
  if (!needle) return false;
  if (rule.kind === "pipeline") {
    return (model.pipeline_tag ?? "").toLowerCase() === needle;
  }
  if (rule.kind === "tag") {
    return (model.tags ?? []).some((t) => t.toLowerCase() === needle);
  }
  return haystack(model.id, model.tags ?? [], model.pipeline_tag).includes(needle);
}

export function classifyModel(
  model: { id: string; pipeline_tag?: string; tags?: string[] },
  rules: DomainRule[],
): DomainId {
  for (const rule of rules) {
    if (matchesRule(model, rule)) return rule.domain;
  }

  const id = model.id.toLowerCase();
  const tags = (model.tags ?? []).map((t) => t.toLowerCase());
  const pipeline = (model.pipeline_tag ?? "").toLowerCase();
  const text = haystack(model.id, model.tags ?? [], model.pipeline_tag);

  const code = DOMAINS.find((d) => d.id === "code")!;
  if (
    tags.some((t) => code.tags.includes(t)) ||
    code.keywords.some((k) => text.includes(k))
  ) {
    return "code";
  }

  const science = DOMAINS.find((d) => d.id === "science")!;
  if (
    tags.some((t) => science.tags.includes(t)) ||
    science.keywords.some((k) => text.includes(k))
  ) {
    return "science";
  }

  for (const domain of DOMAINS) {
    if (domain.id === "other" || domain.id === "code" || domain.id === "science") continue;
    if (pipeline && domain.pipelines.includes(pipeline)) return domain.id;
    if (tags.some((t) => domain.tags.includes(t))) return domain.id;
  }

  if (id.includes("whisper") || pipeline.includes("speech") || pipeline.includes("audio")) {
    return "audio";
  }
  if (pipeline.includes("image") || pipeline.includes("vision")) return "vision";
  if (pipeline.includes("text")) return "language";

  return "other";
}

export function isDomainId(value: string): value is DomainId {
  return (DOMAIN_IDS as readonly string[]).includes(value);
}
