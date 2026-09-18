import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as cn, r as formatBytes, s as shortSha } from "./shell-C_CGWYDo.mjs";
import { _ as inspectForVault, b as verifyRemoteFile, y as probeTrust } from "./router-CSkploew.mjs";
import { t as Button } from "./button-CrCrsTzg.mjs";
import { a as isWeightPath, i as hubTreeUrl, r as hubCardUrl, t as fileSha256 } from "./webseed-CX85z8gt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trust-panel-C8FohSzZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full bg-raised px-2.5 py-1 text-xs font-medium text-muted", className),
		...props
	});
}
/** Permissive OSI-style licenses only. Not Llama, Gemma, OpenRAIL, or NC. */
var CANON = {
	mit: "MIT",
	"mit-0": "MIT-0",
	"apache-2.0": "Apache-2.0",
	"apache 2.0": "Apache-2.0",
	apache2: "Apache-2.0",
	"apache-2": "Apache-2.0",
	"bsd-2-clause": "BSD-2-Clause",
	"bsd-3-clause": "BSD-3-Clause",
	"bsd-3-clause-clear": "BSD-3-Clause-Clear",
	bsd: "BSD-3-Clause",
	isc: "ISC",
	unlicense: "Unlicense",
	"cc0-1.0": "CC0-1.0",
	cc0: "CC0-1.0",
	"0bsd": "0BSD",
	zlib: "Zlib",
	"bsl-1.0": "BSL-1.0",
	"boost-1.0": "BSL-1.0",
	postgresql: "PostgreSQL",
	"python-2.0": "Python-2.0",
	ncsa: "NCSA",
	"osl-3.0": "OSL-3.0",
	"mpl-2.0": "MPL-2.0"
};
var PERMISSIVE_LICENSES = [...new Set(Object.values(CANON))];
function normalizeLicense(raw) {
	if (!raw) return null;
	const first = raw.split(/[,;/]/)[0]?.trim().toLowerCase() ?? "";
	if (!first) return null;
	return CANON[first] ?? null;
}
function isPermissiveLicense(raw) {
	return normalizeLicense(raw) !== null;
}
function licenseFromTags(tags) {
	for (const tag of tags ?? []) {
		const m = /^license:([^\s]+)/i.exec(tag);
		if (m?.[1]) {
			const hit = normalizeLicense(m[1]);
			if (hit) return hit;
		}
	}
	return null;
}
/** Baked denylist. Ids here never enter the vault. */
var TAKEDOWNS = [];
function isTakenDown(id) {
	const hit = TAKEDOWNS.find((row) => row.id.toLowerCase() === id.toLowerCase());
	return hit ? hit.reason : null;
}
function isGated(gated) {
	if (gated == null || gated === false) return false;
	if (gated === true) return true;
	if (typeof gated === "string") return gated.length > 0 && gated !== "false";
	return Object.keys(gated).length > 0;
}
function admitFromHub(input, now = (/* @__PURE__ */ new Date()).toISOString()) {
	const id = input.id.trim();
	if (!id || id.includes("..")) return {
		ok: false,
		reason: "Invalid model id."
	};
	if (input.private) return {
		ok: false,
		reason: "Private models are not eligible."
	};
	if (isGated(input.gated)) return {
		ok: false,
		reason: "Gated models are not eligible."
	};
	const taken = isTakenDown(id);
	if (taken) return {
		ok: false,
		reason: `Taken down: ${taken}`
	};
	const license = normalizeLicense(input.license) ?? licenseFromTags(input.tags);
	if (!license || !isPermissiveLicense(license)) return {
		ok: false,
		reason: "License is missing, gated, custom, or not a clearly permissive OSI license (Apache-2.0, MIT, BSD, ISC, CC0, Unlicense, …)."
	};
	const revision = input.sha?.trim();
	if (!revision) return {
		ok: false,
		reason: "Hub did not return a revision/commit."
	};
	const files = [];
	const missingWeights = [];
	for (const entry of input.tree) {
		if (entry.type && entry.type !== "file") continue;
		const path = entry.path?.trim();
		if (!path) continue;
		const sha256 = fileSha256(entry);
		const size = entry.lfs?.size ?? entry.size ?? 0;
		if (isWeightPath(path)) {
			if (!sha256) {
				missingWeights.push(path);
				continue;
			}
			files.push({
				path,
				size,
				sha256,
				role: "weight"
			});
			continue;
		}
		if (sha256) files.push({
			path,
			size,
			sha256,
			role: "sidecar"
		});
	}
	if (missingWeights.length > 0 && files.filter((f) => f.role === "weight").length === 0) return {
		ok: false,
		reason: "Weight files on the Hub have no official SHA-256 (LFS). Forge will not pin them."
	};
	if (files.length === 0) return {
		ok: false,
		reason: "No file on this revision published an official SHA-256. Nothing to pin."
	};
	return {
		ok: true,
		record: {
			key: `${id}@${revision}`,
			id,
			revision,
			license,
			pipeline: input.pipeline_tag,
			pinnedAt: now,
			files,
			source: "huggingface"
		}
	};
}
var useVault = create()(persist((set, get) => ({
	records: {},
	hidden: [],
	reports: [],
	lastError: null,
	admitting: false,
	hydrated: false,
	setHydrated: () => set({ hydrated: true }),
	pinFromHub: async (raw, revision) => {
		const id = raw.trim();
		if (!id) return null;
		set({
			admitting: true,
			lastError: null
		});
		try {
			const inspect = await inspectForVault({ data: {
				id,
				revision: revision?.trim() || void 0
			} });
			if (inspect.error && inspect.tree.length === 0 && !inspect.sha) {
				set({
					admitting: false,
					lastError: inspect.error
				});
				return null;
			}
			const result = admitFromHub({
				id: inspect.id,
				sha: inspect.sha,
				private: inspect.private,
				gated: inspect.gated,
				pipeline_tag: inspect.pipeline_tag,
				tags: inspect.tags,
				license: inspect.license,
				tree: inspect.tree
			});
			if (!result.ok) {
				set({
					admitting: false,
					lastError: result.reason
				});
				return null;
			}
			if (get().hidden.includes(result.record.id)) {
				set({
					admitting: false,
					lastError: "This model is hidden after a report. Restore it from Reports first."
				});
				return null;
			}
			set((s) => ({
				records: {
					...s.records,
					[result.record.key]: result.record
				},
				admitting: false,
				lastError: null
			}));
			return result.record;
		} catch (err) {
			set({
				admitting: false,
				lastError: err instanceof Error ? err.message : "Vault pin failed"
			});
			return null;
		}
	},
	drop: (key) => set((s) => {
		const records = { ...s.records };
		delete records[key];
		return { records };
	}),
	hide: (id) => set((s) => {
		const records = { ...s.records };
		for (const key of Object.keys(records)) if (records[key]?.id === id) delete records[key];
		return {
			records,
			hidden: s.hidden.includes(id) ? s.hidden : [...s.hidden, id]
		};
	}),
	unhide: (id) => set((s) => ({ hidden: s.hidden.filter((x) => x !== id) })),
	report: ({ modelId, revision, reason, note }) => {
		const row = {
			id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
			modelId,
			revision,
			reason,
			note: note.trim().slice(0, 500),
			at: (/* @__PURE__ */ new Date()).toISOString()
		};
		set((s) => {
			const records = { ...s.records };
			for (const key of Object.keys(records)) if (records[key]?.id === modelId) delete records[key];
			return {
				reports: [row, ...s.reports].slice(0, 80),
				records,
				hidden: s.hidden.includes(modelId) ? s.hidden : [...s.hidden, modelId]
			};
		});
	}
}), {
	name: "forge-vault-v1",
	partialize: (s) => ({
		records: s.records,
		hidden: s.hidden,
		reports: s.reports
	}),
	onRehydrateStorage: () => (state) => {
		state?.setHydrated();
	}
}));
function vaultList(records) {
	return Object.values(records).sort((a, b) => b.pinnedAt.localeCompare(a.pinnedAt));
}
function availabilityOf(card, opts) {
	if (opts.mismatch) return "Hash mismatch";
	if (!card) return opts.localPin ? "Rescued by swarm" : "Web-seed only";
	if (card.hubLive && card.resolveLive) return "Live on HF";
	if (!card.hubLive && opts.localPin) return "Rescued by swarm";
	return "Web-seed only";
}
async function sha256Buffer(buf) {
	const digest = await crypto.subtle.digest("SHA-256", buf);
	return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function TrustPanel({ id, revision, license, localPin, initialFiles }) {
	const [card, setCard] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [verifying, setVerifying] = (0, import_react.useState)(false);
	const [results, setResults] = (0, import_react.useState)([]);
	const [mismatch, setMismatch] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoading(true);
		setResults([]);
		setMismatch(false);
		probeTrust({ data: {
			id,
			revision: revision ?? void 0
		} }).then((next) => {
			if (!cancelled) setCard(next);
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [id, revision]);
	const files = card?.files?.length ? card.files : initialFiles ?? [];
	const shownLicense = card?.license ?? license ?? "—";
	const shownRev = card?.revision ?? revision ?? null;
	const state = availabilityOf(card, {
		localPin,
		mismatch
	});
	async function onVerify() {
		if (!shownRev || files.length === 0) return;
		setVerifying(true);
		const out = [];
		let bad = false;
		for (const file of files.slice(0, 12)) {
			const result = await verifyRemoteFile({ data: {
				id,
				revision: shownRev,
				path: file.path,
				expected: file.sha256,
				size: file.size
			} });
			out.push(result);
			if (!result.match) bad = true;
		}
		setResults(out);
		setMismatch(bad);
		setVerifying(false);
	}
	async function onLocal(fileMeta, blob) {
		const actual = await sha256Buffer(await blob.arrayBuffer());
		const match = actual === fileMeta.sha256;
		const row = {
			path: fileMeta.path,
			expected: fileMeta.sha256,
			actual,
			match,
			source: "local",
			detail: match ? "Local bytes match the official SHA-256." : "Local bytes do not match the official SHA-256."
		};
		setResults((prev) => {
			const next = [...prev.filter((r) => r.path !== fileMeta.path), row];
			setMismatch(next.some((r) => !r.match));
			return next;
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-5 px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.14em] text-muted uppercase",
				children: "Trust"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs leading-relaxed text-subtle",
				children: "Official hashes from Hugging Face. Checksums prove bytes match the Hub, not that a model is safe to run."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-3 grid gap-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-subtle",
							children: "HF repo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "min-w-0 font-mono text-right text-fg break-all",
							children: id
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-subtle",
							children: "Revision"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono text-fg",
							title: shownRev ?? void 0,
							children: shownRev ? shortSha(shownRev) : "—"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-subtle",
							children: "License"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-right text-fg",
							children: shownLicense
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-subtle",
							children: "Availability"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: loading ? "Checking Hub" : state }) })]
					})
				]
			}),
			files.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 grid gap-2",
				children: files.slice(0, 8).map((file) => {
					const result = results.find((r) => r.path === file.path);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg bg-raised px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs break-all text-fg",
								children: file.path
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-xs break-all text-subtle",
								children: file.sha256
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [formatBytes(file.size), result ? ` · ${result.match ? "match" : "mismatch"}` : ""]
							}),
							result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-subtle",
								children: result.detail
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-1 inline-flex min-h-11 cursor-pointer items-center text-xs text-muted hover:text-fg",
								children: ["Hash local file", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									className: "sr-only",
									onChange: (e) => {
										const blob = e.target.files?.[0];
										if (blob) onLocal(file, blob);
										e.target.value = "";
									}
								})]
							})
						]
					}, file.path);
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-subtle",
				children: loading ? "Reading official hashes from Hugging Face…" : "No official SHA-256 (LFS) listed for this revision."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => void onVerify(),
					disabled: verifying || files.length === 0,
					children: verifying ? "Verifying…" : "Verify"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: shownRev ? hubTreeUrl(id, shownRev) : hubCardUrl(id),
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex h-11 items-center justify-center text-sm text-muted hover:text-fg",
					children: "Source on Hugging Face"
				})]
			})
		]
	});
}
//#endregion
export { vaultList as a, useVault as i, PERMISSIVE_LICENSES as n, TrustPanel as r, Badge as t };
