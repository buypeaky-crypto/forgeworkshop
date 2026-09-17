export const AVAILABILITY = [
  "Live on HF",
  "Web-seed only",
  "Rescued by swarm",
  "Hash mismatch",
] as const;

export type Availability = (typeof AVAILABILITY)[number];

export type TrustFile = {
  path: string;
  size: number;
  sha256: string;
};

export type TrustCard = {
  id: string;
  revision: string | null;
  license: string | null;
  files: TrustFile[];
  hubLive: boolean;
  resolveLive: boolean;
  gated: boolean;
  error?: string;
};

export type VerifyFileResult = {
  path: string;
  expected: string;
  actual: string | null;
  match: boolean;
  source: "remote" | "local" | "lfs";
  detail: string;
};
