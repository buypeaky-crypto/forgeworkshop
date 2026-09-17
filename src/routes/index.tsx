import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { DonateAsk } from "@/components/donate";
import { Shell } from "@/components/shell";
import { ModelCard } from "@/components/model-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listModels, type HubModel } from "@/lib/hf";

export const Route = createFileRoute("/")({
  loader: async (): Promise<HubModel[]> => {
    try {
      return await listModels({ data: { sort: "downloads", limit: 6 } });
    } catch {
      return [];
    }
  },
  component: Home,
});

function Home() {
  const featured = Route.useLoaderData();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          Hugging Face workshop
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] tracking-[-0.03em] text-fg sm:text-5xl">
          Find the right model. Route the prompt.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
          Forge indexes the public Hugging Face Hub, keeps a scored bay current,
          and pins permissively licensed revisions in a local vault. No house
          xAI key.
        </p>

        <form
          className="mt-8 grid max-w-xl grid-cols-[minmax(0,1fr)_auto] gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void navigate({
              to: "/huggingface",
              search: { q: q.trim() || undefined },
            });
          }}
        >
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search models</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search models, orgs, tasks"
              className="h-11 pl-10"
            />
          </label>
          <Button type="submit" className="h-11 shrink-0 sm:px-5">
            Browse Hub
            <ArrowRight className="size-4" />
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/huggingface"
            search={{ task: "text-generation" }}
            className="inline-flex min-h-11 items-center rounded-full bg-raised px-4 text-sm text-muted hover:text-fg"
          >
            Text generation
          </Link>
          <Link
            to="/huggingface"
            search={{ task: "text-to-image" }}
            className="inline-flex min-h-11 items-center rounded-full bg-raised px-4 text-sm text-muted hover:text-fg"
          >
            Images
          </Link>
          <Link
            to="/huggingface"
            search={{ task: "automatic-speech-recognition" }}
            className="inline-flex min-h-11 items-center rounded-full bg-raised px-4 text-sm text-muted hover:text-fg"
          >
            Speech
          </Link>
          <Link
            to="/conduit"
            className="inline-flex min-h-11 items-center rounded-full bg-raised px-4 text-sm text-muted hover:text-fg"
          >
            Open router
          </Link>
          <Link
            to="/bay"
            className="inline-flex min-h-11 items-center rounded-full bg-raised px-4 text-sm text-muted hover:text-fg"
          >
            Open bay
          </Link>
          <Link
            to="/vault"
            className="inline-flex min-h-11 items-center rounded-full bg-raised px-4 text-sm text-muted hover:text-fg"
          >
            Open vault
          </Link>
          <Link
            to="/subscribe"
            className="inline-flex min-h-11 items-center rounded-full bg-raised px-4 text-sm text-muted hover:text-fg"
          >
            Subscribe
          </Link>
        </div>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl tracking-[-0.02em]">Most downloaded</h2>
            <Link
              to="/huggingface"
              className="inline-flex min-h-11 items-center text-sm text-muted hover:text-fg"
            >
              All models
            </Link>
          </div>
          {featured.length === 0 ? (
            <p className="mt-6 rounded-xl bg-surface px-5 py-10 text-sm text-muted shadow-[var(--shadow-border)]">
              The Hub is unreachable right now. Open Models to retry.
            </p>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onSelect={() =>
                    void navigate({
                      to: "/huggingface",
                      search: { model: model.id },
                    })
                  }
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-16 rounded-xl bg-surface px-5 py-6 shadow-[var(--shadow-border)] sm:px-6">
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            Model bay
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-[-0.02em]">
            Auto-triage, with room for exceptions
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Every twelve hours Forge scouts the Hub, scores downloads, recency,
            quality, and task fit, then pulls snapshots into this browser. Pin,
            exclude, or write a domain rule when the automatic shelf is wrong.
          </p>
          <Link
            to="/bay"
            className="mt-4 inline-flex min-h-11 items-center text-sm text-fg hover:text-muted"
          >
            Open the bay
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </section>

        <section className="mt-6 rounded-xl bg-surface px-5 py-6 shadow-[var(--shadow-border)] sm:px-6">
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            Vault
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-[-0.02em]">
            Permanence for open weights
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Pin a public Hub revision with a clearly permissive license. Every
            file keeps the official SHA-256. Fetch from Hugging Face; the
            torrent bundle is a web-seed fallback. Report is built in.
          </p>
          <Link
            to="/vault"
            className="mt-4 inline-flex min-h-11 items-center text-sm text-fg hover:text-muted"
          >
            Open the vault
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </section>

        <div className="mt-16">
          <DonateAsk />
        </div>
      </main>
    </Shell>
  );
}
