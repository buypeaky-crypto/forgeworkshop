import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as formatDate, i as formatCount, n as cn, t as Shell } from "./shell-C_CGWYDo.mjs";
import { a as Pin, c as Download, o as Heart, r as Search, s as ExternalLink, t as X } from "../_libs/lucide-react.mjs";
import { g as TASKS, h as useBay, i as Route$2, s as ModelCard } from "./router-CSkploew.mjs";
import { t as Button } from "./button-CrCrsTzg.mjs";
import { r as TrustPanel, t as Badge } from "./trust-panel-C8FohSzZ.mjs";
import { t as VaultPinButton } from "./vault-pin-9Mraq9IH.mjs";
import { t as Input } from "./input-RQyjWf9_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/huggingface-9aOmIuIy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function asList(value) {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
}
function ModelDetail({ model, onClose }) {
	const tags = (model.tags ?? []).filter((t) => !t.startsWith("region:")).slice(0, 10);
	const languages = asList(model.cardData?.language).slice(0, 6);
	const params = model.safetensors?.total;
	const pin = useBay((s) => s.pins[model.id]);
	const pinModel = useBay((s) => s.pin);
	const addManual = useBay((s) => s.addManual);
	const unpin = useBay((s) => s.unpin);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex h-full flex-col overflow-y-auto rounded-xl bg-surface shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 p-5 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-sm leading-snug text-fg break-all",
						children: model.id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: [model.pipeline_tag?.replaceAll("-", " ") ?? "untagged", model.library_name ? ` · ${model.library_name}` : ""]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "relative -mr-1 inline-flex size-11 items-center justify-center rounded-lg text-muted hover:bg-raised hover:text-fg",
					"aria-label": "Close model details",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4 px-5 text-sm tabular-nums",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
						className: "size-3.5",
						strokeWidth: 1.75
					}), formatCount(model.downloads ?? 0)]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
						className: "size-3.5",
						strokeWidth: 1.75
					}), formatCount(model.likes ?? 0)]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-5 grid gap-3 px-5 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-subtle",
							children: "Updated"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-fg",
							children: formatDate(model.lastModified)
						})]
					}),
					params ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-subtle",
							children: "Parameters"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "tabular-nums text-fg",
							children: formatCount(params)
						})]
					}) : null,
					model.cardData?.license ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-subtle",
							children: "License"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-fg",
							children: model.cardData.license
						})]
					}) : null,
					languages.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-subtle",
							children: "Languages"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-right text-fg",
							children: languages.join(", ")
						})]
					}) : null
				]
			}),
			tags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-wrap gap-1.5 px-5",
				children: tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: tag }, tag))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustPanel, {
				id: model.id,
				revision: model.sha,
				license: model.cardData?.license
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto grid gap-2 p-5",
				children: [
					pin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => unpin(model.id),
						children: "Unpin from bay"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => {
							pinModel(model.id, "follow");
							addManual(model.id);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-3.5" }), "Pin to bay"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultPinButton, {
						id: model.id,
						revision: model.sha
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `https://huggingface.co/${model.id}`,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-accent-fg transition-colors duration-150 hover:bg-fg",
						children: ["Open on Hugging Face", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
					})
				]
			})
		]
	});
}
function HuggingFacePage() {
	const { q, task, model } = Route$2.useSearch();
	const navigate = Route$2.useNavigate();
	const { models, selected } = Route$2.useLoaderData();
	const [draft, setDraft] = (0, import_react.useState)(q ?? "");
	(0, import_react.useEffect)(() => {
		setDraft(q ?? "");
	}, [q]);
	(0, import_react.useEffect)(() => {
		const next = draft.trim();
		if (next === (q ?? "").trim()) return;
		const t = window.setTimeout(() => {
			navigate({ search: (prev) => ({
				...prev,
				q: next || void 0
			}) });
		}, 280);
		return () => window.clearTimeout(t);
	}, [
		draft,
		q,
		navigate
	]);
	function setTask(next) {
		navigate({ search: (prev) => ({
			...prev,
			task: next || void 0
		}) });
	}
	function openModel(id) {
		navigate({ search: (prev) => ({
			...prev,
			model: id
		}) });
	}
	function closeModel() {
		navigate({ search: (prev) => ({
			...prev,
			model: void 0
		}) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
				children: "Hugging Face"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl tracking-[-0.02em] sm:text-4xl",
				children: "Model catalog"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [models.length, " results"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "relative block max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Search Hugging Face models"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							placeholder: "Search models",
							className: "pl-10"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible",
					children: TASKS.map((item) => {
						const active = (task ?? "") === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTask(item.id),
							className: cn("inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm transition-colors duration-150", active ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg"),
							children: item.label
						}, item.id || "all");
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mt-8 grid gap-4", selected ? "lg:grid-cols-[1fr_20rem]" : ""),
				children: [models.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl bg-surface px-5 py-10 text-center text-sm text-muted shadow-[var(--shadow-border)]",
					children: "No models matched that search. Try a different task or query."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: models.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelCard, {
						model: item,
						selected: item.id === model,
						onSelect: () => openModel(item.id)
					}, item.id))
				}), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelDetail, {
						model: selected,
						onClose: closeModel
					})
				}) : null]
			})
		]
	}) });
}
//#endregion
export { HuggingFacePage as component };
