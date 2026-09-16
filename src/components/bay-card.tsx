import { Pin } from "lucide-react";
import { domainMeta } from "@/lib/bay/domains";
import type { BayModel } from "@/lib/bay/types";
import { cn, formatCount, shortSha } from "@/lib/utils";

export function BayCard({
  model,
  selected,
  onSelect,
}: {
  model: BayModel;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const [org, name] = model.id.includes("/")
    ? (model.id.split("/") as [string, string])
    : ["", model.id];
  const domain = domainMeta(model.domain);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col items-start rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[var(--shadow-border-hover)]",
        selected && "shadow-[var(--shadow-border-hover)]",
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <p className="font-mono text-sm leading-snug text-fg">
          {org ? (
            <>
              <span className="text-subtle">{org}/</span>
              {name}
            </>
          ) : (
            model.id
          )}
        </p>
        {model.origin !== "auto" ? (
          <Pin className="size-3.5 shrink-0 text-muted" strokeWidth={1.75} aria-label="Pinned" />
        ) : null}
      </div>
      <p className="mt-1.5 text-xs text-muted">
        {domain.label}
        {model.snapshot.pipeline ? ` · ${model.snapshot.pipeline.replaceAll("-", " ")}` : ""}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs tabular-nums text-subtle">
        <span>score {model.score.total.toFixed(2)}</span>
        <span>{shortSha(model.snapshot.sha)}</span>
        <span>{formatCount(model.snapshot.downloads)}</span>
        <span className="text-muted">{model.status}</span>
      </div>
    </button>
  );
}

export function BayCardSkeleton() {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <div className="h-4 w-3/4 animate-pulse rounded bg-raised" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-raised" />
      <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-raised" />
    </div>
  );
}
