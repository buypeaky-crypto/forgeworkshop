export const PAYPAL_MODE = "live" as const;

/** Public REST Client ID (browser SDK). Secret is never shipped. */
export const PAYPAL_CLIENT_ID =
  "BAACmrgBU9Y2WQvxLemxUHGup5Il7me80I4BWA1XWcyqW1UAyh4XrxQyG6tC8-L6ChjX6jovyl2b6VBVq4";

export const PAYPAL_PLAN_IDS = {
  vault: "P-1RB47360TY9799833NKWWBLY",
  signals: "P-2TX24136JD286434DNKWWBLY",
  sponsor: "P-8HG92610GD659343PNKWBCBY",
} as const;

export const PLANS = [
  {
    key: "vault",
    product: "Vault Keeper",
    name: "Forge Vault Pro",
    price: 29,
    description:
      "100 permanent pins, SHA-256 audit PDF, torrent web-seed guarantee",
    features: [
      "100 permanent vault pins",
      "SHA-256 audit download",
      "Web-seed bundle on every pin",
    ],
  },
  {
    key: "signals",
    product: "Signal API",
    name: "Forge Signals API",
    price: 49,
    description: "10k requests/mo, trending early alerts, /bay.json history",
    features: [
      "10k Hub/bay requests per month",
      "Trending early alerts from the bay",
      "Download /bay.json history",
    ],
  },
  {
    key: "sponsor",
    product: "Sponsor",
    name: "Forge Sponsor",
    price: 10.99,
    description: "Logo in vault footer + 50 Pro pins",
    features: ["Sponsor mark in the vault footer", "50 Pro vault pins", "Keeps the workshop independent"],
  },
] as const;

export type PlanKey = (typeof PLANS)[number]["key"];

export function planByKey(key: string) {
  return PLANS.find((p) => p.key === key);
}

/** $29 stays $29; $10.99 keeps cents. */
export function formatPlanPrice(price: number): string {
  return Number.isInteger(price) ? String(price) : price.toFixed(2);
}
