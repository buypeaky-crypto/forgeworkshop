import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { ModelCard } from "@/components/model-card";
import { Button } from "@/components/ui/button";
import { routePrompt, type RouteDecision } from "@/lib/conduit";
import { listModels, type HubModel } from "@/lib/hf";

export const Route = createFileRoute("/conduit")({
  component: ConduitPage,
});

const EXAMPLES = [
  "Summarize this earnings call for a busy exec",
  "Translate the following paragraph into French",
  "Transcribe a 20-minute product podcast",
  "Write a TypeScript debounce helper with tests",
];

function ConduitPage() {
  const [prompt, setPrompt] = useState("");
  const [decision, setDecision] = useState<RouteDecision | null>(null);
  const [models, setModels] = useState<HubModel[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function run(nextPrompt: string) {
    const text = nextPrompt.trim();
    if (!text) return;
    const routed = routePrompt(text);
    setDecision(routed);
    setBusy(true);
    setError(null);
    try {
      const results = await listModels({
        data: { task: routed.task, sort: "downloads", limit: 6 },
      });
      setModels(results);
    } catch (err) {
      setModels([]);
      setError(err instanceof Error ? err.message : "Routing failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          Conduit
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-[-0.02em] sm:text-4xl">
          Prompt router
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Conduit inspects the prompt locally, picks a Hugging Face pipeline, then
          loads the most-downloaded models for that task. No xAI call.
        </p>

        <form
          className="mt-8 max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            void run(prompt);
          }}
        >
          <label htmlFor="conduit-prompt" className="text-sm text-muted">
            Prompt
          </label>
          <textarea
            id="conduit-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            placeholder="Describe the job you need a model for"
            className="mt-2 w-full resize-y rounded-xl bg-surface px-4 py-3 text-sm leading-relaxed text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus-visible:shadow-[var(--shadow-border-hover)]"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setPrompt(example);
                  void run(example);
                }}
                className="inline-flex min-h-11 items-center rounded-full bg-raised px-3.5 text-left text-xs text-muted hover:text-fg sm:text-sm"
              >
                {example}
              </button>
            ))}
          </div>
          <Button type="submit" className="mt-4" disabled={busy || !prompt.trim()}>
            {busy ? "Routing…" : "Route prompt"}
            <ArrowRight className="size-4" />
          </Button>
        </form>

        {decision ? (
          <section className="mt-12">
            <div className="rounded-xl bg-surface px-5 py-4 shadow-[var(--shadow-border)]">
              <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">
                Decision
              </p>
              <p className="mt-2 font-display text-2xl tracking-[-0.02em]">
                {decision.label}
              </p>
              <p className="mt-1 font-mono text-xs text-subtle">{decision.task}</p>
              <p className="mt-3 text-sm text-muted">{decision.reason}</p>
            </div>

            {error ? (
              <p className="mt-6 text-sm text-muted">{error}</p>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {models.map((item) => (
                  <ModelCard
                    key={item.id}
                    model={item}
                    onSelect={() =>
                      void navigate({
                        to: "/huggingface",
                        search: { model: item.id, task: decision.task },
                      })
                    }
                  />
                ))}
              </div>
            )}

            <Link
              to="/huggingface"
              search={{ task: decision.task }}
              className="mt-6 inline-flex min-h-11 items-center text-sm text-muted hover:text-fg"
            >
              Browse this pipeline on Hugging Face
            </Link>
          </section>
        ) : null}
      </main>
    </Shell>
  );
}
