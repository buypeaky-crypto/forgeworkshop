import { Check, Copy, ExternalLink, Pin, X } from "lucide-react";
import { useState } from "react";
import { domainMeta } from "@/lib/bay/domains";
import { cliPull } from "@/lib/bay/sync";
import { useBay } from "@/lib/bay/store";
import type { BayModel, ScoreParts } from "@/lib/bay/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VaultPinButton } from "@/components/vault-pin";
import { formatCount, formatRelative, shortSha } from "@/lib/utils";

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function ScoreRow({ parts }: { parts: ScoreParts }) {
  const rows: [string, number][] = [
    ["Downloads", parts.downloads],
    ["Likes", parts.likes],
    ["Recency", parts.recency],
    ["Quality", parts.quality],
    ["Task fit", parts.taskFit],
  ];
  return (
    <dl className="grid gap-2">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-3 text-xs">
          <dt className="text-subtle">{label}</dt>
          <dd className="tabular-nums text-muted">{value.toFixed(2)}</dd>
        </div>
      ))}
      <div className="flex items-center justify-between gap-3 border-t border-border pt-2 text-sm">
        <dt className="text-muted">Total</dt>
        <dd className="tabular-nums text-fg">{parts.total.toFixed(2)}</dd>
      </div>
    </dl>
  );
}

export function BayDetail({ model, onClose }: { model: BayModel; onClose: () => void }) {
  const pin = useBay((s) => s.pins[model.id]);
  const excluded = useBay((s) => s.exclusions.includes(model.id));
  const pinModel = useBay((s) => s.pin);
  const unpin = useBay((s) => s.unpin);
  const setPinPolicy = useBay((s) => s.setPinPolicy);
  const exclude = useBay((s) => s.exclude);
  const adoptPending = useBay((s) => s.adoptPending);
  const [copied, setCopied] = useState(false);
  const domain = domainMeta(model.domain);
  const cmd = cliPull(model.id, model.snapshot.sha);

  async function onCopy() {
    const ok = await copyText(cmd);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <aside className="flex h-full flex-col rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <div className="min-w-0">
          <p className="font-mono text-sm leading-snug text-fg break-all">{model.id}</p>
          <p className="mt-1 text-xs text-muted">
            {domain.label}
            {model.snapshot.pipeline ? ` · ${model.snapshot.pipeline.replaceAll("-", " ")}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="relative -mr-1 inline-flex size-11 items-center justify-center rounded-lg text-muted hover:bg-raised hover:text-fg"
          aria-label="Close bay details"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 px-5">
        <Badge>{model.status}</Badge>
        <Badge>{model.origin}</Badge>
        <Badge>{shortSha(model.snapshot.sha)}</Badge>
      </div>

      <dl className="mt-5 grid gap-3 px-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-subtle">Pulled</dt>
          <dd className="text-fg">{formatRelative(model.snapshot.pulledAt)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-subtle">Downloads</dt>
          <dd className="tabular-nums text-fg">{formatCount(model.snapshot.downloads)}</dd>
        </div>
        {model.snapshot.params ? (
          <div className="flex justify-between gap-4">
            <dt className="text-subtle">Parameters</dt>
            <dd className="tabular-nums text-fg">{formatCount(model.snapshot.params)}</dd>
          </div>
        ) : null}
        {model.snapshot.license ? (
          <div className="flex justify-between gap-4">
            <dt className="text-subtle">License</dt>
            <dd className="text-fg">{model.snapshot.license}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-subtle">Files cached</dt>
          <dd className="tabular-nums text-fg">{model.snapshot.files.length} names</dd>
        </div>
      </dl>

      {model.pending ? (
        <div className="mx-5 mt-5 rounded-lg bg-raised px-4 py-3 text-sm">
          <p className="text-fg">Newer revision on the Hub</p>
          <p className="mt-1 text-xs text-muted">
            Held {shortSha(model.snapshot.sha)} · Hub {shortSha(model.pending.sha)}
          </p>
          <Button className="mt-3 h-10" onClick={() => adoptPending(model.id)}>
            Adopt Hub revision
          </Button>
        </div>
      ) : null}

      <div className="mt-5 px-5">
        <p className="text-xs font-medium tracking-[0.14em] text-muted uppercase">Score</p>
        <div className="mt-3">
          <ScoreRow parts={model.score} />
        </div>
      </div>

      {model.history.length > 0 ? (
        <div className="mt-5 px-5">
          <p className="text-xs font-medium tracking-[0.14em] text-muted uppercase">History</p>
          <ul className="mt-2 grid gap-1.5 text-xs text-muted">
            {model.history.map((rev, i) => (
              <li key={`${rev.sha ?? "none"}-${i}`} className="flex justify-between gap-3">
                <span className="font-mono">{shortSha(rev.sha)}</span>
                <span>{formatRelative(rev.pulledAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2 px-5">
        {pin ? (
          <>
            <Button variant="outline" onClick={() => unpin(model.id)}>
              Unpin
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPinPolicy(model.id, pin.policy === "lock" ? "follow" : "lock")}
            >
              {pin.policy === "lock" ? "Follow Hub" : "Lock revision"}
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={() => pinModel(model.id, "follow")}>
            <Pin className="size-3.5" />
            Pin
          </Button>
        )}
        {!excluded ? (
          <Button variant="ghost" onClick={() => exclude(model.id)}>
            Exclude
          </Button>
        ) : null}
      </div>

      <div className="mt-3 px-5">
        <VaultPinButton id={model.id} revision={model.snapshot.sha} />
      </div>

      <div className="mt-auto grid gap-2 p-5">
        <button
          type="button"
          onClick={() => void onCopy()}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-raised px-3 text-sm text-fg hover:text-fg"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied CLI" : "Copy huggingface-cli pull"}
        </button>
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
