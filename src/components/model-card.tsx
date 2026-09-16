import { Download, Heart } from "lucide-react";
import type { HubModel } from "@/lib/hf";
import { cn, formatCount } from "@/lib/utils";

function taskTone(task?: string): string {
  if (!task) return "bg-raised text-muted";
  if (task.includes("image") || task.includes("vision") || task.includes("object"))
    return "bg-raised text-fg";
  if (task.includes("speech") || task.includes("audio")) return "bg-raised text-muted";
  return "bg-raised text-muted";
}

export function ModelCard({
  model,
  selected,
  onSelect,
}: {
  model: HubModel;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const [org, name] = model.id.includes("/")
    ? (model.id.split("/") as [string, string])
    : ["", model.id];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col items-start rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[var(--shadow-border-hover)]",
        selected && "shadow-[var(--shadow-border-hover)]",
      )}
    >
      <div
        className={cn(
          "mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-xs font-medium",
          taskTone(model.pipeline_tag),
        )}
        aria-hidden="true"
      >
        {(name ?? model.id).slice(0, 2).toUpperCase()}
      </div>
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
      <p className="mt-1.5 line-clamp-1 text-xs text-muted">
        {model.pipeline_tag?.replaceAll("-", " ") ?? "untagged"}
        {model.library_name ? ` · ${model.library_name}` : ""}
      </p>
      <div className="mt-3 flex items-center gap-3 text-xs tabular-nums text-subtle">
        <span className="inline-flex items-center gap-1">
          <Download className="size-3.5" strokeWidth={1.75} />
          {formatCount(model.downloads ?? 0)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Heart className="size-3.5" strokeWidth={1.75} />
          {formatCount(model.likes ?? 0)}
        </span>
      </div>
    </button>
  );
}

export function ModelCardSkeleton() {
  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <div className="mb-3 size-10 animate-pulse rounded-lg bg-raised" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-raised" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-raised" />
      <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-raised" />
    </div>
  );
}
