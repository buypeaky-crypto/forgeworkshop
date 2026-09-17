import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Shell } from "./shell-C_CGWYDo.mjs";
import { d as ArrowRight, r as Search } from "../_libs/lucide-react.mjs";
import { o as Route$6, s as ModelCard } from "./router-B2-wW3pW.mjs";
import { t as Button } from "./button-CrCrsTzg.mjs";
import { t as Input } from "./input-RQyjWf9_.mjs";
import { t as DonateAsk } from "./donate-C1S6RvfK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BM-eLyJX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const featured = Route$6.useLoaderData();
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
				children: "Hugging Face workshop"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 max-w-3xl font-display text-4xl leading-[1.1] tracking-[-0.03em] text-fg sm:text-5xl",
				children: "Find the right model. Route the prompt."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 max-w-xl text-base leading-relaxed text-muted",
				children: "Forge indexes the public Hugging Face Hub, keeps a scored bay current, and pins permissively licensed revisions in a local vault. No house xAI key."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 grid max-w-xl grid-cols-[minmax(0,1fr)_auto] gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					navigate({
						to: "/huggingface",
						search: { q: q.trim() || void 0 }
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "relative min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Search models"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search models, orgs, tasks",
							className: "h-11 pl-10"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					className: "h-11 shrink-0 sm:px-5",
					children: ["Browse Hub", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/huggingface",
						search: { task: "text-generation" },
						className: "inline-flex min-h-11 items-center rounded-full bg-raised px-4 text-sm text-muted hover:text-fg",
						children: "Text generation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/huggingface",
						search: { task: "text-to-image" },
						className: "inline-flex min-h-11 items-center rounded-full bg-raised px-4 text-sm text-muted hover:text-fg",
						children: "Images"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/huggingface",
						search: { task: "automatic-speech-recognition" },
						className: "inline-flex min-h-11 items-center rounded-full bg-raised px-4 text-sm text-muted hover:text-fg",
						children: "Speech"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/conduit",
						className: "inline-flex min-h-11 items-center rounded-full bg-raised px-4 text-sm text-muted hover:text-fg",
						children: "Open router"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/bay",
						className: "inline-flex min-h-11 items-center rounded-full bg-raised px-4 text-sm text-muted hover:text-fg",
						children: "Open bay"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/vault",
						className: "inline-flex min-h-11 items-center rounded-full bg-raised px-4 text-sm text-muted hover:text-fg",
						children: "Open vault"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/subscribe",
						className: "inline-flex min-h-11 items-center rounded-full bg-raised px-4 text-sm text-muted hover:text-fg",
						children: "Subscribe"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-[-0.02em]",
						children: "Most downloaded"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/huggingface",
						className: "inline-flex min-h-11 items-center text-sm text-muted hover:text-fg",
						children: "All models"
					})]
				}), featured.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 rounded-xl bg-surface px-5 py-10 text-sm text-muted shadow-[var(--shadow-border)]",
					children: "The Hub is unreachable right now. Open Models to retry."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: featured.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelCard, {
						model,
						onSelect: () => void navigate({
							to: "/huggingface",
							search: { model: model.id }
						})
					}, model.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16 rounded-xl bg-surface px-5 py-6 shadow-[var(--shadow-border)] sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
						children: "Model bay"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl tracking-[-0.02em]",
						children: "Auto-triage, with room for exceptions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
						children: "Every twelve hours Forge scouts the Hub, scores downloads, recency, quality, and task fit, then pulls snapshots into this browser. Pin, exclude, or write a domain rule when the automatic shelf is wrong."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/bay",
						className: "mt-4 inline-flex min-h-11 items-center text-sm text-fg hover:text-muted",
						children: ["Open the bay", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 size-4" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-xl bg-surface px-5 py-6 shadow-[var(--shadow-border)] sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
						children: "Vault"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl tracking-[-0.02em]",
						children: "Permanence for open weights"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
						children: "Pin a public Hub revision with a clearly permissive license. Every file keeps the official SHA-256. Fetch from Hugging Face; the torrent bundle is a web-seed fallback. Report is built in."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/vault",
						className: "mt-4 inline-flex min-h-11 items-center text-sm text-fg hover:text-muted",
						children: ["Open the vault", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 size-4" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DonateAsk, {})
			})
		]
	}) });
}
//#endregion
export { Home as component };
