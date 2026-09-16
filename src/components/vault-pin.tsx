import { Archive } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useVault } from "@/lib/vault/store";

export function VaultPinButton({
  id,
  revision,
}: {
  id: string;
  revision?: string | null;
}) {
  const pinFromHub = useVault((s) => s.pinFromHub);
  const admitting = useVault((s) => s.admitting);
  const records = useVault((s) => s.records);
  const lastError = useVault((s) => s.lastError);
  const [localError, setLocalError] = useState<string | null>(null);
  const already = Object.values(records).some(
    (r) => r.id === id && (!revision || r.revision === revision),
  );

  async function onPin() {
    setLocalError(null);
    const record = await pinFromHub(id, revision ?? undefined);
    if (!record) {
      const msg = useVault.getState().lastError ?? "Not admitted.";
      setLocalError(msg);
    }
  }

  return (
    <div className="grid gap-2">
      <Button variant="outline" onClick={() => void onPin()} disabled={admitting || already}>
        <Archive className="size-3.5" />
        {already ? "In vault" : admitting ? "Checking Hub…" : "Pin to vault"}
      </Button>
      {localError ? <p className="text-xs leading-relaxed text-muted">{localError}</p> : null}
      {!localError && lastError && admitting ? (
        <p className="text-xs text-muted">{lastError}</p>
      ) : null}
    </div>
  );
}
