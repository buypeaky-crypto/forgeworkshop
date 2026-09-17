import type { VaultRecord } from "@/lib/vault/types";

export function vaultAuditText(records: VaultRecord[]): string {
  const lines = [
    "Forge vault SHA-256 audit",
    `Generated ${new Date().toISOString()}`,
    "Checksums prove bytes match the Hugging Face source. They do not prove a model is safe to run.",
    "",
  ];
  for (const record of records) {
    lines.push(`${record.id}@${record.revision}`);
    lines.push(`license: ${record.license}`);
    for (const file of record.files) {
      lines.push(`  ${file.sha256}  ${file.path}  ${file.size}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

export function downloadText(filename: string, body: string, type = "text/plain") {
  const blob = new Blob([body], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
