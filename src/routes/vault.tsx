import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VaultCard } from "@/components/vault-card";
import { VaultDetail } from "@/components/vault-detail";
import { VaultPolicy } from "@/components/vault-policy";
import { VaultPerks } from "@/components/vault-perks";
import { vaultList, useVault } from "@/lib/vault/store";
import { formatRelative } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Tab = "catalog" | "policy" | "reports";
type Search = { tab?: Tab; record?: string };

export const Route = createFileRoute("/vault")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    tab: search.tab === "policy" || search.tab === "reports" ? search.tab : "catalog",
    record: typeof search.record === "string" ? search.record : undefined,
  }),
  component: VaultPage,
});

function VaultPage() {
  const { tab, record: selectedKey } = Route.useSearch();
  const navigate = Route.useNavigate();
  const records = useVault((s) => s.records);
  const hidden = useVault((s) => s.hidden);
  const reports = useVault((s) => s.reports);
  const lastError = useVault((s) => s.lastError);
  const admitting = useVault((s) => s.admitting);
  const pinFromHub = useVault((s) => s.pinFromHub);
  const unhide = useVault((s) => s.unhide);
  const [pinId, setPinId] = useState("");

  const list = vaultList(records);
  const selected = selectedKey ? records[selectedKey] : undefined;

  async function onPin(e: React.FormEvent) {
    e.preventDefault();
    const record = await pinFromHub(pinId);
    if (record) {
      setPinId("");
      void navigate({ search: (prev) => ({ ...prev, tab: "catalog", record: record.key }) });
    }
  }

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          Open-model vault
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-[-0.02em] sm:text-4xl">
          Pin the Hub revision
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Only public Hugging Face models with a clearly permissive license.
          Each file keeps the official SHA-256 and commit. Downloads go to HF
          first; torrents are a web-seed fallback.
        </p>

        <form
          className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center"
          onSubmit={(e) => void onPin(e)}
        >
          <Input
            id="vault-admit-id"
            value={pinId}
            onChange={(e) => setPinId(e.target.value)}
            placeholder="org/model-id"
            className="sm:max-w-sm"
            autoComplete="off"
            spellCheck={false}
          />
          <Button type="submit" disabled={admitting || !pinId.trim()}>
            {admitting ? "Checking Hub…" : "Admit to vault"}
          </Button>
        </form>
        {lastError ? <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted">{lastError}</p> : null}

        <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
          {(
            [
              ["catalog", "Catalog"],
              ["policy", "Policy"],
              ["reports", "Reports"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() =>
                void navigate({ search: (prev) => ({ ...prev, tab: id, record: undefined }) })
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

        {tab === "policy" ? (
          <div className="mt-10">
            <VaultPolicy />
          </div>
        ) : null}

        {tab === "reports" ? (
          <div className="mt-10 grid gap-8">
            <section>
              <h2 className="font-display text-2xl tracking-[-0.02em]">Reports</h2>
              {reports.length === 0 ? (
                <p className="mt-3 text-sm text-subtle">No reports yet.</p>
              ) : (
                <ul className="mt-4 grid gap-2">
                  {reports.map((row) => (
                    <li
                      key={row.id}
                      className="rounded-lg bg-surface px-4 py-3 text-sm shadow-[var(--shadow-border)]"
                    >
                      <p className="font-mono text-fg break-all">{row.modelId}</p>
                      <p className="mt-1 text-muted">
                        {row.reason} · {formatRelative(row.at)} · {row.revision.slice(0, 7)}
                      </p>
                      {row.note ? <p className="mt-1 text-subtle">{row.note}</p> : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section>
              <h2 className="font-display text-2xl tracking-[-0.02em]">Hidden ids</h2>
              {hidden.length === 0 ? (
                <p className="mt-3 text-sm text-subtle">Nothing hidden.</p>
              ) : (
                <ul className="mt-4 grid gap-2">
                  {hidden.map((id) => (
                    <li
                      key={id}
                      className="flex items-center justify-between gap-3 rounded-lg bg-surface px-4 py-3"
                    >
                      <p className="font-mono text-sm break-all">{id}</p>
                      <Button variant="ghost" className="h-10" onClick={() => unhide(id)}>
                        Restore
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ) : null}

        {tab === "catalog" ? (
          <div
            className={cn("mt-8 grid gap-4", selected ? "lg:grid-cols-[1fr_24rem]" : "")}
          >
            {list.length === 0 ? (
              <p className="rounded-xl bg-surface px-5 py-10 text-center text-sm text-muted shadow-[var(--shadow-border)]">
                The vault is empty. Admit a public, permissively licensed Hub
                model, or pin one from Models / Bay.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {list.map((item) => (
                  <VaultCard
                    key={item.key}
                    record={item}
                    selected={item.key === selectedKey}
                    onSelect={() =>
                      void navigate({ search: (prev) => ({ ...prev, record: item.key }) })
                    }
                  />
                ))}
              </div>
            )}
            {selected ? (
              <div className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto">
                <VaultDetail
                  record={selected}
                  onClose={() =>
                    void navigate({ search: (prev) => ({ ...prev, record: undefined }) })
                  }
                />
              </div>
            ) : null}
          </div>
        ) : null}
        <VaultPerks />
      </main>
    </Shell>
  );
}
