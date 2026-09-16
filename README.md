# Forge

Public Hugging Face workshop. Browse the Hub, keep a local model bay current, route a prompt through Conduit.

Live: [forgeworkshop.grok.me](https://forgeworkshop.grok.me/)

Source: [github.com/buypeaky-crypto/Forge](https://github.com/buypeaky-crypto/Forge)

## What it is

- **Models** — search and filter public Hugging Face models by task.
- **Bay** — a local, scored shelf that scouts the Hub on a schedule, triages by domain, and pulls metadata snapshots. Pins, exclusions, and domain rules keep exceptions.
- **Vault** — permanence pins for public, permissively licensed Hub revisions. Official SHA-256 per file. HF web-seeds first; torrent bundle is fallback. Report + hide from day one.
- **Conduit** — a local keyword router. The prompt never leaves the browser until Forge fetches Hub metadata.
- **Donate** — a small send on BTC, ETH, or SOL keeps the workshop independent.

Forge does **not** call xAI. There is no `XAI_API_KEY` in this app. Hub traffic goes to `huggingface.co/api`. Routing is a static rule table in `src/lib/conduit.ts`.

## Model bay

The bay is a **versioned catalog in this browser** (`localStorage` key `forge-bay-v1`), not a weight store. Snapshots record SHA, file names, license, stats, and score. Copy `huggingface-cli download org/model --revision <sha>` to pull weights on a machine that can hold them.

### Score (0–1)

| Signal | Weight | Notes |
| --- | --- | --- |
| Downloads | 35% | `log1p`, referenced to 5M |
| Likes | 15% | `log1p`, referenced to 8k |
| Recency | 20% | exp decay, 45-day τ on `lastModified` |
| Quality | 15% | safetensors, permissive license, paper tag, likes ≥ 200 |
| Task fit | 15% | pipeline/tags vs assigned domain |

### Cadence and conflicts

Default interval **12 hours** (6 / 24 in Exceptions). Checked on load and every minute while the tab is visible. If the Hub SHA moved: **follow** archives the previous snapshot (keep 3) and adopts the new one; **lock** (a pin policy) holds the current snapshot and stores Hub as pending.

### Exceptions

1. **Exclude** — dropped before scoring.
2. **Domain rule** — keyword / tag / pipeline → shelf; first match wins.
3. **Pin** — always kept; never evicted by quota.

Implementation: `src/lib/bay/` (`score.ts`, `triage.ts`, `sync.ts`, `store.ts`). Policy copy in the app at `/bay?tab=policy`.

## Vault

A **permanence catalog** (`forge-vault-v1`), not a weight host. Hugging Face remains the source of truth.

Admission: public, not gated, card license in a tight permissive OSI allowlist (Apache-2.0, MIT, BSD, ISC, CC0, Unlicense, …). Each stored file must have an official LFS SHA-256 plus the Hub revision. No raw uploads.

Default download is `https://huggingface.co/{id}/resolve/{revision}/{path}` (BEP-19 web-seed). The copied “web-seed bundle” is the torrent fallback (hashes + url-list). It is not a BEP-3 `.torrent`.

Checksums prove Hub bytes. They do not prove a model is safe to run.

Report (malware / license / illegal / other) drops the pin and hides the id. Code: `src/lib/vault/`.

## Donate

- **BTC** `G2dYPPTMorSSoUb68fKYbX55pARzrT1FcoRfjgYQFy9V`
- **ETH** `0x438E7Be244e46D414f097B211cC4fa7549fB3C3b`
- **SOL** `G2dYPPTMorSSoUb68fKYbX55pARzrT1FcoRfjgYQFy9V`

## Run locally

```bash
npm ci
npm run dev
```

`npm run typecheck` is the type gate.

## License

MIT.
