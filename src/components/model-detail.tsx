import { Download, ExternalLink, Heart, Pin, X } from "lucide-react";
import type { HubModelDetail } from "@/lib/hf";
import { useBay } from "@/lib/bay/store";
import { formatCount, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VaultPinButton } from "@/components/vault-pin";
import { TrustPanel } from "@/components/trust-panel";

function asList(value?: string[] | string): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function ModelDetail({
  model,
  onClose,
}: {
  model: HubModelDetail;
  onClose: () => void;
}) {
  const tags = (model.tags ?? []).filter((t) => !t.startsWith("region:")).slice(0, 10);
  const languages = asList(model.cardData?.language).slice(0, 6);
  const params = model.safetensors?.total;
  const pin = useBay((s) => s.pins[model.id]);
  const pinModel = useBay((s) => s.pin);
  const addManual = useBay((s) => s.addManual);
  const unpin = useBay((s) => s.unpin);

  return (
    <aside className="flex h-full flex-col overflow-y-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="min-w-0">
          <p className="font-mono text-sm leading-snug text-fg break-all">{model.id}</p>
          <p className="mt-1 text-xs text-muted">
            {model.pipeline_tag?.replaceAll("-", " ") ?? "untagged"}
            {model.library_name ? ` · ${model.library_name}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="relative -mr-1 inline-flex size-11 items-center justify-center rounded-lg text-muted hover:bg-raised hover:text-fg"
          aria-label="Close model details"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex gap-4 px-5 text-sm tabular-nums">
        <span className="inline-flex items-center gap-1.5 text-muted">
          <Download className="size-3.5" strokeWidth={1.75} />
          {formatCount(model.downloads ?? 0)}
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted">
          <Heart className="size-3.5" strokeWidth={1.75} />
          {formatCount(model.likes ?? 0)}
        </span>
      </div>

      <dl className="mt-5 grid gap-3 px-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-subtle">Updated</dt>
          <dd className="text-fg">{formatDate(model.lastModified)}</dd>
        </div>
        {params ? (
          <div className="flex justify-between gap-4">
            <dt className="text-subtle">Parameters</dt>
            <dd className="tabular-nums text-fg">{formatCount(params)}</dd>
          </div>
        ) : null}
        {model.cardData?.license ? (
          <div className="flex justify-between gap-4">
            <dt className="text-subtle">License</dt>
            <dd className="text-fg">{model.cardData.license}</dd>
          </div>
        ) : null}
        {languages.length > 0 ? (
          <div className="flex justify-between gap-4">
            <dt className="text-subtle">Languages</dt>
            <dd className="text-right text-fg">{languages.join(", ")}</dd>
          </div>
        ) : null}
      </dl>

      {tags.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-1.5 px-5">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      ) : null}

      <TrustPanel
        id={model.id}
        revision={model.sha}
        license={model.cardData?.license}
      />

      <div className="mt-auto grid gap-2 p-5">
        {pin ? (
          <Button variant="outline" onClick={() => unpin(model.id)}>
            Unpin from bay
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              pinModel(model.id, "follow");
              void addManual(model.id);
            }}
          >
            <Pin className="size-3.5" />
            Pin to bay
          </Button>
        )}
        <VaultPinButton id={model.id} revision={model.sha} />
        <a
          href={`https://huggingface.co/${model.id}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-accent-fg transition-colors duration-150 hover:bg-fg"
        >
          Open on Hugging Face
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </aside>
  );
}
