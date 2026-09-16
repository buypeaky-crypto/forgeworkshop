import { useState } from "react";
import { DOMAINS, isDomainId } from "@/lib/bay/domains";
import { useBay } from "@/lib/bay/store";
import type { DomainId, DomainRule } from "@/lib/bay/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const selectClass =
  "h-11 rounded-lg bg-surface px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none focus-visible:shadow-[var(--shadow-border-hover)]";

export function BayExceptions() {
  const pins = useBay((s) => s.pins);
  const exclusions = useBay((s) => s.exclusions);
  const rules = useBay((s) => s.rules);
  const settings = useBay((s) => s.settings);
  const pin = useBay((s) => s.pin);
  const unpin = useBay((s) => s.unpin);
  const setPinPolicy = useBay((s) => s.setPinPolicy);
  const exclude = useBay((s) => s.exclude);
  const unexclude = useBay((s) => s.unexclude);
  const addRule = useBay((s) => s.addRule);
  const removeRule = useBay((s) => s.removeRule);
  const addManual = useBay((s) => s.addManual);
  const setSettings = useBay((s) => s.setSettings);
  const syncing = useBay((s) => s.syncing);

  const [pinId, setPinId] = useState("");
  const [excludeId, setExcludeId] = useState("");
  const [ruleMatch, setRuleMatch] = useState("");
  const [ruleKind, setRuleKind] = useState<DomainRule["kind"]>("keyword");
  const [ruleDomain, setRuleDomain] = useState<DomainId>("language");
  const [manualBusy, setManualBusy] = useState(false);

  async function onManual(e: React.FormEvent) {
    e.preventDefault();
    if (!pinId.trim()) return;
    setManualBusy(true);
    try {
      pin(pinId.trim(), "follow");
      await addManual(pinId.trim());
      setPinId("");
    } finally {
      setManualBusy(false);
    }
  }

  return (
    <div className="grid gap-10">
      <section>
        <h2 className="font-display text-2xl tracking-[-0.02em]">Pin a model</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Pins stay in the bay even when they lose the automatic quota. Follow
          picks up new Hub revisions. Lock keeps the snapshot you already pulled.
        </p>
        <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => void onManual(e)}>
          <Input
            value={pinId}
            onChange={(e) => setPinId(e.target.value)}
            placeholder="org/model-id"
            className="sm:max-w-sm"
            autoComplete="off"
            spellCheck={false}
          />
          <Button type="submit" disabled={manualBusy || syncing || !pinId.trim()}>
            {manualBusy ? "Pulling…" : "Pin and pull"}
          </Button>
        </form>
        <ul className="mt-4 grid gap-2">
          {Object.keys(pins).length === 0 ? (
            <li className="text-sm text-subtle">No pins yet.</li>
          ) : (
            Object.entries(pins).map(([id, pinRow]) => (
              <li
                key={id}
                className="flex flex-col gap-2 rounded-lg bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="min-w-0 font-mono text-sm break-all text-fg">{id}</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    className="h-10"
                    onClick={() =>
                      setPinPolicy(id, pinRow.policy === "lock" ? "follow" : "lock")
                    }
                  >
                    {pinRow.policy === "lock" ? "Locked" : "Following"}
                  </Button>
                  <Button variant="outline" className="h-10" onClick={() => unpin(id)}>
                    Remove
                  </Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-[-0.02em]">Exclude</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Excluded ids are skipped before scoring. They will not re-enter on the
          next automatic pass.
        </p>
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (!excludeId.trim()) return;
            exclude(excludeId.trim());
            setExcludeId("");
          }}
        >
          <Input
            value={excludeId}
            onChange={(e) => setExcludeId(e.target.value)}
            placeholder="org/model-id"
            className="sm:max-w-sm"
            autoComplete="off"
            spellCheck={false}
          />
          <Button type="submit" variant="outline" disabled={!excludeId.trim()}>
            Exclude
          </Button>
        </form>
        <ul className="mt-4 grid gap-2">
          {exclusions.length === 0 ? (
            <li className="text-sm text-subtle">Nothing excluded.</li>
          ) : (
            exclusions.map((id) => (
              <li
                key={id}
                className="flex items-center justify-between gap-3 rounded-lg bg-surface px-4 py-3"
              >
                <p className="min-w-0 font-mono text-sm break-all">{id}</p>
                <Button variant="ghost" className="h-10" onClick={() => unexclude(id)}>
                  Restore
                </Button>
              </li>
            ))
          )}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-[-0.02em]">Domain rules</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          First matching rule wins, before the built-in taxonomy. Use this for
          odd models you still want on a named shelf.
        </p>
        <form
          className="mt-4 grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)_9rem_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            if (!ruleMatch.trim()) return;
            addRule({ kind: ruleKind, match: ruleMatch, domain: ruleDomain });
            setRuleMatch("");
          }}
        >
          <select
            className={selectClass}
            value={ruleKind}
            onChange={(e) => setRuleKind(e.target.value as DomainRule["kind"])}
            aria-label="Rule kind"
          >
            <option value="keyword">Keyword</option>
            <option value="tag">Tag</option>
            <option value="pipeline">Pipeline</option>
          </select>
          <Input
            value={ruleMatch}
            onChange={(e) => setRuleMatch(e.target.value)}
            placeholder="match"
            autoComplete="off"
            spellCheck={false}
          />
          <select
            className={selectClass}
            value={ruleDomain}
            onChange={(e) => {
              if (isDomainId(e.target.value)) setRuleDomain(e.target.value);
            }}
            aria-label="Target domain"
          >
            {DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
          <Button type="submit" variant="outline" disabled={!ruleMatch.trim()}>
            Add rule
          </Button>
        </form>
        <ul className="mt-4 grid gap-2">
          {rules.length === 0 ? (
            <li className="text-sm text-subtle">No custom rules.</li>
          ) : (
            rules.map((rule) => (
              <li
                key={rule.id}
                className="flex flex-col gap-2 rounded-lg bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-sm text-muted">
                  <span className="text-fg">{rule.kind}</span> “{rule.match}” → {rule.domain}
                </p>
                <Button variant="ghost" className="h-10" onClick={() => removeRule(rule.id)}>
                  Remove
                </Button>
              </li>
            ))
          )}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-[-0.02em]">Cadence</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          While this tab is open, Forge checks once a minute and syncs when the
          interval has elapsed. Closing the app pauses the clock; the next visit
          catches up.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="text-sm text-muted" htmlFor="bay-interval">
            Sync every
          </label>
          <select
            id="bay-interval"
            className={selectClass}
            value={settings.intervalHours}
            onChange={(e) =>
              setSettings({ intervalHours: Number(e.target.value) as 6 | 12 | 24 })
            }
          >
            <option value={6}>6 hours</option>
            <option value={12}>12 hours</option>
            <option value={24}>24 hours</option>
          </select>
          <label className="text-sm text-muted" htmlFor="bay-keep">
            Keep per domain
          </label>
          <select
            id="bay-keep"
            className={selectClass}
            value={settings.keepPerDomain}
            onChange={(e) => setSettings({ keepPerDomain: Number(e.target.value) })}
          >
            {[3, 4, 5, 6, 8].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </section>
    </div>
  );
}
