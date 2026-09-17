import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { downloadText, vaultAuditText } from "@/lib/paypal/audit";
import { hasPlan, usePaypal } from "@/lib/paypal/store";
import { vaultList, useVault } from "@/lib/vault/store";
import { useBay } from "@/lib/bay/store";

export function VaultPerks() {
  const subscription = usePaypal((s) => s.subscription);
  const records = useVault((s) => s.records);
  const models = useBay((s) => s.models);
  const log = useBay((s) => s.log);
  const sponsor = hasPlan(subscription, "sponsor");
  const vaultPro = hasPlan(subscription, "vault");
  const signals = hasPlan(subscription, "signals");
  const auditOk = vaultPro || sponsor;
  const list = vaultList(records);

  return (
    <section className="mt-12 rounded-xl bg-surface px-5 py-6 shadow-[var(--shadow-border)] sm:px-6">
      {sponsor ? (
        <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-raised font-display text-lg">
            F
          </span>
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">Sponsor</p>
            <p className="font-display text-xl tracking-[-0.02em]">Forge Sponsor</p>
          </div>
        </div>
      ) : null}
      <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">Subscriber tools</p>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Vault Pro unlocks the SHA-256 audit. Signals API exports bay history as
        JSON. Sponsor places a mark in this footer.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={!auditOk}
          onClick={() => downloadText("forge-vault-audit.txt", vaultAuditText(list))}
        >
          SHA-256 audit
        </Button>
        <Button
          variant="outline"
          disabled={!signals}
          onClick={() =>
            downloadText(
              "bay.json",
              JSON.stringify(
                { models, log, exportedAt: new Date().toISOString() },
                null,
                2,
              ),
              "application/json",
            )
          }
        >
          Download bay.json
        </Button>
        {!subscription ? (
          <Link
            to="/subscribe"
            className="inline-flex h-11 items-center px-3 text-sm text-muted hover:text-fg"
          >
            Subscribe on PayPal
          </Link>
        ) : null}
      </div>
    </section>
  );
}
