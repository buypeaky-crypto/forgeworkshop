export type RouteDecision = {
  task: string;
  label: string;
  reason: string;
};

const RULES: { task: string; label: string; keywords: string[]; reason: string }[] = [
  {
    task: "automatic-speech-recognition",
    label: "Speech recognition",
    keywords: ["transcribe", "transcript", "speech", "audio", "whisper", "voice", "podcast"],
    reason: "The prompt mentions audio or transcription.",
  },
  {
    task: "text-to-image",
    label: "Image generation",
    keywords: ["image", "picture", "photo", "illustration", "draw", "render", "painting", "logo"],
    reason: "The prompt asks for a picture or visual.",
  },
  {
    task: "image-classification",
    label: "Vision",
    keywords: ["classify this image", "what is in this photo", "detect object"],
    reason: "The prompt is a vision / image-understanding request.",
  },
  {
    task: "translation",
    label: "Translation",
    keywords: ["translate", "french", "spanish", "german", "japanese", "chinese", "into english"],
    reason: "The prompt is a translation request.",
  },
  {
    task: "summarization",
    label: "Summarization",
    keywords: ["summarize", "summary", "tldr", "tl;dr", "condense", "key points"],
    reason: "The prompt asks to compress or recap text.",
  },
  {
    task: "question-answering",
    label: "Question answering",
    keywords: ["who is", "what is", "when did", "where is", "why did", "how many"],
    reason: "The prompt is phrased as a factual question.",
  },
  {
    task: "text-classification",
    label: "Classification",
    keywords: ["sentiment", "classify", "label this", "toxic", "positive or negative"],
    reason: "The prompt asks to label or score text.",
  },
  {
    task: "token-classification",
    label: "Token classification",
    keywords: ["ner", "named entity", "extract entities", "person location org"],
    reason: "The prompt wants span-level entity tags.",
  },
  {
    task: "fill-mask",
    label: "Fill-mask",
    keywords: ["[mask]", "<mask>", "fill in the blank"],
    reason: "The prompt is a cloze / masked-language task.",
  },
  {
    task: "feature-extraction",
    label: "Embeddings",
    keywords: ["embed", "embedding", "vector", "similarity", "semantic search"],
    reason: "The prompt asks for representations, not generation.",
  },
  {
    task: "text-generation",
    label: "Text generation",
    keywords: ["write", "story", "code", "chat", "explain", "draft", "poem", "email"],
    reason: "The prompt is a generation / writing request.",
  },
];

export function routePrompt(prompt: string): RouteDecision {
  const text = prompt.trim().toLowerCase();
  if (!text) {
    return {
      task: "text-generation",
      label: "Text generation",
      reason: "Empty prompt — defaulting to general text generation.",
    };
  }
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return { task: rule.task, label: rule.label, reason: rule.reason };
    }
  }
  return {
    task: "text-generation",
    label: "Text generation",
    reason: "No specialized signal — routing to general text models.",
  };
}
