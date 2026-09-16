import type { VaultRecord } from "@/lib/vault/types";
import { cn, formatBytes, formatRelative, shortSha } from "@/lib/utils";

export function VaultCard({
  record,
  selected,
  onSelect,
}: {
  record: VaultRecord;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const weights = record.files.filter((f) => f.role === "weight").length;
  const bytes = record.files.reduce((n, f) => n + f.size, 0);
  const [org, name] = record.id.includes("/")
    ? (record.id.split("/") as [string, string])
    : ["", record.id];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col items-start rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[var(--shadow-border-hover)]",
        selected && "shadow-[var(--shadow-border-hover)]",
      )}
    >
      <p className="font-mono text-sm leading-snug text-fg">
        {org ? (
          <>
            <span className="text-subtle">{org}/</span>
            {name}
          </>
        ) : (
          record.id
        )}
      </p>
      <p className="mt-1.5 text-xs text-muted">
        {record.license}
        {record.pipeline ? ` · ${record.pipeline.replaceAll("-", " ")}` : ""}
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs tabular-nums text-subtle">
        <span>{shortSha(record.revision)}</span>
        <span>
          {weights} hashed {weights === 1 ? "file" : "files"}
        </span>
        <span>{formatBytes(bytes)}</span>
        <span>{formatRelative(record.pinnedAt)}</span>
      </div>
    </button>
  );
}
