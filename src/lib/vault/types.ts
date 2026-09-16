export const REPORT_REASONS = ["malware", "license", "illegal", "other"] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export type VaultFile = {
  path: string;
  size: number;
  sha256: string;
  role: "weight" | "sidecar";
};

export type VaultRecord = {
  key: string;
  id: string;
  revision: string;
  license: string;
  pipeline?: string;
  pinnedAt: string;
  files: VaultFile[];
  source: "huggingface";
};

export type VaultReport = {
  id: string;
  modelId: string;
  revision: string;
  reason: ReportReason;
  note: string;
  at: string;
};

export type AdmitOk = { ok: true; record: VaultRecord };
export type AdmitErr = { ok: false; reason: string };
export type AdmitResult = AdmitOk | AdmitErr;
