import { createFileRoute, Link } from "@tanstack/react-router";
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
          One-time sends on Bitcoin, Ethereum, or Solana. For a monthly
          subscription (Vault Pro, Signals API, Sponsor) use{" "}
          <Link to="/subscribe" className="text-fg hover:text-muted">
            PayPal plans
          </Link>
          . There is no xAI spend.
        </p>
        <div className="mt-10">
          <DonateAsk />
        </div>
      </main>
    </Shell>
  );
}
