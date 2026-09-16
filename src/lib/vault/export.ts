import type { VaultRecord } from "./types";
import { webseedUrl } from "./webseed";

export const SAFETY_DISCLAIMER =
  "Checksums prove bytes match the Hugging Face source. They do not prove a model is safe to run.";

export function webseedBundle(record: VaultRecord) {
  const files = record.files.map((file) => ({
    path: file.path,
    size: file.size,
    sha256: file.sha256,
    url: webseedUrl(record.id, record.revision, file.path),
  }));
  return {
    protocol: "forge-webseed-v1",
    source: "huggingface",
    id: record.id,
    revision: record.revision,
    license: record.license,
    "url-list": files.map((f) => f.url),
    files,
    note: "Default fetch is Hugging Face HTTPS (BEP-19 web-seed). This bundle is the torrent fallback: hashes plus url-list. It is not a BEP-3 .torrent (piece hashes require the bytes).",
    disclaimer: SAFETY_DISCLAIMER,
  };
}

export function bundleText(record: VaultRecord): string {
  return JSON.stringify(webseedBundle(record), null, 2);
}

export function cliPull(id: string, revision: string): string {
  return `huggingface-cli download ${id} --revision ${revision}`;
}
