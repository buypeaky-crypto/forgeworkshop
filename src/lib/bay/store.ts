import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DOMAIN_IDS, DEFAULT_SETTINGS } from "./types";
import type {
  BayModel,
  BaySettings,
  DomainId,
  DomainRule,
  PinPolicy,
  SyncLogEntry,
} from "./types";
import { isDomainId } from "./domains";
import { runBaySync } from "./sync";

type BayState = {
  settings: BaySettings;
  pins: Record<string, { policy: PinPolicy; addedAt: string }>;
  exclusions: string[];
  rules: DomainRule[];
  models: Record<string, BayModel>;
  lastSyncAt: string | null;
  lastSyncError: string | null;
  log: SyncLogEntry[];
  syncing: boolean;
  hydrated: boolean;
  setHydrated: () => void;
  setSettings: (patch: Partial<BaySettings>) => void;
  pin: (id: string, policy?: PinPolicy) => void;
  unpin: (id: string) => void;
  setPinPolicy: (id: string, policy: PinPolicy) => void;
  exclude: (id: string) => void;
  unexclude: (id: string) => void;
  addRule: (rule: Omit<DomainRule, "id">) => void;
  removeRule: (id: string) => void;
  addManual: (id: string) => Promise<void>;
  adoptPending: (id: string) => void;
  sync: () => Promise<void>;
};

let inflight: Promise<void> | null = null;

function trimLog(log: SyncLogEntry[]): SyncLogEntry[] {
  return log.slice(0, 60);
}

export const useBay = create<BayState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      pins: {},
      exclusions: [],
      rules: [],
      models: {},
      lastSyncAt: null,
      lastSyncError: null,
      log: [],
      syncing: false,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setSettings: (patch) =>
        set((s) => ({
          settings: {
            ...s.settings,
            ...patch,
            keepPerDomain: Math.min(12, Math.max(2, patch.keepPerDomain ?? s.settings.keepPerDomain)),
            maxModels: Math.min(60, Math.max(8, patch.maxModels ?? s.settings.maxModels)),
          },
        })),
      pin: (id, policy = "follow") => {
        const clean = id.trim();
        if (!clean) return;
        set((s) => ({
          pins: { ...s.pins, [clean]: { policy, addedAt: new Date().toISOString() } },
          exclusions: s.exclusions.filter((x) => x !== clean),
        }));
      },
      unpin: (id) =>
        set((s) => {
          const pins = { ...s.pins };
          delete pins[id];
          return { pins };
        }),
      setPinPolicy: (id, policy) =>
        set((s) => {
          const cur = s.pins[id];
          if (!cur) return s;
          return { pins: { ...s.pins, [id]: { ...cur, policy } } };
        }),
      exclude: (id) => {
        const clean = id.trim();
        if (!clean) return;
        set((s) => {
          const pins = { ...s.pins };
          delete pins[clean];
          const models = { ...s.models };
          delete models[clean];
          return {
            exclusions: s.exclusions.includes(clean) ? s.exclusions : [...s.exclusions, clean],
            pins,
            models,
          };
        });
      },
      unexclude: (id) =>
        set((s) => ({ exclusions: s.exclusions.filter((x) => x !== id) })),
      addRule: (rule) => {
        const match = rule.match.trim();
        if (!match || !isDomainId(rule.domain)) return;
        set((s) => ({
          rules: [
            ...s.rules,
            { ...rule, id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, match },
          ],
        }));
      },
      removeRule: (id) => set((s) => ({ rules: s.rules.filter((r) => r.id !== id) })),
      addManual: async (raw) => {
        const id = raw.trim();
        if (!id) return;
        get().pin(id, "follow");
        set((s) => {
          const existing = s.models[id];
          if (existing) return { models: { ...s.models, [id]: { ...existing, origin: "manual" } } };
          return s;
        });
        await get().sync();
      },
      adoptPending: (id) =>
        set((s) => {
          const model = s.models[id];
          if (!model?.pending) return s;
          return {
            models: {
              ...s.models,
              [id]: {
                ...model,
                snapshot: model.pending,
                history: [model.snapshot, ...model.history].slice(0, 3),
                pending: undefined,
                status: s.pins[id]?.policy === "lock" ? "locked" : "updated",
              },
            },
          };
        }),
      sync: async () => {
        if (inflight) return inflight;
        inflight = (async () => {
          set({ syncing: true, lastSyncError: null });
          try {
            const s = get();
            const result = await runBaySync({
              exclusions: s.exclusions,
              rules: s.rules,
              pins: Object.fromEntries(
                Object.entries(s.pins).map(([id, pin]) => [id, { policy: pin.policy }]),
              ),
              settings: s.settings,
              models: s.models,
            });
            set((prev) => ({
              models: result.models,
              log: trimLog([...result.log, ...prev.log]),
              lastSyncAt: new Date().toISOString(),
              lastSyncError: null,
              syncing: false,
            }));
          } catch (err) {
            set({
              syncing: false,
              lastSyncError: err instanceof Error ? err.message : "Sync failed",
            });
          }
        })().finally(() => {
          inflight = null;
        });
        return inflight;
      },
    }),
    {
      name: "forge-bay-v1",
      partialize: (s) => ({
        settings: s.settings,
        pins: s.pins,
        exclusions: s.exclusions,
        rules: s.rules,
        models: s.models,
        lastSyncAt: s.lastSyncAt,
        log: s.log.slice(0, 40),
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

export function bayList(models: Record<string, BayModel>, domain?: DomainId | "all"): BayModel[] {
  const list = Object.values(models);
  const filtered = !domain || domain === "all" ? list : list.filter((m) => m.domain === domain);
  return filtered.sort((a, b) => b.score.total - a.score.total);
}

export function domainCounts(models: Record<string, BayModel>): Record<DomainId, number> {
  const counts = Object.fromEntries(DOMAIN_IDS.map((id) => [id, 0])) as Record<DomainId, number>;
  for (const m of Object.values(models)) counts[m.domain] += 1;
  return counts;
}

export function isSyncDue(lastSyncAt: string | null, intervalHours: number, now = Date.now()): boolean {
  if (!lastSyncAt) return true;
  const t = Date.parse(lastSyncAt);
  if (Number.isNaN(t)) return true;
  return now - t >= intervalHours * 3_600_000;
}
