import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { WALLETS, type Wallet } from "@/lib/wallets";
import { cn } from "@/lib/utils";

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = value;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  }
}

function WalletRow({ wallet }: { wallet: Wallet }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const ok = await copyText(wallet.address);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-raised px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
      <p className="w-16 shrink-0 text-xs font-medium tracking-[0.14em] text-muted uppercase">
        {wallet.chain}
      </p>
      <code className="min-w-0 flex-1 truncate font-mono text-xs text-fg sm:text-sm">
        {wallet.address}
      </code>
      <button
        type="button"
        onClick={() => void onCopy()}
        className={cn(
          "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md px-3 text-sm",
          copied ? "text-fg" : "text-muted hover:text-fg",
        )}
        aria-label={`Copy ${wallet.label} address`}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export function DonateAsk({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={cn(
        "rounded-xl bg-surface shadow-[var(--shadow-border)]",
        compact ? "px-4 py-4" : "px-5 py-6 sm:px-6",
      )}
    >
      <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
        Support
      </p>
      <h2 className={cn("mt-2 font-display tracking-[-0.02em]", compact ? "text-xl" : "text-2xl")}>
        A small donation keeps Forge independent
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Forge talks only to the public Hugging Face Hub. It never calls an xAI
        key. If the workshop is useful, a coffee-sized send on any of these
        chains is enough.
      </p>
      <div className="mt-5 grid gap-2">
        {WALLETS.map((wallet) => (
          <WalletRow key={wallet.chain} wallet={wallet} />
        ))}
      </div>
    </section>
  );
}
