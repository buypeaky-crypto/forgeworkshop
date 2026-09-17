import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { probeTrust, verifyRemoteFile } from "@/lib/hf";
import { availabilityOf } from "@/lib/trust/availability";
import type { Availability, TrustCard, TrustFile, VerifyFileResult } from "@/lib/trust/types";
import { hubCardUrl, hubTreeUrl } from "@/lib/vault/webseed";
import { formatBytes, shortSha } from "@/lib/utils";

async function sha256Buffer(buf: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function TrustPanel({
  id,
  revision,
  license,
  localPin,
  initialFiles,
}: {
  id: string;
  revision?: string | null;
  license?: string | null;
  localPin?: boolean;
  initialFiles?: TrustFile[];
}) {
  const [card, setCard] = useState<TrustCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [results, setResults] = useState<VerifyFileResult[]>([]);
  const [mismatch, setMismatch] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setResults([]);
    setMismatch(false);
    void probeTrust({ data: { id, revision: revision ?? undefined } })
      .then((next) => {
        if (!cancelled) setCard(next);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, revision]);

  const files = card?.files?.length ? card.files : (initialFiles ?? []);
  const shownLicense = card?.license ?? license ?? "—";
  const shownRev = card?.revision ?? revision ?? null;
  const state: Availability = availabilityOf(card, { localPin, mismatch });

  async function onVerify() {
    if (!shownRev || files.length === 0) return;
    setVerifying(true);
    const out: VerifyFileResult[] = [];
    let bad = false;
    for (const file of files.slice(0, 12)) {
      const result = await verifyRemoteFile({
        data: {
          id,
          revision: shownRev,
          path: file.path,
          expected: file.sha256,
          size: file.size,
        },
      });
      out.push(result);
      if (!result.match) bad = true;
    }
    setResults(out);
    setMismatch(bad);
    setVerifying(false);
  }

  async function onLocal(fileMeta: TrustFile, blob: File) {
    const actual = await sha256Buffer(await blob.arrayBuffer());
    const match = actual === fileMeta.sha256;
    const row: VerifyFileResult = {
      path: fileMeta.path,
      expected: fileMeta.sha256,
      actual,
      match,
      source: "local",
      detail: match
        ? "Local bytes match the official SHA-256."
        : "Local bytes do not match the official SHA-256.",
    };
    setResults((prev) => {
      const next = [...prev.filter((r) => r.path !== fileMeta.path), row];
      setMismatch(next.some((r) => !r.match));
      return next;
    });
  }

  return (
    <section className="mt-5 px-5">
      <p className="text-xs font-medium tracking-[0.14em] text-muted uppercase">Trust</p>
      <p className="mt-2 text-xs leading-relaxed text-subtle">
        Official hashes from Hugging Face. Checksums prove bytes match the Hub,
        not that a model is safe to run.
      </p>
      <dl className="mt-3 grid gap-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-subtle">HF repo</dt>
          <dd className="min-w-0 font-mono text-right text-fg break-all">{id}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-subtle">Revision</dt>
          <dd className="font-mono text-fg" title={shownRev ?? undefined}>
            {shownRev ? shortSha(shownRev) : "—"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-subtle">License</dt>
          <dd className="text-right text-fg">{shownLicense}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-subtle">Availability</dt>
          <dd>
            <Badge>{loading ? "Checking Hub" : state}</Badge>
          </dd>
        </div>
      </dl>

      {files.length > 0 ? (
        <ul className="mt-3 grid gap-2">
          {files.slice(0, 8).map((file) => {
            const result = results.find((r) => r.path === file.path);
            return (
              <li key={file.path} className="rounded-lg bg-raised px-3 py-2">
                <p className="font-mono text-xs break-all text-fg">{file.path}</p>
                <p className="mt-1 font-mono text-xs break-all text-subtle">{file.sha256}</p>
                <p className="mt-1 text-xs text-muted">
                  {formatBytes(file.size)}
                  {result ? ` · ${result.match ? "match" : "mismatch"}` : ""}
                </p>
                {result ? <p className="mt-1 text-xs text-subtle">{result.detail}</p> : null}
                <label className="mt-1 inline-flex min-h-11 cursor-pointer items-center text-xs text-muted hover:text-fg">
                  Hash local file
                  <input
                    type="file"
                    className="sr-only"
                    onChange={(e) => {
                      const blob = e.target.files?.[0];
                      if (blob) void onLocal(file, blob);
                      e.target.value = "";
                    }}
                  />
                </label>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-subtle">
          {loading
            ? "Reading official hashes from Hugging Face…"
            : "No official SHA-256 (LFS) listed for this revision."}
        </p>
      )}

      <div className="mt-3 grid gap-2">
        <Button variant="outline" onClick={() => void onVerify()} disabled={verifying || files.length === 0}>
          {verifying ? "Verifying…" : "Verify"}
        </Button>
        <a
          href={shownRev ? hubTreeUrl(id, shownRev) : hubCardUrl(id)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center text-sm text-muted hover:text-fg"
        >
          Source on Hugging Face
        </a>
      </div>
    </section>
  );
}
