import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const TASKS = [
  { id: "", label: "All" },
  { id: "text-generation", label: "Text gen" },
  { id: "text-classification", label: "Classify" },
  { id: "summarization", label: "Summarize" },
  { id: "translation", label: "Translate" },
  { id: "question-answering", label: "Q&A" },
  { id: "fill-mask", label: "Fill-mask" },
  { id: "token-classification", label: "Tokens" },
  { id: "feature-extraction", label: "Embed" },
  { id: "text-to-image", label: "Images" },
  { id: "image-classification", label: "Vision" },
  { id: "image-to-text", label: "Caption" },
  { id: "automatic-speech-recognition", label: "Speech" },
  { id: "object-detection", label: "Detect" },
] as const;

export type PipelineTask = (typeof TASKS)[number]["id"];

export type HubModel = {
  id: string;
  pipeline_tag?: string;
  library_name?: string;
  downloads?: number;
  likes?: number;
  tags?: string[];
  lastModified?: string;
  createdAt?: string;
  private?: boolean;
  sha?: string;
};

export type HubModelDetail = HubModel & {
  cardData?: {
    license?: string;
    language?: string[] | string;
    datasets?: string[] | string;
    pretty_name?: string;
  };
  siblings?: { rfilename: string }[];
  safetensors?: { total?: number; parameters?: Record<string, number> };
  gated?: boolean | string | null;
  disabled?: boolean;
};

export type HubTreeEntry = {
  type?: string;
  path?: string;
  size?: number;
  oid?: string;
  lfs?: { oid?: string; size?: number; pointerSize?: number };
};

export type VaultInspect = {
  id: string;
  sha: string | null;
  private?: boolean;
  gated?: HubModelDetail["gated"];
  pipeline_tag?: string;
  tags?: string[];
  license?: string | null;
  tree: HubTreeEntry[];
  error?: string;
};

export type HubSnapshot = {
  id: string;
  sha: string | null;
  lastModified: string | null;
  downloads: number;
  likes: number;
  pipeline?: string;
  library?: string;
  license?: string;
  tags: string[];
  files: string[];
  params?: number;
  hasSafetensors: boolean;
  error?: string;
};

const listInput = z.object({
  q: z.string().optional(),
  task: z.string().optional(),
  sort: z.enum(["downloads", "likes", "lastModified"]).optional(),
  limit: z.number().int().min(1).max(48).optional(),
});

async function hubFetch<T>(path: string): Promise<T> {
  const res = await fetch(`https://huggingface.co/api/${path}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Forge/1.1 (Hugging Face model workshop)",
    },
  });
  if (!res.ok) {
    throw new Error(`Hugging Face Hub returned ${res.status}`);
  }
  return (await res.json()) as T;
}

function normalizeId(id: string): string {
  const clean = id.replace(/^\/+|\/+$/g, "");
  if (!clean || clean.includes("..") || clean.startsWith("http")) {
    throw new Error("Invalid model id");
  }
  return clean;
}

function gatedFlag(value: unknown): boolean | string | null {
  if (value == null || value === false) return null;
  if (value === true) return true;
  if (typeof value === "string") return value === "false" ? null : value;
  return true;
}

function asDetail(model: HubModelDetail): HubModelDetail {
  return { ...model, gated: gatedFlag(model.gated) };
}

async function listHub(opts: {
  q?: string;
  task?: string;
  sort?: "downloads" | "likes" | "lastModified";
  limit: number;
}): Promise<HubModel[]> {
  const params = new URLSearchParams();
  const q = opts.q?.trim();
  if (q) params.set("search", q);
  if (opts.task) params.set("pipeline_tag", opts.task);
  params.set("sort", opts.sort ?? "downloads");
  params.set("direction", "-1");
  params.set("limit", String(opts.limit));
  params.set("config", "0");
  try {
    return await hubFetch<HubModel[]>(`models?${params.toString()}`);
  } catch {
    return [];
  }
}

export const listModels = createServerFn({ method: "GET" })
  .validator(listInput)
  .handler(async ({ data }): Promise<HubModel[]> => {
    return listHub({
      q: data.q,
      task: data.task,
      sort: data.sort,
      limit: data.limit ?? 24,
    });
  });

export const getModel = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1).max(200) }))
  .handler(async ({ data }): Promise<HubModelDetail> => {
    return asDetail(await hubFetch<HubModelDetail>(`models/${normalizeId(data.id)}`));
  });

const SCOUTS = [
  { task: "text-generation", limit: 16 },
  { task: "image-classification", limit: 12 },
  { task: "automatic-speech-recognition", limit: 12 },
  { task: "text-to-image", limit: 12 },
  { q: "code", task: "text-generation", limit: 12 },
  { q: "biology", limit: 12 },
  { q: "medical", limit: 12 },
  { sort: "lastModified" as const, limit: 16 },
];

export const scoutHub = createServerFn({ method: "GET" }).handler(
  async (): Promise<HubModel[]> => {
    const batches = await Promise.all(
      SCOUTS.map((s) =>
        listHub({
          q: "q" in s ? s.q : undefined,
          task: "task" in s ? s.task : undefined,
          sort: "sort" in s ? s.sort : "downloads",
          limit: s.limit,
        }),
      ),
    );
    const seen = new Set<string>();
    const merged: HubModel[] = [];
    for (const batch of batches) {
      for (const model of batch) {
        if (!model.id || seen.has(model.id)) continue;
        seen.add(model.id);
        merged.push(model);
      }
    }
    return merged;
  },
);

function toSnapshot(model: HubModelDetail): HubSnapshot {
  const files = (model.siblings ?? []).map((s) => s.rfilename).slice(0, 40);
  const hasSafetensors =
    Boolean(model.safetensors?.total) || files.some((f) => f.endsWith(".safetensors"));
  return {
    id: model.id,
    sha: model.sha ?? null,
    lastModified: model.lastModified ?? null,
    downloads: model.downloads ?? 0,
    likes: model.likes ?? 0,
    pipeline: model.pipeline_tag,
    library: model.library_name,
    license: model.cardData?.license,
    tags: model.tags ?? [],
    files,
    params: model.safetensors?.total,
    hasSafetensors,
  };
}

async function mapPool<T, R>(items: T[], n: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i;
      i += 1;
      out[idx] = await fn(items[idx] as T);
    }
  }
  const workers = Array.from({ length: Math.min(n, Math.max(1, items.length)) }, () => worker());
  await Promise.all(workers);
  return out;
}

export const pullSnapshots = createServerFn({ method: "POST" })
  .validator(z.object({ ids: z.array(z.string().min(1).max(200)).max(40) }))
  .handler(async ({ data }): Promise<HubSnapshot[]> => {
    const ids = [...new Set(data.ids.map((id) => id.trim()).filter(Boolean))].slice(0, 40);
    return mapPool(ids, 6, async (id) => {
      try {
        const model = await hubFetch<HubModelDetail>(`models/${normalizeId(id)}`);
        return toSnapshot(model);
      } catch (err) {
        return {
          id,
          sha: null,
          lastModified: null,
          downloads: 0,
          likes: 0,
          tags: [],
          files: [],
          hasSafetensors: false,
          error: err instanceof Error ? err.message : "Pull failed",
        };
      }
    });
  });

async function fetchTree(id: string, revision: string): Promise<HubTreeEntry[]> {
  const params = new URLSearchParams({ recursive: "1" });
  try {
    const tree = await hubFetch<HubTreeEntry[]>(
      `models/${id}/tree/${encodeURIComponent(revision)}?${params.toString()}`,
    );
    if (!Array.isArray(tree)) return [];
    return tree.filter((e) => e && e.type !== "directory").slice(0, 200);
  } catch {
    return [];
  }
}

export const inspectForVault = createServerFn({ method: "GET" })
  .validator(
    z.object({
      id: z.string().min(1).max(200),
      revision: z.string().min(1).max(80).optional(),
    }),
  )
  .handler(async ({ data }): Promise<VaultInspect> => {
    const id = normalizeId(data.id);
    try {
      const model = asDetail(await hubFetch<HubModelDetail>(`models/${id}`));
      if (model.private) {
        return {
          id,
          sha: null,
          private: true,
          gated: model.gated,
          tree: [],
          error: "Private models are not eligible.",
        };
      }
      const revision = data.revision?.trim() || model.sha || "main";
      const tree = await fetchTree(id, revision);
      return {
        id: model.id ?? id,
        sha: model.sha ?? revision,
        private: model.private,
        gated: model.gated,
        pipeline_tag: model.pipeline_tag,
        tags: model.tags,
        license: model.cardData?.license ?? null,
        tree,
      };
    } catch (err) {
      return {
        id,
        sha: null,
        tree: [],
        error: err instanceof Error ? err.message : "Hub inspect failed",
      };
    }
  });
