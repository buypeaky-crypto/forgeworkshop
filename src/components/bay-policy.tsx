export function BayPolicy() {
  return (
    <article className="max-w-2xl text-sm leading-relaxed text-muted">
      <h2 className="font-display text-2xl tracking-[-0.02em] text-fg">How the bay decides</h2>
      <p className="mt-3">
        Forge does not store multi-gigabyte weights in the browser. The bay is a
        versioned local catalog: Hub metadata, file inventory, score, and the
        last three revisions. Weights stay on Hugging Face until you run the
        copied CLI locally.
      </p>

      <h3 className="mt-8 font-display text-xl text-fg">Score</h3>
      <p className="mt-2">
        Each candidate is classified into a domain, then scored 0–1:
      </p>
      <ul className="mt-3 grid gap-1.5">
        <li>35% downloads — log1p, referenced to 5M</li>
        <li>15% likes — log1p, referenced to 8k</li>
        <li>20% recency — exponential decay, 45-day time constant on lastModified</li>
        <li>15% quality — safetensors, permissive license, paper/arxiv tag, likes ≥ 200</li>
        <li>15% task fit — pipeline or tags matching the assigned domain</li>
      </ul>
      <p className="mt-3">
        “Important” is the download/like mass. “Relevant” is recency plus domain
        fit. Quality stops junk forks with huge download counters from crowding
        out maintained checkpoints.
      </p>

      <h3 className="mt-8 font-display text-xl text-fg">Triage</h3>
      <p className="mt-2">
        Each domain keeps its pins plus the highest-scoring auto slots (default 5).
        Auto picks need a score of at least 0.42 (0.55 for Other) so a burst of
        brand-new Hub dumps cannot crowd the shelf. If the bay exceeds max size,
        the lowest unpinned scores drop. Pins never drop.
      </p>

      <h3 className="mt-8 font-display text-xl text-fg">Updates and conflicts</h3>
      <p className="mt-2">
        Default interval is 12 hours, checked on load and every minute while the
        page is visible. When a snapshot’s SHA changes: follow (the default)
        writes the new revision and keeps up to three previous snapshots.
        Lock leaves the current snapshot in place and stores the Hub revision
        as pending until you adopt it.
      </p>

      <h3 className="mt-8 font-display text-xl text-fg">Storage</h3>
      <p className="mt-2">
        Everything lives in this browser under <code className="text-fg">forge-bay-v1</code>.
        No account. Clearing site data clears the bay. A record is the model
        id, domain, score vector, current snapshot (sha, files, license, stats),
        and history. That is enough to resume a local <code className="text-fg">huggingface-cli download</code>.
      </p>

      <h3 className="mt-8 font-display text-xl text-fg">Exceptions without breaking auto</h3>
      <p className="mt-2">
        Pin, exclude, or add a domain rule on the Exceptions tab. Rules are
        applied before scoring; exclusions before that; pins after. Adding a
        pin never changes the formula — it only reserves a slot. Removing a
        pin returns the model to ordinary competition on the next sync.
      </p>
    </article>
  );
}
