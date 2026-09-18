import { createServerFn } from "@tanstack/react-start";
import { env } from "@/lib/env.server";
import {
  PAYPAL_CLIENT_ID,
  PAYPAL_MODE,
  PAYPAL_PLAN_IDS,
  PLANS,
  planByKey,
  type PlanKey,
} from "./plans";

export type PaypalPublicPlan = { key: PlanKey; planId: string | null; price: number };

export type PaypalPublic = {
  ready: boolean;
  clientId: string | null;
  mode: "sandbox" | "live";
  plans: PaypalPublicPlan[];
  message: string;
};

type PaypalToken = { access_token: string; expires_in: number };

let tokenCache: { token: string; exp: number } | null = null;
let planCache: PaypalPublic | null = null;

function paypalBase(): string {
  const mode = paypalMode();
  return mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

function paypalMode(): "sandbox" | "live" {
  if (env("PAYPAL_ENV") === "sandbox") return "sandbox";
  if (env("PAYPAL_ENV") === "live") return "live";
  return PAYPAL_MODE;
}

function credentials(): { id: string; secret: string } | null {
  const id = env("PAYPAL_CLIENT_ID") || env("VITE_PAYPAL_CLIENT_ID") || PAYPAL_CLIENT_ID;
  const secret = env("PAYPAL_CLIENT_SECRET");
  if (!id || !secret) return null;
  return { id, secret };
}

async function accessToken(): Promise<string> {
  if (tokenCache && tokenCache.exp > Date.now() + 10_000) return tokenCache.token;
  const creds = credentials();
  if (!creds) throw new Error("PayPal credentials missing");
  const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${creds.id}:${creds.secret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal auth ${res.status}`);
  const json = (await res.json()) as PaypalToken;
  tokenCache = { token: json.access_token, exp: Date.now() + json.expires_in * 1000 };
  return json.access_token;
}

async function paypalJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await accessToken();
  const res = await fetch(`${paypalBase()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal ${path} ${res.status}: ${text.slice(0, 240)}`);
  }
  return (await res.json()) as T;
}

type CatalogProduct = { id: string; name: string };
type BillingPlan = { id: string; name: string; product_id?: string; status?: string };
type BillingPlanDetail = {
  id: string;
  billing_cycles?: {
    tenure_type?: string;
    pricing_scheme?: { fixed_price?: { value?: string } };
  }[];
};

function catalogPrice(key: PlanKey): number {
  return planByKey(key)?.price ?? 0;
}

function withCatalogPrices(rows: { key: PlanKey; planId: string | null }[]): PaypalPublicPlan[] {
  return rows.map((row) => ({ ...row, price: catalogPrice(row.key) }));
}

function priceFromPlan(detail: BillingPlanDetail): number | null {
  const cycles = detail.billing_cycles ?? [];
  const regular = cycles.find((c) => c.tenure_type === "REGULAR") ?? cycles[0];
  const raw = regular?.pricing_scheme?.fixed_price?.value;
  if (!raw) return null;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}

async function overlayLivePrices(rows: PaypalPublicPlan[]): Promise<PaypalPublicPlan[]> {
  if (!credentials()) return rows;
  return Promise.all(
    rows.map(async (row) => {
      if (!row.planId) return row;
      try {
        const detail = await paypalJson<BillingPlanDetail>(`/v1/billing/plans/${row.planId}`);
        const live = priceFromPlan(detail);
        return live != null ? { ...row, price: live } : row;
      } catch {
        return row;
      }
    }),
  );
}

async function findOrCreateProduct(name: string, description: string): Promise<string> {
  const listed = await paypalJson<{ products?: CatalogProduct[] }>(
    "/v1/catalogs/products?page_size=20&page=1",
  );
  const hit = listed.products?.find((p) => p.name === name);
  if (hit) return hit.id;
  const created = await paypalJson<CatalogProduct>("/v1/catalogs/products", {
    method: "POST",
    body: JSON.stringify({
      name,
      description,
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  });
  return created.id;
}

async function findOrCreatePlan(input: {
  productId: string;
  name: string;
  description: string;
  price: number;
}): Promise<string> {
  const listed = await paypalJson<{ plans?: BillingPlan[] }>("/v1/billing/plans?page_size=20&page=1");
  const hit = listed.plans?.find((p) => p.name === input.name && p.status !== "INACTIVE");
  if (hit) return hit.id;
  const created = await paypalJson<BillingPlan>("/v1/billing/plans", {
    method: "POST",
    body: JSON.stringify({
      product_id: input.productId,
      name: input.name,
      description: input.description,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: { value: input.price.toFixed(2), currency_code: "USD" },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        payment_failure_threshold: 3,
      },
    }),
  });
  return created.id;
}

function envPlanId(key: PlanKey): string | null {
  const map: Record<PlanKey, string | undefined> = {
    vault: env("PAYPAL_PLAN_VAULT") || PAYPAL_PLAN_IDS.vault,
    signals: env("PAYPAL_PLAN_SIGNALS") || PAYPAL_PLAN_IDS.signals,
    sponsor: env("PAYPAL_PLAN_SPONSOR") || PAYPAL_PLAN_IDS.sponsor,
  };
  return map[key] || null;
}

export const paypalConfig = createServerFn({ method: "GET" }).handler(
  async (): Promise<PaypalPublic> => {
    const clientId =
      env("PAYPAL_CLIENT_ID") || env("VITE_PAYPAL_CLIENT_ID") || PAYPAL_CLIENT_ID || null;
    const mode = paypalMode();
    const baked = withCatalogPrices(PLANS.map((p) => ({ key: p.key, planId: envPlanId(p.key) })));
    const bakedReady = Boolean(clientId && baked.every((p) => p.planId));

    if (bakedReady) {
      const plans = await overlayLivePrices(baked);
      planCache = {
        ready: true,
        clientId,
        mode,
        plans,
        message: "PayPal subscriptions are live. Checkout uses the official button.",
      };
      return planCache;
    }

    if (!clientId) {
      return {
        ready: false,
        clientId: null,
        mode,
        plans: baked,
        message:
          "PayPal checkout is wired. Create a Business app at developer.paypal.com, then send the Client ID and Secret here.",
      };
    }

    if (!credentials()) {
      return {
        ready: false,
        clientId,
        mode,
        plans: baked,
        message: "Client ID is present. A Secret is still needed to create the three subscription plans.",
      };
    }

    if (planCache?.ready && planCache.clientId === clientId) return planCache;

    try {
      const plans: PaypalPublicPlan[] = [];
      for (const plan of PLANS) {
        const existing = envPlanId(plan.key);
        if (existing) {
          plans.push({ key: plan.key, planId: existing, price: plan.price });
          continue;
        }
        const productId = await findOrCreateProduct(plan.name, plan.description);
        const planId = await findOrCreatePlan({
          productId,
          name: plan.name,
          description: plan.description,
          price: plan.price,
        });
        plans.push({ key: plan.key, planId, price: plan.price });
      }
      const priced = await overlayLivePrices(plans);
      planCache = {
        ready: priced.every((p) => p.planId),
        clientId,
        mode,
        plans: priced,
        message: "PayPal subscriptions are live.",
      };
      return planCache;
    } catch (err) {
      return {
        ready: false,
        clientId,
        mode,
        plans: baked,
        message: err instanceof Error ? err.message : "PayPal plan setup failed",
      };
    }
  },
);
