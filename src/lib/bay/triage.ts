import { classifyModel } from "./domains";
import { scoreModel } from "./score";
import type { BayModel, BaySettings, DomainId, DomainRule, PinPolicy } from "./types";
import { DOMAIN_IDS } from "./types";

export type HubCandidate = {
  id: string;
  pipeline_tag?: string;
  library_name?: string;
  downloads?: number;
  likes?: number;
  tags?: string[];
  lastModified?: string;
  sha?: string;
  license?: string;
  hasSafetensors?: boolean;
};

export type ScoredCandidate = HubCandidate & {
  domain: DomainId;
  score: ReturnType<typeof scoreModel>;
};

export function applyExceptions(
  candidates: HubCandidate[],
  exclusions: string[],
  rules: DomainRule[],
): ScoredCandidate[] {
  const banned = new Set(exclusions.map((id) => id.toLowerCase()));
  const out: ScoredCandidate[] = [];
  const seen = new Set<string>();
  for (const model of candidates) {
    const key = model.id.toLowerCase();
    if (!model.id || banned.has(key) || seen.has(key)) continue;
    seen.add(key);
    const domain = classifyModel(model, rules);
    out.push({ ...model, domain, score: scoreModel(model, domain) });
  }
  return out;
}

export function pickShelf(
  scored: ScoredCandidate[],
  pins: Record<string, { policy: PinPolicy }>,
  settings: BaySettings,
): ScoredCandidate[] {
  const pinIds = Object.keys(pins);
  const byDomain = new Map<DomainId, ScoredCandidate[]>();
  for (const id of DOMAIN_IDS) byDomain.set(id, []);
  for (const item of scored) {
    byDomain.get(item.domain)?.push(item);
  }
  for (const list of byDomain.values()) {
    list.sort((a, b) => b.score.total - a.score.total);
  }

  const kept = new Map<string, ScoredCandidate>();
  const scoredById = new Map(scored.map((s) => [s.id, s]));

  for (const id of pinIds) {
    const hit = scoredById.get(id);
    if (hit) kept.set(id, hit);
  }

  for (const domain of DOMAIN_IDS) {
    const list = byDomain.get(domain) ?? [];
    const pinnedHere = list.filter((m) => pins[m.id]).length;
    const cap = domain === "other" ? Math.min(2, settings.keepPerDomain) : settings.keepPerDomain;
    const slots = Math.max(0, cap - pinnedHere);
    const floor = domain === "other" ? 0.55 : 0.42;
    let taken = 0;
    for (const item of list) {
      if (kept.has(item.id)) continue;
      if (item.score.total < floor) continue;
      if (taken >= slots) break;
      kept.set(item.id, item);
      taken += 1;
    }
  }

  let selected = [...kept.values()];
  if (selected.length > settings.maxModels) {
    const unpinned = selected
      .filter((m) => !pins[m.id])
      .sort((a, b) => a.score.total - b.score.total);
    const overflow = selected.length - settings.maxModels;
    const drop = new Set(unpinned.slice(0, overflow).map((m) => m.id));
    selected = selected.filter((m) => !drop.has(m.id));
  }
  return selected;
}

export function nextHistory(model: BayModel | undefined, snapshot: BayModel["snapshot"]) {
  if (!model) return [];
  const prev = [model.snapshot, ...model.history];
  return prev.slice(0, 3);
}
