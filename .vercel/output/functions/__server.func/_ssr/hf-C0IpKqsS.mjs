import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hf-C0IpKqsS.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var listInput = object({
	q: string().optional(),
	task: string().optional(),
	sort: _enum([
		"downloads",
		"likes",
		"lastModified"
	]).optional(),
	limit: number().int().min(1).max(48).optional()
});
async function hubFetch(path) {
	const res = await fetch(`https://huggingface.co/api/${path}`, { headers: {
		Accept: "application/json",
		"User-Agent": "Forge/1.1 (Hugging Face model workshop)"
	} });
	if (!res.ok) throw new Error(`Hugging Face Hub returned ${res.status}`);
	return await res.json();
}
function normalizeId(id) {
	const clean = id.replace(/^\/+|\/+$/g, "");
	if (!clean || clean.includes("..") || clean.startsWith("http")) throw new Error("Invalid model id");
	return clean;
}
function gatedFlag(value) {
	if (value == null || value === false) return null;
	if (value === true) return true;
	if (typeof value === "string") return value === "false" ? null : value;
	return true;
}
function asDetail(model) {
	return {
		...model,
		gated: gatedFlag(model.gated)
	};
}
async function listHub(opts) {
	const params = new URLSearchParams();
	const q = opts.q?.trim();
	if (q) params.set("search", q);
	if (opts.task) params.set("pipeline_tag", opts.task);
	params.set("sort", opts.sort ?? "downloads");
	params.set("direction", "-1");
	params.set("limit", String(opts.limit));
	params.set("config", "0");
	try {
		return await hubFetch(`models?${params.toString()}`);
	} catch {
		return [];
	}
}
var listModels_createServerFn_handler = createServerRpc({
	id: "b7b16b337c020349f55a60a8fbcab2997c4b15cafcdbab9a27d475f1137e5c41",
	name: "listModels",
	filename: "src/lib/hf.ts"
}, (opts) => listModels.__executeServer(opts));
var listModels = createServerFn({ method: "GET" }).validator(listInput).handler(listModels_createServerFn_handler, async ({ data }) => {
	return listHub({
		q: data.q,
		task: data.task,
		sort: data.sort,
		limit: data.limit ?? 24
	});
});
var getModel_createServerFn_handler = createServerRpc({
	id: "c0c6b6c102b91a86ce841360cbe4d9694a3f0568566fe328b1ed559f0bf96fcf",
	name: "getModel",
	filename: "src/lib/hf.ts"
}, (opts) => getModel.__executeServer(opts));
var getModel = createServerFn({ method: "GET" }).validator(object({ id: string().min(1).max(200) })).handler(getModel_createServerFn_handler, async ({ data }) => {
	return asDetail(await hubFetch(`models/${normalizeId(data.id)}`));
});
var SCOUTS = [
	{
		task: "text-generation",
		limit: 16
	},
	{
		task: "image-classification",
		limit: 12
	},
	{
		task: "automatic-speech-recognition",
		limit: 12
	},
	{
		task: "text-to-image",
		limit: 12
	},
	{
		q: "code",
		task: "text-generation",
		limit: 12
	},
	{
		q: "biology",
		limit: 12
	},
	{
		q: "medical",
		limit: 12
	},
	{
		sort: "lastModified",
		limit: 16
	}
];
var scoutHub_createServerFn_handler = createServerRpc({
	id: "9b2c1abdc61878f2c042a020e00be21c6efd8128f87575ebfc1b65dc31670797",
	name: "scoutHub",
	filename: "src/lib/hf.ts"
}, (opts) => scoutHub.__executeServer(opts));
var scoutHub = createServerFn({ method: "GET" }).handler(scoutHub_createServerFn_handler, async () => {
	const batches = await Promise.all(SCOUTS.map((s) => listHub({
		q: "q" in s ? s.q : void 0,
		task: "task" in s ? s.task : void 0,
		sort: "sort" in s ? s.sort : "downloads",
		limit: s.limit
	})));
	const seen = /* @__PURE__ */ new Set();
	const merged = [];
	for (const batch of batches) for (const model of batch) {
		if (!model.id || seen.has(model.id)) continue;
		seen.add(model.id);
		merged.push(model);
	}
	return merged;
});
function toSnapshot(model) {
	const files = (model.siblings ?? []).map((s) => s.rfilename).slice(0, 40);
	const hasSafetensors = Boolean(model.safetensors?.total) || files.some((f) => f.endsWith(".safetensors"));
	return {
		id: model.id,
		sha: model.sha ?? null,
		lastModified: model.lastModified ?? null,
		downloads: model.downloads ?? 0,
		likes: model.likes ?? 0,
		pipeline: model.pipeline_tag,
		library: model.library_name,
		license: model.cardData?.license,
		tags: model.tags ?? [],
		files,
		params: model.safetensors?.total,
		hasSafetensors
	};
}
async function mapPool(items, n, fn) {
	const out = new Array(items.length);
	let i = 0;
	async function worker() {
		while (i < items.length) {
			const idx = i;
			i += 1;
			out[idx] = await fn(items[idx]);
		}
	}
	const workers = Array.from({ length: Math.min(n, Math.max(1, items.length)) }, () => worker());
	await Promise.all(workers);
	return out;
}
var pullSnapshots_createServerFn_handler = createServerRpc({
	id: "6c4aac9bc861a8250a4891882ebf6d9c9fc5e6c3aa6425d18ae80b04060485c2",
	name: "pullSnapshots",
	filename: "src/lib/hf.ts"
}, (opts) => pullSnapshots.__executeServer(opts));
var pullSnapshots = createServerFn({ method: "POST" }).validator(object({ ids: array(string().min(1).max(200)).max(40) })).handler(pullSnapshots_createServerFn_handler, async ({ data }) => {
	return mapPool([...new Set(data.ids.map((id) => id.trim()).filter(Boolean))].slice(0, 40), 6, async (id) => {
		try {
			return toSnapshot(await hubFetch(`models/${normalizeId(id)}`));
		} catch (err) {
			return {
				id,
				sha: null,
				lastModified: null,
				downloads: 0,
				likes: 0,
				tags: [],
				files: [],
				hasSafetensors: false,
				error: err instanceof Error ? err.message : "Pull failed"
			};
		}
	});
});
async function fetchTree(id, revision) {
	const params = new URLSearchParams({ recursive: "1" });
	try {
		const tree = await hubFetch(`models/${id}/tree/${encodeURIComponent(revision)}?${params.toString()}`);
		if (!Array.isArray(tree)) return [];
		return tree.filter((e) => e && e.type !== "directory").slice(0, 200);
	} catch {
		return [];
	}
}
var inspectForVault_createServerFn_handler = createServerRpc({
	id: "4c378141475e6f0000ce69d5314f7ec2893bd21e58df1717bc8c1c85e21affb6",
	name: "inspectForVault",
	filename: "src/lib/hf.ts"
}, (opts) => inspectForVault.__executeServer(opts));
var inspectForVault = createServerFn({ method: "GET" }).validator(object({
	id: string().min(1).max(200),
	revision: string().min(1).max(80).optional()
})).handler(inspectForVault_createServerFn_handler, async ({ data }) => {
	const id = normalizeId(data.id);
	try {
		const model = asDetail(await hubFetch(`models/${id}`));
		if (model.private) return {
			id,
			sha: null,
			private: true,
			gated: model.gated,
			tree: [],
			error: "Private models are not eligible."
		};
		const revision = data.revision?.trim() || model.sha || "main";
		const tree = await fetchTree(id, revision);
		return {
			id: model.id ?? id,
			sha: model.sha ?? revision,
			private: model.private,
			gated: model.gated,
			pipeline_tag: model.pipeline_tag,
			tags: model.tags,
			license: model.cardData?.license ?? null,
			tree
		};
	} catch (err) {
		return {
			id,
			sha: null,
			tree: [],
			error: err instanceof Error ? err.message : "Hub inspect failed"
		};
	}
});
//#endregion
export { getModel_createServerFn_handler, inspectForVault_createServerFn_handler, listModels_createServerFn_handler, pullSnapshots_createServerFn_handler, scoutHub_createServerFn_handler };
