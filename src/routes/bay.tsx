import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { BayCard, BayCardSkeleton } from "@/components/bay-card";
import { BayDetail } from "@/components/bay-detail";
import { BayExceptions } from "@/components/bay-exceptions";
import { BayPolicy } from "@/components/bay-policy";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { DOMAINS } from "@/lib/bay/domains";
import { bayList, domainCounts, isSyncDue, useBay } from "@/lib/bay/store";
import type { DomainId } from "@/lib/bay/types";
import { cn, formatRelative } from "@/lib/utils";

type Tab = "shelf" | "exceptions" | "policy";
type Search = { tab?: Tab; domain?: DomainId | "all"; model?: string };

export const Route = createFileRoute("/bay")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    tab: search.tab === "exceptions" || search.tab === "policy" ? search.tab : "shelf",
    domain:
      typeof search.domain === "string" &&
      (search.domain === "all" || DOMAINS.some((d) => d.id === search.domain))
        ? (search.domain as Search["domain"])
        : "all",
    model: typeof search.model === "string" ? search.model : undefined,
  }),
  component: BayPage,
});

function BayPage() {
  const { tab, domain, model: selectedId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const hydrated = useBay((s) => s.hydrated);
  const models = useBay((s) => s.models);
  const syncing = useBay((s) => s.syncing);
  const lastSyncAt = useBay((s) => s.lastSyncAt);
  const lastSyncError = useBay((s) => s.lastSyncError);
  const intervalHours = useBay((s) => s.settings.intervalHours);
  const log = useBay((s) => s.log);
  const sync = useBay((s) => s.sync);

  const counts = domainCounts(models);
  const list = bayList(models, domain);
  const selected = selectedId ? models[selectedId] : undefined;
  const due = isSyncDue(lastSyncAt, intervalHours);

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
              Local model bay
            </p>
            <h1 className="mt-2 font-display text-3xl tracking-[-0.02em] sm:text-4xl">
              Keep the shelf current
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
              Forge scouts the public Hub, scores what matters, and pulls
              snapshots into this browser. Pins and rules keep the exceptions.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Button onClick={() => void sync()} disabled={syncing}>
              <RefreshCw className={cn("size-4", syncing && "animate-spin")} />
              {syncing ? "Syncing…" : due ? "Sync now" : "Sync again"}
            </Button>
            <p className="text-xs text-subtle">
              Last sync {formatRelative(lastSyncAt)} · every {intervalHours}h
            </p>
            {lastSyncError ? <p className="text-xs text-muted">{lastSyncError}</p> : null}
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
          {(
            [
              ["shelf", "Shelf"],
              ["exceptions", "Exceptions"],
              ["policy", "Policy"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() =>
                void navigate({ search: (prev) => ({ ...prev, tab: id, model: undefined }) })
              }
              className={cn(
                "inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm transition-colors duration-150",
                tab === id ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "exceptions" ? (
          <div className="mt-10">
            <BayExceptions />
          </div>
        ) : null}

        {tab === "policy" ? (
          <div className="mt-10">
            <BayPolicy />
          </div>
        ) : null}

        {tab === "shelf" ? (
          <>
            <div className="mt-8 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
              <DomainChip
                label="All"
                count={Object.keys(models).length}
                active={domain === "all"}
                onClick={() =>
                  void navigate({ search: (prev) => ({ ...prev, domain: "all", model: undefined }) })
                }
              />
              {DOMAINS.map((d) => (
                <DomainChip
                  key={d.id}
                  label={d.label}
                  count={counts[d.id]}
                  active={domain === d.id}
                  onClick={() =>
                    void navigate({
                      search: (prev) => ({ ...prev, domain: d.id, model: undefined }),
                    })
                  }
                />
              ))}
            </div>

            <div
              className={cn("mt-8 grid gap-4", selected ? "lg:grid-cols-[1fr_22rem]" : "")}
            >
              {!hydrated || (syncing && list.length === 0) ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {Array.from({ length: 6 }, (_, i) => (
                    <BayCardSkeleton key={i} />
                  ))}
                </div>
              ) : list.length === 0 ? (
                <p className="rounded-xl bg-surface px-5 py-10 text-center text-sm text-muted shadow-[var(--shadow-border)]">
                  The bay is empty. Sync to scout the Hub, or pin a model under
                  Exceptions.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {list.map((item) => (
                    <BayCard
                      key={item.id}
                      model={item}
                      selected={item.id === selectedId}
                      onSelect={() =>
                        void navigate({
                          search: (prev) => ({ ...prev, model: item.id }),
                        })
                      }
                    />
                  ))}
                </div>
              )}

              {selected ? (
                <div className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto">
                  <BayDetail
                    model={selected}
                    onClose={() =>
                      void navigate({ search: (prev) => ({ ...prev, model: undefined }) })
                    }
                  />
                </div>
              ) : null}
            </div>

            {log.length > 0 ? (
              <section className="mt-14">
                <h2 className="font-display text-2xl tracking-[-0.02em]">Recent pulls</h2>
                <ul className="mt-4 grid gap-2">
                  {log.slice(0, 8).map((entry, i) => (
                    <li
                      key={`${entry.at}-${entry.id}-${i}`}
                      className="flex flex-col gap-1 rounded-lg bg-surface px-4 py-3 text-sm sm:flex-row sm:items-baseline sm:justify-between"
                    >
                      <span className="font-mono text-fg">{entry.id}</span>
                      <span className="text-muted">
                        {entry.action} · {entry.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        ) : null}
      </main>
    </Shell>
  );
}

function DomainChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm transition-colors duration-150",
        active ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
      )}
    >
      {label}
      <span className={cn("tabular-nums", active ? "text-accent-fg" : "text-subtle")}>{count}</span>
    </button>
  );
}
