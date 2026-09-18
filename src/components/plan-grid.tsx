import { Check } from "lucide-react";
import { PaypalSubscribeButton } from "@/components/paypal-button";
import { formatPlanPrice, PLANS, type PlanKey } from "@/lib/paypal/plans";
import type { PaypalPublic } from "@/lib/paypal/server";
import { usePaypal } from "@/lib/paypal/store";
import { cn } from "@/lib/utils";

export function PlanGrid({ config }: { config: PaypalPublic }) {
  const subscription = usePaypal((s) => s.subscription);

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {PLANS.map((plan) => {
        const row = config.plans.find((p) => p.key === plan.key);
        const planId = row?.planId ?? null;
        const price = row?.price ?? plan.price;
        const active = subscription?.planKey === plan.key;
        const canCheckout = Boolean(config.clientId && planId);
        return (
          <article
            key={plan.key}
            className={cn(
              "flex flex-col rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
              active && "shadow-[var(--shadow-border-hover)]",
            )}
          >
            <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
              {plan.product}
            </p>
            <h2 className="mt-2 font-display text-2xl tracking-[-0.02em]">{plan.name}</h2>
            <p className="mt-3 font-display text-4xl tracking-[-0.03em]">
              ${formatPlanPrice(price)}
              <span className="ml-1 text-base text-muted">/mo</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{plan.description}</p>
            <ul className="mt-5 grid gap-2 text-sm text-fg">
              {plan.features.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-muted" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              {active ? (
                <p className="text-sm text-fg">Active — {subscription?.subscriptionId.slice(0, 12)}…</p>
              ) : canCheckout && config.clientId && planId ? (
                <PaypalSubscribeButton
                  clientId={config.clientId}
                  mode={config.mode}
                  planId={planId}
                  planKey={plan.key as PlanKey}
                />
              ) : (
                <p className="text-xs leading-relaxed text-subtle">
                  PayPal button arms after the Client ID is connected.
                </p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
