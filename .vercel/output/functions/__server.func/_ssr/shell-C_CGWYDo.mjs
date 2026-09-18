import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-C_CGWYDo.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatCount(n) {
	if (!Number.isFinite(n) || n < 0) return "0";
	if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
	if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
	if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
	return String(n);
}
function formatDate(iso) {
	if (!iso) return "—";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function formatRelative(iso) {
	if (!iso) return "never";
	const t = Date.parse(iso);
	if (Number.isNaN(t)) return "—";
	const s = Math.round((Date.now() - t) / 1e3);
	if (s < 45) return "just now";
	if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
	if (s < 86400) return `${Math.max(1, Math.round(s / 3600))}h ago`;
	if (s < 1209600) return `${Math.max(1, Math.round(s / 86400))}d ago`;
	return formatDate(iso);
}
function shortSha(sha) {
	if (!sha) return "—";
	return sha.slice(0, 7);
}
function formatBytes(n) {
	if (!Number.isFinite(n) || n < 0) return "0 B";
	if (n < 1024) return `${Math.round(n)} B`;
	if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
	if (n < 1073741824) return `${(n / 1048576).toFixed(1)} MB`;
	return `${(n / 1073741824).toFixed(2)} GB`;
}
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: cn("size-5", className),
		fill: "none",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M4 16.5 12 4l8 12.5",
				stroke: "currentColor",
				strokeWidth: "1.6",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M8 16.5h8",
				stroke: "currentColor",
				strokeWidth: "1.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10 20h4",
				stroke: "currentColor",
				strokeWidth: "1.6"
			})
		]
	});
}
var NAV = [
	{
		to: "/huggingface",
		label: "Models"
	},
	{
		to: "/bay",
		label: "Bay"
	},
	{
		to: "/vault",
		label: "Vault"
	},
	{
		to: "/conduit",
		label: "Router"
	},
	{
		to: "/subscribe",
		label: "Subscribe"
	},
	{
		to: "/donate",
		label: "Donate"
	}
];
function Shell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border/80 bg-bg/90 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex min-h-11 items-center gap-2 text-sm font-medium tracking-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Forge" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex items-center gap-1 overflow-x-auto",
						children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							className: "inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-muted transition-colors duration-150 hover:bg-raised hover:text-fg",
							activeProps: { className: "text-fg bg-raised" },
							children: item.label
						}, item.to))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border/80",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs leading-relaxed text-subtle",
						children: [
							"Independent of xAI. Source on",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://github.com/buypeaky-crypto/Forge",
								target: "_blank",
								rel: "noreferrer",
								className: "text-muted hover:text-fg",
								children: "GitHub"
							}),
							"."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/subscribe",
							className: "inline-flex min-h-11 items-center text-xs text-muted hover:text-fg",
							children: "PayPal monthly"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/donate",
							className: "inline-flex min-h-11 items-center text-xs text-muted hover:text-fg",
							children: "Small donation — BTC, ETH, SOL"
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { formatDate as a, formatCount as i, cn as n, formatRelative as o, formatBytes as r, shortSha as s, Shell as t };
