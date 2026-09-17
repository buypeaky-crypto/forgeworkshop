import type { Availability, TrustCard } from "./types";

export function availabilityOf(
  card: TrustCard | null,
  opts: { localPin?: boolean; mismatch?: boolean },
): Availability {
  if (opts.mismatch) return "Hash mismatch";
  if (!card) return opts.localPin ? "Rescued by swarm" : "Web-seed only";
  if (card.hubLive && card.resolveLive) return "Live on HF";
  if (!card.hubLive && opts.localPin) return "Rescued by swarm";
  return "Web-seed only";
}
