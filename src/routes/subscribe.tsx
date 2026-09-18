import { createFileRoute, Link } from "@tanstack/react-router";
import { PlanGrid } from "@/components/plan-grid";
import { Shell } from "@/components/shell";
import { paypalConfig } from "@/lib/paypal/server";

export const Route = createFileRoute("/subscribe")({
  loader: async () => {
    try {
      return await paypalConfig();
    } catch {
      return {
        ready: false,
        clientId: null,
        mode: "sandbox" as const,
        plans: [],
        message: "PayPal status unavailable.",
      };
    }
  },
  component: SubscribePage,
});

function SubscribePage() {
  const config = Route.useLoaderData();

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          PayPal subscriptions
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
          Monthly plans
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Recurring support through PayPal Business. Crypto one-time sends stay
          on Donate. Checkout uses the official PayPal button — no house xAI
          key, no fake processor.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-subtle">{config.message}</p>

        <div className="mt-10">
          <PlanGrid config={config} />
        </div>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted">
          Live PayPal checkout. One-time support is still{" "}
          <Link to="/donate" className="text-fg hover:text-muted">
            BTC, ETH, or SOL
          </Link>
          .
        </p>
      </main>
    </Shell>
  );
}
