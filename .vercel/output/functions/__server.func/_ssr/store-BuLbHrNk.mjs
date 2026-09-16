import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as cn } from "./shell-B8c1-bKl.mjs";
import { g as inspectForVault } from "./router-Cjr9X_Y2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-BuLbHrNk.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full bg-raised px-2.5 py-1 text-xs font-medium text-muted", className),
		...props
	});
}
var WEIGHT_RE = /\.(safetensors|bin|gguf|ggml|onnx|pt|pth|ckpt|npz|h5|tflite|pb|ot|msgpack|pkl|pickle)$/i;
function isWeightPath(path) {
	return WEIGHT_RE.test(path);
}
function parseSha256(raw) {
	if (!raw) return null;
	const hex = raw.replace(/^sha256:/i, "").trim().toLowerCase();
	return /^[a-f0-9]{64}$/.test(hex) ? hex : null;
}
function fileSha256(entry) {
	return parseSha256(entry.lfs?.oid);
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
//#endregion
export { vaultList as i, PERMISSIVE_LICENSES as n, useVault as r, Badge as t };
