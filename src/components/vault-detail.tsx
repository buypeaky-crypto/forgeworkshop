import { Check, Copy, ExternalLink, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bundleText, cliPull, SAFETY_DISCLAIMER } from "@/lib/vault/export";
import { useVault } from "@/lib/vault/store";
import type { ReportReason, VaultRecord } from "@/lib/vault/types";
import { REPORT_REASONS } from "@/lib/vault/types";
import { hubCardUrl, hubTreeUrl, webseedUrl } from "@/lib/vault/webseed";
import { formatBytes, shortSha } from "@/lib/utils";

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function VaultDetail({
  record,
  onClose,
}: {
  record: VaultRecord;
  onClose: () => void;
}) {
  const drop = useVault((s) => s.drop);
  const report = useVault((s) => s.report);
  const [copied, setCopied] = useState<"bundle" | "cli" | null>(null);
  const [reason, setReason] = useState<ReportReason>("malware");
  const [note, setNote] = useState("");
  const [reported, setReported] = useState(false);

  async function onCopy(kind: "bundle" | "cli") {
    const text = kind === "bundle" ? bundleText(record) : cliPull(record.id, record.revision);
    const ok = await copyText(text);
    if (!ok) return;
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1400);
  }

  function onReport(e: React.FormEvent) {
    e.preventDefault();
    report({ modelId: record.id, revision: record.revision, reason, note });
    setReported(true);
    onClose();
  }

  return (
    <aside className="flex h-full flex-col rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="min-w-0">
          <p className="font-mono text-sm leading-snug text-fg break-all">{record.id}</p>
          <p className="mt-1 text-xs text-muted">
            {record.license} · {shortSha(record.revision)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="relative -mr-1 inline-flex size-11 items-center justify-center rounded-lg text-muted hover:bg-raised hover:text-fg"
          aria-label="Close vault record"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 px-5">
        <Badge>{record.source}</Badge>
        <Badge>{record.files.length} hashed</Badge>
      </div>

      <p className="mt-4 px-5 text-xs leading-relaxed text-subtle">{SAFETY_DISCLAIMER}</p>

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-5">
        <p className="text-xs font-medium tracking-[0.14em] text-muted uppercase">Files</p>
        <ul className="mt-2 grid gap-2">
          {record.files.map((file) => (
            <li key={file.path} className="rounded-lg bg-raised px-3 py-2">
              <p className="font-mono text-xs break-all text-fg">{file.path}</p>
              <p className="mt-1 font-mono text-xs break-all text-subtle">{file.sha256}</p>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                <span>
                  {file.role} · {formatBytes(file.size)} · {shortSha(record.revision)}
                </span>
                <a
                  href={webseedUrl(record.id, record.revision, file.path)}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-11 inline-flex items-center text-muted hover:text-fg"
                >
                  HF web-seed
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-2 p-5">
        <a
          href={hubTreeUrl(record.id, record.revision)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-accent-fg transition-colors duration-150 hover:bg-fg"
        >
          Get from Hugging Face
          <ExternalLink className="size-3.5" />
        </a>
        <Button variant="outline" onClick={() => void onCopy("bundle")}>
          {copied === "bundle" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied === "bundle" ? "Copied bundle" : "Copy web-seed bundle"}
        </Button>
        <Button variant="ghost" onClick={() => void onCopy("cli")}>
          {copied === "cli" ? "Copied CLI" : "Copy huggingface-cli"}
        </Button>
        <a
          href={hubCardUrl(record.id)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center text-sm text-muted hover:text-fg"
        >
          Model card
        </a>
        <Button variant="ghost" onClick={() => drop(record.key)}>
          Drop pin
        </Button>
      </div>

      <form className="border-t border-border px-5 py-4" onSubmit={onReport}>
        <p className="text-xs font-medium tracking-[0.14em] text-muted uppercase">Report</p>
        <p className="mt-2 text-xs leading-relaxed text-subtle">
          Report removes this pin and hides the id. Forge does not host the
          bytes — takedown here means we will not keep the record.
        </p>
        <label className="mt-3 block text-xs text-muted" htmlFor="vault-reason">
          Reason
        </label>
        <select
          id="vault-reason"
          className="mt-1 h-11 w-full rounded-lg bg-raised px-3 text-sm text-fg"
          value={reason}
          onChange={(e) => setReason(e.target.value as ReportReason)}
        >
          {REPORT_REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <label className="mt-3 block text-xs text-muted" htmlFor="vault-note">
          Note
        </label>
        <textarea
          id="vault-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg bg-raised px-3 py-2 text-sm text-fg outline-none"
        />
        <Button type="submit" variant="outline" className="mt-3" disabled={reported}>
          Submit report and hide
        </Button>
      </form>
    </aside>
  );
}
