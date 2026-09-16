export const DOMAIN_IDS = [
  "language",
  "vision",
  "audio",
  "multimodal",
  "code",
  "science",
  "other",
] as const;

export type DomainId = (typeof DOMAIN_IDS)[number];

export type PinPolicy = "follow" | "lock";

export type DomainRule = {
  id: string;
  kind: "pipeline" | "tag" | "keyword";
  match: string;
  domain: DomainId;
};

export type ScoreParts = {
  downloads: number;
  likes: number;
  recency: number;
  quality: number;
  taskFit: number;
  total: number;
};

export type RevisionSnapshot = {
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
  pulledAt: string;
};

export type BayModel = {
  id: string;
  domain: DomainId;
  origin: "auto" | "pin" | "manual";
  score: ScoreParts;
  snapshot: RevisionSnapshot;
  history: RevisionSnapshot[];
  status: "current" | "updated" | "locked" | "stale" | "error";
  pending?: RevisionSnapshot;
  error?: string;
};

export type SyncLogEntry = {
  at: string;
  action: "added" | "updated" | "kept" | "dropped" | "locked" | "error" | "pinned";
  id: string;
  detail: string;
};

export type BaySettings = {
  intervalHours: 6 | 12 | 24;
  keepPerDomain: number;
  maxModels: number;
};

export const DEFAULT_SETTINGS: BaySettings = {
  intervalHours: 12,
  keepPerDomain: 5,
  maxModels: 36,
};
