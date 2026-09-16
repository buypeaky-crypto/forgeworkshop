import { fileSha256, isWeightPath, type HubTreeEntry } from "./hashes";
import { isPermissiveLicense, licenseFromTags, normalizeLicense } from "./licenses";
import { isTakenDown } from "./takedowns";
import type { AdmitResult, VaultFile, VaultRecord } from "./types";

export type HubAdmitInput = {
  id: string;
  sha?: string | null;
  private?: boolean;
  gated?: boolean | string | null;
  pipeline_tag?: string;
  tags?: string[];
  license?: string | null;
  tree: HubTreeEntry[];
};

function isGated(gated: HubAdmitInput["gated"]): boolean {
  if (gated == null || gated === false) return false;
  if (gated === true) return true;
  if (typeof gated === "string") return gated.length > 0 && gated !== "false";
  return Object.keys(gated).length > 0;
}

export function admitFromHub(input: HubAdmitInput, now = new Date().toISOString()): AdmitResult {
  const id = input.id.trim();
  if (!id || id.includes("..")) return { ok: false, reason: "Invalid model id." };
  if (input.private) return { ok: false, reason: "Private models are not eligible." };
  if (isGated(input.gated)) return { ok: false, reason: "Gated models are not eligible." };

  const taken = isTakenDown(id);
  if (taken) return { ok: false, reason: `Taken down: ${taken}` };

  const license =
    normalizeLicense(input.license) ?? licenseFromTags(input.tags);
  if (!license || !isPermissiveLicense(license)) {
    return {
      ok: false,
      reason:
        "License is missing, gated, custom, or not a clearly permissive OSI license (Apache-2.0, MIT, BSD, ISC, CC0, Unlicense, …).",
    };
  }

  const revision = input.sha?.trim();
  if (!revision) return { ok: false, reason: "Hub did not return a revision/commit." };

  const files: VaultFile[] = [];
  const missingWeights: string[] = [];

  for (const entry of input.tree) {
    if (entry.type && entry.type !== "file") continue;
    const path = entry.path?.trim();
    if (!path) continue;
    const sha256 = fileSha256(entry);
    const size = entry.lfs?.size ?? entry.size ?? 0;
    if (isWeightPath(path)) {
      if (!sha256) {
        missingWeights.push(path);
        continue;
      }
      files.push({ path, size, sha256, role: "weight" });
      continue;
    }
    if (sha256) {
      files.push({ path, size, sha256, role: "sidecar" });
    }
  }

  if (missingWeights.length > 0 && files.filter((f) => f.role === "weight").length === 0) {
    return {
      ok: false,
      reason: "Weight files on the Hub have no official SHA-256 (LFS). Forge will not pin them.",
    };
  }

  if (files.length === 0) {
    return {
      ok: false,
      reason: "No file on this revision published an official SHA-256. Nothing to pin.",
    };
  }

  const record: VaultRecord = {
    key: `${id}@${revision}`,
    id,
    revision,
    license,
    pipeline: input.pipeline_tag,
    pinnedAt: now,
    files,
    source: "huggingface",
  };
  return { ok: true, record };
}
