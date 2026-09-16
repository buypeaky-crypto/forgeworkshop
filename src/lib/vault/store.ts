import { create } from "zustand";
import { persist } from "zustand/middleware";
import { inspectForVault } from "@/lib/hf";
import { admitFromHub } from "./admit";
import type { ReportReason, VaultRecord, VaultReport } from "./types";

type VaultState = {
  records: Record<string, VaultRecord>;
  hidden: string[];
  reports: VaultReport[];
  lastError: string | null;
  admitting: boolean;
  hydrated: boolean;
  setHydrated: () => void;
  pinFromHub: (id: string, revision?: string) => Promise<VaultRecord | null>;
  drop: (key: string) => void;
  hide: (id: string) => void;
  unhide: (id: string) => void;
  report: (input: {
    modelId: string;
    revision: string;
    reason: ReportReason;
    note: string;
  }) => void;
};

export const useVault = create<VaultState>()(
  persist(
    (set, get) => ({
      records: {},
      hidden: [],
      reports: [],
      lastError: null,
      admitting: false,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      pinFromHub: async (raw, revision) => {
        const id = raw.trim();
        if (!id) return null;
        set({ admitting: true, lastError: null });
        try {
          const inspect = await inspectForVault({
            data: { id, revision: revision?.trim() || undefined },
          });
          if (inspect.error && inspect.tree.length === 0 && !inspect.sha) {
            set({ admitting: false, lastError: inspect.error });
            return null;
          }
          const result = admitFromHub({
            id: inspect.id,
            sha: inspect.sha,
            private: inspect.private,
            gated: inspect.gated,
            pipeline_tag: inspect.pipeline_tag,
            tags: inspect.tags,
            license: inspect.license,
            tree: inspect.tree,
          });
          if (!result.ok) {
            set({ admitting: false, lastError: result.reason });
            return null;
          }
          if (get().hidden.includes(result.record.id)) {
            set({
              admitting: false,
              lastError: "This model is hidden after a report. Restore it from Reports first.",
            });
            return null;
          }
          set((s) => ({
            records: { ...s.records, [result.record.key]: result.record },
            admitting: false,
            lastError: null,
          }));
          return result.record;
        } catch (err) {
          set({
            admitting: false,
            lastError: err instanceof Error ? err.message : "Vault pin failed",
          });
          return null;
        }
      },
      drop: (key) =>
        set((s) => {
          const records = { ...s.records };
          delete records[key];
          return { records };
        }),
      hide: (id) =>
        set((s) => {
          const records = { ...s.records };
          for (const key of Object.keys(records)) {
            if (records[key]?.id === id) delete records[key];
          }
          return {
            records,
            hidden: s.hidden.includes(id) ? s.hidden : [...s.hidden, id],
          };
        }),
      unhide: (id) => set((s) => ({ hidden: s.hidden.filter((x) => x !== id) })),
      report: ({ modelId, revision, reason, note }) => {
        const row: VaultReport = {
          id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          modelId,
          revision,
          reason,
          note: note.trim().slice(0, 500),
          at: new Date().toISOString(),
        };
        set((s) => {
          const records = { ...s.records };
          for (const key of Object.keys(records)) {
            if (records[key]?.id === modelId) delete records[key];
          }
          return {
            reports: [row, ...s.reports].slice(0, 80),
            records,
            hidden: s.hidden.includes(modelId) ? s.hidden : [...s.hidden, modelId],
          };
        });
      },
    }),
    {
      name: "forge-vault-v1",
      partialize: (s) => ({
        records: s.records,
        hidden: s.hidden,
        reports: s.reports,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

export function vaultList(records: Record<string, VaultRecord>): VaultRecord[] {
  return Object.values(records).sort((a, b) => b.pinnedAt.localeCompare(a.pinnedAt));
}
