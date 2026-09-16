import { PERMISSIVE_LICENSES } from "@/lib/vault/licenses";
import { SAFETY_DISCLAIMER } from "@/lib/vault/export";

export function VaultPolicy() {
  return (
    <article className="max-w-2xl text-sm leading-relaxed text-muted">
      <h2 className="font-display text-2xl tracking-[-0.02em] text-fg">Permanence, not a pirate bay</h2>
      <p className="mt-3">
        The vault pins open models that already exist on the public Hugging Face
        Hub. HF is the source of truth. Forge does not take raw weight zips,
        does not invent hashes, and does not host the bytes.
      </p>

      <h3 className="mt-8 font-display text-xl text-fg">Admission</h3>
      <ul className="mt-3 grid gap-1.5">
        <li>Public Hub repo only — private and gated are rejected.</li>
        <li>
          License on the model card (or <code className="text-fg">license:</code> tag)
          must be clearly permissive OSI: {PERMISSIVE_LICENSES.join(", ")}.
        </li>
        <li>Llama, Gemma, OpenRAIL, NC, and blank/custom licenses fail the gate.</li>
        <li>Revision/commit is stored. Files without official LFS SHA-256 are not pinned.</li>
        <li>A baked denylist and any local report hide the id immediately.</li>
      </ul>

      <h3 className="mt-8 font-display text-xl text-fg">Downloads</h3>
      <p className="mt-2">
        Default is Hugging Face HTTPS at <code className="text-fg">/resolve/{"{revision}"}/{"{path}"}</code>
        — the BEP-19 web-seed. The torrent control is a fallback: a JSON bundle
        of those URLs plus SHA-256. It is not a BEP-3 .torrent; piece hashes
        need the bytes, which this workshop does not store.
      </p>

      <h3 className="mt-8 font-display text-xl text-fg">Checksums</h3>
      <p className="mt-2">{SAFETY_DISCLAIMER}</p>

      <h3 className="mt-8 font-display text-xl text-fg">Report and takedown</h3>
      <p className="mt-2">
        Every record has a report form (malware, license, illegal, other). A
        report drops the pin and hides the model id so it cannot be re-admitted
        until you restore it under Reports. If the Hub removes or gates a model,
        a later pin attempt fails. No tokens, airdrops, or leaked-weight UX.
      </p>
    </article>
  );
}
