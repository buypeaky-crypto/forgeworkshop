import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { ModelCard, ModelCardSkeleton } from "@/components/model-card";
import { ModelDetail } from "@/components/model-detail";
import { Input } from "@/components/ui/input";
import { getModel, listModels, TASKS, type HubModel, type HubModelDetail } from "@/lib/hf";
import { cn } from "@/lib/utils";

type SearchParams = {
  q?: string;
  task?: string;
  model?: string;
};

export const Route = createFileRoute("/huggingface")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search.q === "string" ? search.q : undefined,
    task: typeof search.task === "string" ? search.task : undefined,
    model: typeof search.model === "string" ? search.model : undefined,
  }),
  loaderDeps: ({ search }) => ({
    q: search.q,
    task: search.task,
    model: search.model,
  }),
  loader: async ({ deps }) => {
    let models: HubModel[] = [];
    try {
      models = await listModels({
        data: { q: deps.q, task: deps.task, sort: "downloads", limit: 24 },
      });
    } catch {
      models = [];
    }
    let selected: HubModelDetail | null = null;
    if (deps.model) {
      try {
        selected = await getModel({ data: { id: deps.model } });
      } catch {
        selected = null;
      }
    }
    return { models, selected };
  },
  pendingComponent: HuggingFacePending,
  component: HuggingFacePage,
});

function HuggingFacePending() {
  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="h-8 w-48 animate-pulse rounded bg-raised" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <ModelCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </Shell>
  );
}

function HuggingFacePage() {
  const { q, task, model } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { models, selected } = Route.useLoaderData();
  const [draft, setDraft] = useState(q ?? "");

  useEffect(() => {
    setDraft(q ?? "");
  }, [q]);

  useEffect(() => {
    const next = draft.trim();
    if (next === (q ?? "").trim()) return;
    const t = window.setTimeout(() => {
      void navigate({
        search: (prev) => ({
          ...prev,
          q: next || undefined,
        }),
      });
    }, 280);
    return () => window.clearTimeout(t);
  }, [draft, q, navigate]);

  function setTask(next: string) {
    void navigate({
      search: (prev) => ({
        ...prev,
        task: next || undefined,
      }),
    });
  }

  function openModel(id: string) {
    void navigate({
      search: (prev) => ({ ...prev, model: id }),
    });
  }

  function closeModel() {
    void navigate({
      search: (prev) => ({ ...prev, model: undefined }),
    });
  }

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          Hugging Face
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-[-0.02em] sm:text-4xl">
          Model catalog
        </h1>
        <p className="mt-2 text-sm text-muted">{models.length} results</p>

        <div className="mt-6">
          <label className="relative block max-w-xl">
            <span className="sr-only">Search Hugging Face models</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search models"
              className="pl-10"
            />
          </label>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
            {TASKS.map((item) => {
              const active = (task ?? "") === item.id;
              return (
                <button
                  key={item.id || "all"}
                  type="button"
                  onClick={() => setTask(item.id)}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm transition-colors duration-150",
                    active
                      ? "bg-accent text-accent-fg"
                      : "bg-raised text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={cn(
            "mt-8 grid gap-4",
            selected ? "lg:grid-cols-[1fr_20rem]" : "",
          )}
        >
          {models.length === 0 ? (
            <p className="rounded-xl bg-surface px-5 py-10 text-center text-sm text-muted shadow-[var(--shadow-border)]">
              No models matched that search. Try a different task or query.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {models.map((item) => (
                <ModelCard
                  key={item.id}
                  model={item}
                  selected={item.id === model}
                  onSelect={() => openModel(item.id)}
                />
              ))}
            </div>
          )}

          {selected ? (
            <div className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto">
              <ModelDetail model={selected} onClose={closeModel} />
            </div>
          ) : null}
        </div>
      </main>
    </Shell>
  );
}
