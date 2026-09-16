import { useEffect } from "react";
import { isSyncDue, useBay } from "./store";

export function BayScheduler() {
  const hydrated = useBay((s) => s.hydrated);
  const lastSyncAt = useBay((s) => s.lastSyncAt);
  const intervalHours = useBay((s) => s.settings.intervalHours);
  const syncing = useBay((s) => s.syncing);
  const sync = useBay((s) => s.sync);

  useEffect(() => {
    const finish = () => {
      if (!useBay.getState().hydrated) useBay.getState().setHydrated();
    };
    const unsub = useBay.persist.onFinishHydration(finish);
    if (useBay.persist.hasHydrated()) finish();
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated || syncing) return;
    if (isSyncDue(lastSyncAt, intervalHours)) {
      void sync();
    }
  }, [hydrated, lastSyncAt, intervalHours, syncing, sync]);

  useEffect(() => {
    if (!hydrated) return;
    const tick = () => {
      if (document.visibilityState !== "visible") return;
      const s = useBay.getState();
      if (s.syncing) return;
      if (isSyncDue(s.lastSyncAt, s.settings.intervalHours)) void s.sync();
    };
    const id = window.setInterval(tick, 60_000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [hydrated]);

  return null;
}
