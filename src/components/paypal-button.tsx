import { useEffect, useRef, useState } from "react";
import type { PlanKey } from "@/lib/paypal/plans";
import { usePaypal } from "@/lib/paypal/store";

type PaypalNs = {
  Buttons: (opts: {
    style?: Record<string, unknown>;
    createSubscription: (
      data: unknown,
      actions: { subscription: { create: (body: { plan_id: string }) => Promise<string> } },
    ) => Promise<string>;
    onApprove: (data: { subscriptionID?: string }) => void;
    onError?: (err: unknown) => void;
  }) => { render: (el: HTMLElement) => Promise<void> };
};

const sdkCache = new Map<string, Promise<PaypalNs>>();

function loadSdk(clientId: string, mode: "sandbox" | "live"): Promise<PaypalNs> {
  const key = `${mode}:${clientId}`;
  const hit = sdkCache.get(key);
  if (hit) return hit;
  const pending = new Promise<PaypalNs>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-forge-paypal="${key}"]`);
    const onReady = () => {
      const paypal = (window as unknown as { paypal?: PaypalNs }).paypal;
      if (paypal) resolve(paypal);
      else reject(new Error("PayPal SDK missing"));
    };
    if (existing) {
      if ((window as unknown as { paypal?: PaypalNs }).paypal) onReady();
      else existing.addEventListener("load", onReady, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&vault=true&intent=subscription&currency=USD${mode === "sandbox" ? "&debug=false" : ""}`;
    script.dataset.forgePaypal = key;
    script.async = true;
    script.onload = onReady;
    script.onerror = () => reject(new Error("PayPal SDK failed to load"));
    document.head.appendChild(script);
  });
  sdkCache.set(key, pending);
  return pending;
}

export function PaypalSubscribeButton({
  clientId,
  mode,
  planId,
  planKey,
}: {
  clientId: string;
  mode: "sandbox" | "live";
  planId: string;
  planKey: PlanKey;
}) {
  const host = useRef<HTMLDivElement>(null);
  const setSubscription = usePaypal((s) => s.setSubscription);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cancelled = false;
    el.innerHTML = "";
    void loadSdk(clientId, mode)
      .then((paypal) => {
        if (cancelled || !host.current) return;
        return paypal
          .Buttons({
            style: { color: "silver", shape: "rect", label: "subscribe", height: 44, layout: "vertical" },
            createSubscription: (_data, actions) => actions.subscription.create({ plan_id: planId }),
            onApprove: (data) => {
              if (!data.subscriptionID) return;
              setSubscription({
                planKey,
                subscriptionId: data.subscriptionID,
                at: new Date().toISOString(),
              });
            },
            onError: () => setError("PayPal could not complete checkout."),
          })
          .render(host.current);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "PayPal failed");
      });
    return () => {
      cancelled = true;
    };
  }, [clientId, mode, planId, planKey, setSubscription]);

  return (
    <div>
      <div ref={host} className="min-h-11" />
      {error ? <p className="mt-2 text-xs text-muted">{error}</p> : null}
    </div>
  );
}
