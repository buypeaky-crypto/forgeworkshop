import { pullSnapshots, scoutHub, type HubSnapshot } from "@/lib/hf";
import { scoreModel } from "./score";
import { applyExceptions, nextHistory, pickShelf, type HubCandidate } from "./triage";
import type { BayModel, PinPolicy, RevisionSnapshot, SyncLogEntry } from "./types";

function asRevision(snap: HubSnapshot, pulledAt: string): RevisionSnapshot {
  return {
    sha: snap.sha,
    lastModified: snap.lastModified,
    downloads: snap.downloads,
    likes: snap.likes,
    pipeline: snap.pipeline,
    library: snap.library,
    license: snap.license,
    tags: snap.tags,
    files: snap.files,
    params: snap.params,
    pulledAt,
  };
}

export type SyncInput = {
  exclusions: string[];
  rules: {
    id: string;
    kind: "pipeline" | "tag" | "keyword";
    match: string;
    domain: BayModel["domain"];
  }[];
  pins: Record<string, { policy: PinPolicy }>;
  settings: { keepPerDomain: number; maxModels: number; intervalHours: 6 | 12 | 24 };
  models: Record<string, BayModel>;
};

export type SyncOutput = {
  models: Record<string, BayModel>;
  log: SyncLogEntry[];
};

export async function runBaySync(input: SyncInput): Promise<SyncOutput> {
  const now = new Date().toISOString();
  const log: SyncLogEntry[] = [];
  const scouted = await scoutHub();
  const candidates: HubCandidate[] = scouted.map((m) => ({
    id: m.id,
    pipeline_tag: m.pipeline_tag,
    library_name: m.library_name,
    downloads: m.downloads,
    likes: m.likes,
    tags: m.tags,
    lastModified: m.lastModified,
    sha: m.sha,
  }));

  for (const id of Object.keys(input.pins)) {
    if (!candidates.some((c) => c.id === id) && !input.exclusions.includes(id)) {
      candidates.push({ id });
    }
  }

  const scored = applyExceptions(candidates, input.exclusions, input.rules);
  const selected = pickShelf(scored, input.pins, input.settings);
  const snapshots = await pullSnapshots({ data: { ids: selected.map((s) => s.id) } });
  const snapById = new Map(snapshots.map((s) => [s.id, s]));
  const next: Record<string, BayModel> = {};

  for (const item of selected) {
    const snap = snapById.get(item.id);
    const prev = input.models[item.id];
    const pin = input.pins[item.id];
    const origin: BayModel["origin"] = pin
      ? prev?.origin === "manual"
        ? "manual"
        : "pin"
      : "auto";

    if (!snap || snap.error) {
      if (prev) {
        next[item.id] = { ...prev, status: "error", error: snap?.error ?? "Pull failed" };
      }
      log.push({
        at: now,
        action: "error",
        id: item.id,
        detail: snap?.error ?? "Hub pull failed",
      });
      continue;
    }

    const revision = asRevision(snap, now);
    const score = scoreModel(
      {
        downloads: snap.downloads,
        likes: snap.likes,
        lastModified: snap.lastModified ?? undefined,
        pipeline_tag: snap.pipeline,
        tags: snap.tags,
        license: snap.license,
        hasSafetensors: snap.hasSafetensors,
      },
      item.domain,
    );

    if (!prev) {
      next[item.id] = {
        id: item.id,
        domain: item.domain,
        origin,
        score,
        snapshot: revision,
        history: [],
        status: pin?.policy === "lock" ? "locked" : "current",
      };
      log.push({
        at: now,
        action: pin ? "pinned" : "added",
        id: item.id,
        detail: `Shelved in ${item.domain} · score ${score.total.toFixed(2)}`,
      });
      continue;
    }

    const shaChanged = Boolean(snap.sha && prev.snapshot.sha && snap.sha !== prev.snapshot.sha);
    const locked = pin?.policy === "lock";

    if (shaChanged && locked) {
      next[item.id] = {
        ...prev,
        domain: item.domain,
        origin,
        score,
        status: "locked",
        pending: revision,
      };
      log.push({
        at: now,
        action: "locked",
        id: item.id,
        detail: `Hub moved to ${(snap.sha ?? "").slice(0, 7)}; pin holds ${(prev.snapshot.sha ?? "").slice(0, 7)}`,
      });
      continue;
    }

    if (shaChanged) {
      next[item.id] = {
        id: item.id,
        domain: item.domain,
        origin,
        score,
        snapshot: revision,
        history: nextHistory(prev, revision),
        status: "updated",
      };
      log.push({
        at: now,
        action: "updated",
        id: item.id,
        detail: `${(prev.snapshot.sha ?? "—").slice(0, 7)} → ${(snap.sha ?? "—").slice(0, 7)}`,
      });
      continue;
    }

    next[item.id] = {
      ...prev,
      domain: item.domain,
      origin,
      score,
      snapshot: {
        ...prev.snapshot,
        downloads: snap.downloads,
        likes: snap.likes,
        pulledAt: now,
      },
      status: locked ? "locked" : "current",
      pending: undefined,
      error: undefined,
    };
    log.push({
      at: now,
      action: "kept",
      id: item.id,
      detail: `Unchanged ${(snap.sha ?? prev.snapshot.sha ?? "—").slice(0, 7)}`,
    });
  }

  for (const id of Object.keys(input.models)) {
    if (next[id]) continue;
    if (input.pins[id]) {
      next[id] = { ...input.models[id]!, status: "stale" };
      continue;
    }
    log.push({
      at: now,
      action: "dropped",
      id,
      detail: "Below domain quota after rescore",
    });
  }

  return { models: next, log };
}

export function cliPull(id: string, sha?: string | null): string {
  return sha
    ? `huggingface-cli download ${id} --revision ${sha}`
    : `huggingface-cli download ${id}`;
}
