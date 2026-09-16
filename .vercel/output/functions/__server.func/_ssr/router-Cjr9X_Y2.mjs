import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, b as require_jsx_runtime, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as array, o as string, r as literal, s as union, t as _enum } from "../_libs/zod.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { i as formatCount, n as cn, t as Shell } from "./shell-B8c1-bKl.mjs";
import { c as Download, n as TriangleAlert, o as Heart } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hf-CYGYYgdw.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var TASKS = [
	{
		id: "",
		label: "All"
	},
	{
		id: "text-generation",
		label: "Text gen"
	},
	{
		id: "text-classification",
		label: "Classify"
	},
	{
		id: "summarization",
		label: "Summarize"
	},
	{
		id: "translation",
		label: "Translate"
	},
	{
		id: "question-answering",
		label: "Q&A"
	},
	{
		id: "fill-mask",
		label: "Fill-mask"
	},
	{
		id: "token-classification",
		label: "Tokens"
	},
	{
		id: "feature-extraction",
		label: "Embed"
	},
	{
		id: "text-to-image",
		label: "Images"
	},
	{
		id: "image-classification",
		label: "Vision"
	},
	{
		id: "image-to-text",
		label: "Caption"
	},
	{
		id: "automatic-speech-recognition",
		label: "Speech"
	},
	{
		id: "object-detection",
		label: "Detect"
	}
];
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
var listModels = createServerFn({ method: "GET" }).validator(listInput).handler(createSsrRpc("b7b16b337c020349f55a60a8fbcab2997c4b15cafcdbab9a27d475f1137e5c41"));
var getModel = createServerFn({ method: "GET" }).validator(object({ id: string().min(1).max(200) })).handler(createSsrRpc("c0c6b6c102b91a86ce841360cbe4d9694a3f0568566fe328b1ed559f0bf96fcf"));
var scoutHub = createServerFn({ method: "GET" }).handler(createSsrRpc("9b2c1abdc61878f2c042a020e00be21c6efd8128f87575ebfc1b65dc31670797"));
var pullSnapshots = createServerFn({ method: "POST" }).validator(object({ ids: array(string().min(1).max(200)).max(40) })).handler(createSsrRpc("6c4aac9bc861a8250a4891882ebf6d9c9fc5e6c3aa6425d18ae80b04060485c2"));
var inspectForVault = createServerFn({ method: "GET" }).validator(object({
	id: string().min(1).max(200),
	revision: string().min(1).max(80).optional()
})).handler(createSsrRpc("4c378141475e6f0000ce69d5314f7ec2893bd21e58df1717bc8c1c85e21affb6"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/store-C14ajOjy.js
var DOMAIN_IDS = [
	"language",
	"vision",
	"audio",
	"multimodal",
	"code",
	"science",
	"other"
];
var DEFAULT_SETTINGS = {
	intervalHours: 12,
	keepPerDomain: 5,
	maxModels: 36
};
var DOMAINS = [
	{
		id: "language",
		label: "Language",
		blurb: "Text generation, translation, classify, embed.",
		pipelines: [
			"text-generation",
			"text-classification",
			"summarization",
			"translation",
			"question-answering",
			"fill-mask",
			"token-classification",
			"feature-extraction",
			"sentence-similarity",
			"text2text-generation"
		],
		tags: [
			"nlp",
			"llm",
			"language-model"
		],
		keywords: [
			"bert",
			"gpt",
			"llama",
			"mistral",
			"qwen",
			"phi",
			"gemma",
			"t5"
		]
	},
	{
		id: "vision",
		label: "Vision",
		blurb: "Classify, detect, segment still images.",
		pipelines: [
			"image-classification",
			"object-detection",
			"image-segmentation",
			"depth-estimation",
			"zero-shot-image-classification",
			"mask-generation"
		],
		tags: ["computer-vision", "vision"],
		keywords: [
			"vit",
			"yolo",
			"resnet",
			"clip",
			"sam",
			"detr"
		]
	},
	{
		id: "audio",
		label: "Audio",
		blurb: "Speech, transcription, voice, sound.",
		pipelines: [
			"automatic-speech-recognition",
			"text-to-speech",
			"audio-classification",
			"text-to-audio",
			"voice-activity-detection"
		],
		tags: ["audio", "speech"],
		keywords: [
			"whisper",
			"wav2vec",
			"speecht5",
			"bark",
			"tts"
		]
	},
	{
		id: "multimodal",
		label: "Multimodal",
		blurb: "Image ↔ text, vision-language, generation.",
		pipelines: [
			"text-to-image",
			"image-to-text",
			"image-text-to-text",
			"visual-question-answering",
			"any-to-any",
			"document-question-answering"
		],
		tags: ["multimodal", "vision-language"],
		keywords: [
			"llava",
			"blip",
			"sdxl",
			"stable-diffusion",
			"flux",
			"idefics"
		]
	},
	{
		id: "code",
		label: "Code",
		blurb: "Coders, fill-in, repair, agents that write software.",
		pipelines: [
			"text-generation",
			"text2text-generation",
			"fill-mask"
		],
		tags: ["code", "code-generation"],
		keywords: [
			"coder",
			"code",
			"starcoder",
			"codellama",
			"deepseek-coder",
			"qwen2.5-coder"
		]
	},
	{
		id: "science",
		label: "Science",
		blurb: "Bio, chem, medical, protein, climate.",
		pipelines: [
			"text-generation",
			"token-classification",
			"fill-mask",
			"feature-extraction"
		],
		tags: [
			"biology",
			"chemistry",
			"medical",
			"science",
			"protein",
			"climate"
		],
		keywords: [
			"biomed",
			"chem",
			"protein",
			"esm",
			"mol",
			"clinical",
			"pubmed"
		]
	},
	{
		id: "other",
		label: "Other",
		blurb: "Useful models that do not fit a shelf.",
		pipelines: [],
		tags: [],
		keywords: []
	}
];
function domainMeta(id) {
	return DOMAINS.find((d) => d.id === id) ?? DOMAINS[DOMAINS.length - 1];
}
function haystack(id, tags, pipeline) {
	return `${id} ${(tags ?? []).join(" ")} ${pipeline ?? ""}`.toLowerCase();
}
function matchesRule(model, rule) {
	const needle = rule.match.trim().toLowerCase();
	if (!needle) return false;
	if (rule.kind === "pipeline") return (model.pipeline_tag ?? "").toLowerCase() === needle;
	if (rule.kind === "tag") return (model.tags ?? []).some((t) => t.toLowerCase() === needle);
	return haystack(model.id, model.tags ?? [], model.pipeline_tag).includes(needle);
}
function classifyModel(model, rules) {
	for (const rule of rules) if (matchesRule(model, rule)) return rule.domain;
	const id = model.id.toLowerCase();
	const tags = (model.tags ?? []).map((t) => t.toLowerCase());
	const pipeline = (model.pipeline_tag ?? "").toLowerCase();
	const text = haystack(model.id, model.tags ?? [], model.pipeline_tag);
	const code = DOMAINS.find((d) => d.id === "code");
	if (tags.some((t) => code.tags.includes(t)) || code.keywords.some((k) => text.includes(k))) return "code";
	const science = DOMAINS.find((d) => d.id === "science");
	if (tags.some((t) => science.tags.includes(t)) || science.keywords.some((k) => text.includes(k))) return "science";
	for (const domain of DOMAINS) {
		if (domain.id === "other" || domain.id === "code" || domain.id === "science") continue;
		if (pipeline && domain.pipelines.includes(pipeline)) return domain.id;
		if (tags.some((t) => domain.tags.includes(t))) return domain.id;
	}
	if (id.includes("whisper") || pipeline.includes("speech") || pipeline.includes("audio")) return "audio";
	if (pipeline.includes("image") || pipeline.includes("vision")) return "vision";
	if (pipeline.includes("text")) return "language";
	return "other";
}
function isDomainId(value) {
	return DOMAIN_IDS.includes(value);
}
var DOWNLOAD_REF = 5e6;
var LIKES_REF = 8e3;
var RECENCY_TAU_DAYS = 45;
var PERMISSIVE = /* @__PURE__ */ new Set([
	"mit",
	"apache-2.0",
	"apache-2.0-like",
	"bsd-3-clause",
	"bsd-2-clause",
	"isc",
	"cc-by-4.0",
	"cc0-1.0",
	"unlicense",
	"llama3",
	"llama3.1",
	"llama3.2",
	"llama3.3",
	"gemma",
	"gemma-2",
	"qwen-research",
	"osl-3.0"
]);
function clamp01(n) {
	if (!Number.isFinite(n)) return 0;
	return Math.min(1, Math.max(0, n));
}
function logNorm(n, ref) {
	return clamp01(Math.log1p(Math.max(0, n)) / Math.log1p(ref));
}
function recencyScore(lastModified, now = Date.now()) {
	if (!lastModified) return .25;
	const t = Date.parse(lastModified);
	if (Number.isNaN(t)) return .25;
	const ageDays = Math.max(0, (now - t) / 864e5);
	return clamp01(Math.exp(-ageDays / RECENCY_TAU_DAYS));
}
function qualityScore(model) {
	let q = 0;
	if (model.hasSafetensors) q += .45;
	const license = (model.license ?? "").toLowerCase();
	if (license && PERMISSIVE.has(license)) q += .25;
	if ((model.tags ?? []).map((t) => t.toLowerCase()).some((t) => t.startsWith("arxiv:") || t === "paper" || t === "eval-results")) q += .2;
	if ((model.likes ?? 0) >= 200) q += .1;
	return clamp01(q);
}
function taskFitScore(model, domain) {
	const meta = domainMeta(domain);
	const pipeline = (model.pipeline_tag ?? "").toLowerCase();
	if (pipeline && meta.pipelines.includes(pipeline)) return 1;
	if ((model.tags ?? []).map((t) => t.toLowerCase()).some((t) => meta.tags.includes(t))) return .7;
	if (domain === "other") return .4;
	return .35;
}
function scoreModel(model, domain, now = Date.now()) {
	const downloads = logNorm(model.downloads ?? 0, DOWNLOAD_REF);
	const likes = logNorm(model.likes ?? 0, LIKES_REF);
	const recency = recencyScore(model.lastModified, now);
	const quality = qualityScore(model);
	const taskFit = taskFitScore(model, domain);
	return {
		downloads,
		likes,
		recency,
		quality,
		taskFit,
		total: clamp01(.35 * downloads + .15 * likes + .2 * recency + .15 * quality + .15 * taskFit)
	};
}
function applyExceptions(candidates, exclusions, rules) {
	const banned = new Set(exclusions.map((id) => id.toLowerCase()));
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const model of candidates) {
		const key = model.id.toLowerCase();
		if (!model.id || banned.has(key) || seen.has(key)) continue;
		seen.add(key);
		const domain = classifyModel(model, rules);
		out.push({
			...model,
			domain,
			score: scoreModel(model, domain)
		});
	}
	return out;
}
function pickShelf(scored, pins, settings) {
	const pinIds = Object.keys(pins);
	const byDomain = /* @__PURE__ */ new Map();
	for (const id of DOMAIN_IDS) byDomain.set(id, []);
	for (const item of scored) byDomain.get(item.domain)?.push(item);
	for (const list of byDomain.values()) list.sort((a, b) => b.score.total - a.score.total);
	const kept = /* @__PURE__ */ new Map();
	const scoredById = new Map(scored.map((s) => [s.id, s]));
	for (const id of pinIds) {
		const hit = scoredById.get(id);
		if (hit) kept.set(id, hit);
	}
	for (const domain of DOMAIN_IDS) {
		const list = byDomain.get(domain) ?? [];
		const pinnedHere = list.filter((m) => pins[m.id]).length;
		const cap = domain === "other" ? Math.min(2, settings.keepPerDomain) : settings.keepPerDomain;
		const slots = Math.max(0, cap - pinnedHere);
		const floor = domain === "other" ? .55 : .42;
		let taken = 0;
		for (const item of list) {
			if (kept.has(item.id)) continue;
			if (item.score.total < floor) continue;
			if (taken >= slots) break;
			kept.set(item.id, item);
			taken += 1;
		}
	}
	let selected = [...kept.values()];
	if (selected.length > settings.maxModels) {
		const unpinned = selected.filter((m) => !pins[m.id]).sort((a, b) => a.score.total - b.score.total);
		const overflow = selected.length - settings.maxModels;
		const drop = new Set(unpinned.slice(0, overflow).map((m) => m.id));
		selected = selected.filter((m) => !drop.has(m.id));
	}
	return selected;
}
function nextHistory(model, snapshot) {
	if (!model) return [];
	return [model.snapshot, ...model.history].slice(0, 3);
}
function asRevision(snap, pulledAt) {
	return {
		sha: snap.sha,
		lastModified: snap.lastModified,
		downloads: snap.downloads,
		likes: snap.likes,
		pipeline: snap.pipeline,
		library: snap.library,
		license: snap.license,
		tags: snap.tags,
		files: snap.files,
		params: snap.params,
		pulledAt
	};
}
async function runBaySync(input) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const log = [];
	const candidates = (await scoutHub()).map((m) => ({
		id: m.id,
		pipeline_tag: m.pipeline_tag,
		library_name: m.library_name,
		downloads: m.downloads,
		likes: m.likes,
		tags: m.tags,
		lastModified: m.lastModified,
		sha: m.sha
	}));
	for (const id of Object.keys(input.pins)) if (!candidates.some((c) => c.id === id) && !input.exclusions.includes(id)) candidates.push({ id });
	const selected = pickShelf(applyExceptions(candidates, input.exclusions, input.rules), input.pins, input.settings);
	const snapshots = await pullSnapshots({ data: { ids: selected.map((s) => s.id) } });
	const snapById = new Map(snapshots.map((s) => [s.id, s]));
	const next = {};
	for (const item of selected) {
		const snap = snapById.get(item.id);
		const prev = input.models[item.id];
		const pin = input.pins[item.id];
		const origin = pin ? prev?.origin === "manual" ? "manual" : "pin" : "auto";
		if (!snap || snap.error) {
			if (prev) next[item.id] = {
				...prev,
				status: "error",
				error: snap?.error ?? "Pull failed"
			};
			log.push({
				at: now,
				action: "error",
				id: item.id,
				detail: snap?.error ?? "Hub pull failed"
			});
			continue;
		}
		const revision = asRevision(snap, now);
		const score = scoreModel({
			downloads: snap.downloads,
			likes: snap.likes,
			lastModified: snap.lastModified ?? void 0,
			pipeline_tag: snap.pipeline,
			tags: snap.tags,
			license: snap.license,
			hasSafetensors: snap.hasSafetensors
		}, item.domain);
		if (!prev) {
			next[item.id] = {
				id: item.id,
				domain: item.domain,
				origin,
				score,
				snapshot: revision,
				history: [],
				status: pin?.policy === "lock" ? "locked" : "current"
			};
			log.push({
				at: now,
				action: pin ? "pinned" : "added",
				id: item.id,
				detail: `Shelved in ${item.domain} · score ${score.total.toFixed(2)}`
			});
			continue;
		}
		const shaChanged = Boolean(snap.sha && prev.snapshot.sha && snap.sha !== prev.snapshot.sha);
		const locked = pin?.policy === "lock";
		if (shaChanged && locked) {
			next[item.id] = {
				...prev,
				domain: item.domain,
				origin,
				score,
				status: "locked",
				pending: revision
			};
			log.push({
				at: now,
				action: "locked",
				id: item.id,
				detail: `Hub moved to ${(snap.sha ?? "").slice(0, 7)}; pin holds ${(prev.snapshot.sha ?? "").slice(0, 7)}`
			});
			continue;
		}
		if (shaChanged) {
			next[item.id] = {
				id: item.id,
				domain: item.domain,
				origin,
				score,
				snapshot: revision,
				history: nextHistory(prev, revision),
				status: "updated"
			};
			log.push({
				at: now,
				action: "updated",
				id: item.id,
				detail: `${(prev.snapshot.sha ?? "—").slice(0, 7)} → ${(snap.sha ?? "—").slice(0, 7)}`
			});
			continue;
		}
		next[item.id] = {
			...prev,
			domain: item.domain,
			origin,
			score,
			snapshot: {
				...prev.snapshot,
				downloads: snap.downloads,
				likes: snap.likes,
				pulledAt: now
			},
			status: locked ? "locked" : "current",
			pending: void 0,
			error: void 0
		};
		log.push({
			at: now,
			action: "kept",
			id: item.id,
			detail: `Unchanged ${(snap.sha ?? prev.snapshot.sha ?? "—").slice(0, 7)}`
		});
	}
	for (const id of Object.keys(input.models)) {
		if (next[id]) continue;
		if (input.pins[id]) {
			next[id] = {
				...input.models[id],
				status: "stale"
			};
			continue;
		}
		log.push({
			at: now,
			action: "dropped",
			id,
			detail: "Below domain quota after rescore"
		});
	}
	return {
		models: next,
		log
	};
}
function cliPull(id, sha) {
	return sha ? `huggingface-cli download ${id} --revision ${sha}` : `huggingface-cli download ${id}`;
}
var inflight = null;
function trimLog(log) {
	return log.slice(0, 60);
}
var useBay = create()(persist((set, get) => ({
	settings: DEFAULT_SETTINGS,
	pins: {},
	exclusions: [],
	rules: [],
	models: {},
	lastSyncAt: null,
	lastSyncError: null,
	log: [],
	syncing: false,
	hydrated: false,
	setHydrated: () => set({ hydrated: true }),
	setSettings: (patch) => set((s) => ({ settings: {
		...s.settings,
		...patch,
		keepPerDomain: Math.min(12, Math.max(2, patch.keepPerDomain ?? s.settings.keepPerDomain)),
		maxModels: Math.min(60, Math.max(8, patch.maxModels ?? s.settings.maxModels))
	} })),
	pin: (id, policy = "follow") => {
		const clean = id.trim();
		if (!clean) return;
		set((s) => ({
			pins: {
				...s.pins,
				[clean]: {
					policy,
					addedAt: (/* @__PURE__ */ new Date()).toISOString()
				}
			},
			exclusions: s.exclusions.filter((x) => x !== clean)
		}));
	},
	unpin: (id) => set((s) => {
		const pins = { ...s.pins };
		delete pins[id];
		return { pins };
	}),
	setPinPolicy: (id, policy) => set((s) => {
		const cur = s.pins[id];
		if (!cur) return s;
		return { pins: {
			...s.pins,
			[id]: {
				...cur,
				policy
			}
		} };
	}),
	exclude: (id) => {
		const clean = id.trim();
		if (!clean) return;
		set((s) => {
			const pins = { ...s.pins };
			delete pins[clean];
			const models = { ...s.models };
			delete models[clean];
			return {
				exclusions: s.exclusions.includes(clean) ? s.exclusions : [...s.exclusions, clean],
				pins,
				models
			};
		});
	},
	unexclude: (id) => set((s) => ({ exclusions: s.exclusions.filter((x) => x !== id) })),
	addRule: (rule) => {
		const match = rule.match.trim();
		if (!match || !isDomainId(rule.domain)) return;
		set((s) => ({ rules: [...s.rules, {
			...rule,
			id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
			match
		}] }));
	},
	removeRule: (id) => set((s) => ({ rules: s.rules.filter((r) => r.id !== id) })),
	addManual: async (raw) => {
		const id = raw.trim();
		if (!id) return;
		get().pin(id, "follow");
		set((s) => {
			const existing = s.models[id];
			if (existing) return { models: {
				...s.models,
				[id]: {
					...existing,
					origin: "manual"
				}
			} };
			return s;
		});
		await get().sync();
	},
	adoptPending: (id) => set((s) => {
		const model = s.models[id];
		if (!model?.pending) return s;
		return { models: {
			...s.models,
			[id]: {
				...model,
				snapshot: model.pending,
				history: [model.snapshot, ...model.history].slice(0, 3),
				pending: void 0,
				status: s.pins[id]?.policy === "lock" ? "locked" : "updated"
			}
		} };
	}),
	sync: async () => {
		if (inflight) return inflight;
		inflight = (async () => {
			set({
				syncing: true,
				lastSyncError: null
			});
			try {
				const s = get();
				const result = await runBaySync({
					exclusions: s.exclusions,
					rules: s.rules,
					pins: Object.fromEntries(Object.entries(s.pins).map(([id, pin]) => [id, { policy: pin.policy }])),
					settings: s.settings,
					models: s.models
				});
				set((prev) => ({
					models: result.models,
					log: trimLog([...result.log, ...prev.log]),
					lastSyncAt: (/* @__PURE__ */ new Date()).toISOString(),
					lastSyncError: null,
					syncing: false
				}));
			} catch (err) {
				set({
					syncing: false,
					lastSyncError: err instanceof Error ? err.message : "Sync failed"
				});
			}
		})().finally(() => {
			inflight = null;
		});
		return inflight;
	}
}), {
	name: "forge-bay-v1",
	partialize: (s) => ({
		settings: s.settings,
		pins: s.pins,
		exclusions: s.exclusions,
		rules: s.rules,
		models: s.models,
		lastSyncAt: s.lastSyncAt,
		log: s.log.slice(0, 40)
	}),
	onRehydrateStorage: () => (state) => {
		state?.setHydrated();
	}
}));
function bayList(models, domain) {
	const list = Object.values(models);
	return (!domain || domain === "all" ? list : list.filter((m) => m.domain === domain)).sort((a, b) => b.score.total - a.score.total);
}
function domainCounts(models) {
	const counts = Object.fromEntries(DOMAIN_IDS.map((id) => [id, 0]));
	for (const m of Object.values(models)) counts[m.domain] += 1;
	return counts;
}
function isSyncDue(lastSyncAt, intervalHours, now = Date.now()) {
	if (!lastSyncAt) return true;
	const t = Date.parse(lastSyncAt);
	if (Number.isNaN(t)) return true;
	return now - t >= intervalHours * 36e5;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/model-card-DpMM89Jl.js
var import_jsx_runtime = require_jsx_runtime();
function taskTone(task) {
	if (!task) return "bg-raised text-muted";
	if (task.includes("image") || task.includes("vision") || task.includes("object")) return "bg-raised text-fg";
	if (task.includes("speech") || task.includes("audio")) return "bg-raised text-muted";
	return "bg-raised text-muted";
}
function ModelCard({ model, selected, onSelect }) {
	const [org, name] = model.id.includes("/") ? model.id.split("/") : ["", model.id];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onSelect,
		className: cn("flex w-full flex-col items-start rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[var(--shadow-border-hover)]", selected && "shadow-[var(--shadow-border-hover)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-xs font-medium", taskTone(model.pipeline_tag)),
				"aria-hidden": "true",
				children: (name ?? model.id).slice(0, 2).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-sm leading-snug text-fg",
				children: org ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-subtle",
					children: [org, "/"]
				}), name] }) : model.id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1.5 line-clamp-1 text-xs text-muted",
				children: [model.pipeline_tag?.replaceAll("-", " ") ?? "untagged", model.library_name ? ` · ${model.library_name}` : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-3 text-xs tabular-nums text-subtle",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
						className: "size-3.5",
						strokeWidth: 1.75
					}), formatCount(model.downloads ?? 0)]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
						className: "size-3.5",
						strokeWidth: 1.75
					}), formatCount(model.likes ?? 0)]
				})]
			})
		]
	});
}
function ModelCardSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-3 size-10 animate-pulse rounded-lg bg-raised" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-3/4 animate-pulse rounded bg-raised" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-3 w-1/2 animate-pulse rounded bg-raised" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-3 w-1/3 animate-pulse rounded bg-raised" })
		]
	});
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-Cjr9X_Y2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function BayScheduler() {
	const hydrated = useBay((s) => s.hydrated);
	const lastSyncAt = useBay((s) => s.lastSyncAt);
	const intervalHours = useBay((s) => s.settings.intervalHours);
	const syncing = useBay((s) => s.syncing);
	const sync = useBay((s) => s.sync);
	(0, import_react.useEffect)(() => {
		const finish = () => {
			if (!useBay.getState().hydrated) useBay.getState().setHydrated();
		};
		const unsub = useBay.persist.onFinishHydration(finish);
		if (useBay.persist.hasHydrated()) finish();
		return unsub;
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated || syncing) return;
		if (isSyncDue(lastSyncAt, intervalHours)) sync();
	}, [
		hydrated,
		lastSyncAt,
		intervalHours,
		syncing,
		sync
	]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		const tick = () => {
			if (document.visibilityState !== "visible") return;
			const s = useBay.getState();
			if (s.syncing) return;
			if (isSyncDue(s.lastSyncAt, s.settings.intervalHours)) s.sync();
		};
		const id = window.setInterval(tick, 6e4);
		document.addEventListener("visibilitychange", tick);
		return () => {
			window.clearInterval(id);
			document.removeEventListener("visibilitychange", tick);
		};
	}, [hydrated]);
	return null;
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-US2aY4X3.css";
var APP_NAME = "Forge";
var Route$6 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Forge pins public Hugging Face models into a local bay and vault. Independent of xAI."
			},
			{
				name: "theme-color",
				content: "#0a0a0b"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark antialiased",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-dvh bg-bg font-sans text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BayScheduler, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$5 = () => import("./routes-BcvuG8UP.mjs");
var Route$5 = createFileRoute("/")({
	loader: async () => {
		try {
			return await listModels({ data: {
				sort: "downloads",
				limit: 6
			} });
		} catch {
			return [];
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./bay-CBEC1FOV.mjs");
var Route$4 = createFileRoute("/bay")({
	validateSearch: (search) => ({
		tab: search.tab === "exceptions" || search.tab === "policy" ? search.tab : "shelf",
		domain: typeof search.domain === "string" && (search.domain === "all" || DOMAINS.some((d) => d.id === search.domain)) ? search.domain : "all",
		model: typeof search.model === "string" ? search.model : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./conduit-OS_R4ENr.mjs");
var Route$3 = createFileRoute("/conduit")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./donate-CE7F7288.mjs");
var Route$2 = createFileRoute("/donate")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./huggingface-NdN4Ew7X.mjs");
var Route$1 = createFileRoute("/huggingface")({
	validateSearch: (search) => ({
		q: typeof search.q === "string" ? search.q : void 0,
		task: typeof search.task === "string" ? search.task : void 0,
		model: typeof search.model === "string" ? search.model : void 0
	}),
	loaderDeps: ({ search }) => ({
		q: search.q,
		task: search.task,
		model: search.model
	}),
	loader: async ({ deps }) => {
		let models = [];
		try {
			models = await listModels({ data: {
				q: deps.q,
				task: deps.task,
				sort: "downloads",
				limit: 24
			} });
		} catch {
			models = [];
		}
		let selected = null;
		if (deps.model) try {
			selected = await getModel({ data: { id: deps.model } });
		} catch {
			selected = null;
		}
		return {
			models,
			selected
		};
	},
	pendingComponent: HuggingFacePending,
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
function HuggingFacePending() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-48 animate-pulse rounded bg-raised" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: Array.from({ length: 6 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelCardSkeleton, {}, i))
		})]
	}) });
}
var $$splitComponentImporter = () => import("./vault-Beq6IMvT.mjs");
var Route = createFileRoute("/vault")({
	validateSearch: (search) => ({
		tab: search.tab === "policy" || search.tab === "reports" ? search.tab : "catalog",
		record: typeof search.record === "string" ? search.record : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$5.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	BayRoute: Route$4.update({
		id: "/bay",
		path: "/bay",
		getParentRoute: () => Route$6
	}),
	ConduitRoute: Route$3.update({
		id: "/conduit",
		path: "/conduit",
		getParentRoute: () => Route$6
	}),
	DonateRoute: Route$2.update({
		id: "/donate",
		path: "/donate",
		getParentRoute: () => Route$6
	}),
	HuggingfaceRoute: Route$1.update({
		id: "/huggingface",
		path: "/huggingface",
		getParentRoute: () => Route$6
	}),
	VaultRoute: Route.update({
		id: "/vault",
		path: "/vault",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { listModels as _, Route$5 as a, bayList as c, domainMeta as d, isDomainId as f, inspectForVault as g, TASKS as h, Route$4 as i, cliPull as l, useBay as m, Route as n, ModelCard as o, isSyncDue as p, Route$1 as r, DOMAINS as s, router_exports as t, domainCounts as u };
