import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Shell } from "./shell-C_CGWYDo.mjs";
import { d as ArrowRight } from "../_libs/lucide-react.mjs";
import { s as ModelCard, v as listModels } from "./router-B2-wW3pW.mjs";
import { t as Button } from "./button-CrCrsTzg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conduit-CRX1DReP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RULES = [
	{
		task: "automatic-speech-recognition",
		label: "Speech recognition",
		keywords: [
			"transcribe",
			"transcript",
			"speech",
			"audio",
			"whisper",
			"voice",
			"podcast"
		],
		reason: "The prompt mentions audio or transcription."
	},
	{
		task: "text-to-image",
		label: "Image generation",
		keywords: [
			"image",
			"picture",
			"photo",
			"illustration",
			"draw",
			"render",
			"painting",
			"logo"
		],
		reason: "The prompt asks for a picture or visual."
	},
	{
		task: "image-classification",
		label: "Vision",
		keywords: [
			"classify this image",
			"what is in this photo",
			"detect object"
		],
		reason: "The prompt is a vision / image-understanding request."
	},
	{
		task: "translation",
		label: "Translation",
		keywords: [
			"translate",
			"french",
			"spanish",
			"german",
			"japanese",
			"chinese",
			"into english"
		],
		reason: "The prompt is a translation request."
	},
	{
		task: "summarization",
		label: "Summarization",
		keywords: [
			"summarize",
			"summary",
			"tldr",
			"tl;dr",
			"condense",
			"key points"
		],
		reason: "The prompt asks to compress or recap text."
	},
	{
		task: "question-answering",
		label: "Question answering",
		keywords: [
			"who is",
			"what is",
			"when did",
			"where is",
			"why did",
			"how many"
		],
		reason: "The prompt is phrased as a factual question."
	},
	{
		task: "text-classification",
		label: "Classification",
		keywords: [
			"sentiment",
			"classify",
			"label this",
			"toxic",
			"positive or negative"
		],
		reason: "The prompt asks to label or score text."
	},
	{
		task: "token-classification",
		label: "Token classification",
		keywords: [
			"ner",
			"named entity",
			"extract entities",
			"person location org"
		],
		reason: "The prompt wants span-level entity tags."
	},
	{
		task: "fill-mask",
		label: "Fill-mask",
		keywords: [
			"[mask]",
			"<mask>",
			"fill in the blank"
		],
		reason: "The prompt is a cloze / masked-language task."
	},
	{
		task: "feature-extraction",
		label: "Embeddings",
		keywords: [
			"embed",
			"embedding",
			"vector",
			"similarity",
			"semantic search"
		],
		reason: "The prompt asks for representations, not generation."
	},
	{
		task: "text-generation",
		label: "Text generation",
		keywords: [
			"write",
			"story",
			"code",
			"chat",
			"explain",
			"draft",
			"poem",
			"email"
		],
		reason: "The prompt is a generation / writing request."
	}
];
function routePrompt(prompt) {
	const text = prompt.trim().toLowerCase();
	if (!text) return {
		task: "text-generation",
		label: "Text generation",
		reason: "Empty prompt — defaulting to general text generation."
	};
	for (const rule of RULES) if (rule.keywords.some((kw) => text.includes(kw))) return {
		task: rule.task,
		label: rule.label,
		reason: rule.reason
	};
	return {
		task: "text-generation",
		label: "Text generation",
		reason: "No specialized signal — routing to general text models."
	};
}
var EXAMPLES = [
	"Summarize this earnings call for a busy exec",
	"Translate the following paragraph into French",
	"Transcribe a 20-minute product podcast",
	"Write a TypeScript debounce helper with tests"
];
function ConduitPage() {
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [decision, setDecision] = (0, import_react.useState)(null);
	const [models, setModels] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const navigate = useNavigate();
	async function run(nextPrompt) {
		const text = nextPrompt.trim();
		if (!text) return;
		const routed = routePrompt(text);
		setDecision(routed);
		setBusy(true);
		setError(null);
		try {
			const results = await listModels({ data: {
				task: routed.task,
				sort: "downloads",
				limit: 6
			} });
			setModels(results);
		} catch (err) {
			setModels([]);
			setError(err instanceof Error ? err.message : "Routing failed.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
				children: "Conduit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl tracking-[-0.02em] sm:text-4xl",
				children: "Prompt router"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
				children: "Conduit inspects the prompt locally, picks a Hugging Face pipeline, then loads the most-downloaded models for that task. No xAI call."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 max-w-2xl",
				onSubmit: (e) => {
					e.preventDefault();
					run(prompt);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "conduit-prompt",
						className: "text-sm text-muted",
						children: "Prompt"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "conduit-prompt",
						value: prompt,
						onChange: (e) => setPrompt(e.target.value),
						rows: 5,
						placeholder: "Describe the job you need a model for",
						className: "mt-2 w-full resize-y rounded-xl bg-surface px-4 py-3 text-sm leading-relaxed text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus-visible:shadow-[var(--shadow-border-hover)]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: EXAMPLES.map((example) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setPrompt(example);
								run(example);
							},
							className: "inline-flex min-h-11 items-center rounded-full bg-raised px-3.5 text-left text-xs text-muted hover:text-fg sm:text-sm",
							children: example
						}, example))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						className: "mt-4",
						disabled: busy || !prompt.trim(),
						children: [busy ? "Routing…" : "Route prompt", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				]
			}),
			decision ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-surface px-5 py-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-[0.16em] text-muted uppercase",
								children: "Decision"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-2xl tracking-[-0.02em]",
								children: decision.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-xs text-subtle",
								children: decision.task
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted",
								children: decision.reason
							})
						]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm text-muted",
						children: error
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: models.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelCard, {
							model: item,
							onSelect: () => void navigate({
								to: "/huggingface",
								search: {
									model: item.id,
									task: decision.task
								}
							})
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/huggingface",
						search: { task: decision.task },
						className: "mt-6 inline-flex min-h-11 items-center text-sm text-muted hover:text-fg",
						children: "Browse this pipeline on Hugging Face"
					})
				]
			}) : null
		]
	}) });
}
//#endregion
export { ConduitPage as component };
