import { createFileRoute } from "@tanstack/react-router";
import { DonateAsk } from "@/components/donate";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/donate")({
  component: DonatePage,
});

function DonatePage() {
  return (
    <Shell>
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          Keep the workshop open
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
          Donate
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Forge is a public catalog and a local router. There is no paid API
          behind it and no xAI spend. A small send on Bitcoin, Ethereum, or
          Solana is the whole ask.
        </p>
        <div className="mt-10">
          <DonateAsk />
        </div>
      </main>
    </Shell>
  );
}
