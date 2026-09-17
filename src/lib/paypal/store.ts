import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanKey } from "./plans";

export type PaypalSubscription = {
  planKey: PlanKey;
  subscriptionId: string;
  at: string;
};

type PaypalState = {
  subscription: PaypalSubscription | null;
  setSubscription: (row: PaypalSubscription) => void;
  clear: () => void;
};

export const usePaypal = create<PaypalState>()(
  persist(
    (set) => ({
      subscription: null,
      setSubscription: (subscription) => set({ subscription }),
      clear: () => set({ subscription: null }),
    }),
    { name: "forge-paypal-v1" },
  ),
);

export function hasPlan(sub: PaypalSubscription | null, key: PlanKey): boolean {
  return sub?.planKey === key;
}
