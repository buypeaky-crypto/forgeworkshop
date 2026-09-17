import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn } from "./shell-C_CGWYDo.mjs";
import { l as Copy, u as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/donate-C1S6RvfK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WALLETS = [
	{
		chain: "BTC",
		label: "Bitcoin",
		address: "G2dYPPTMorSSoUb68fKYbX55pARzrT1FcoRfjgYQFy9V"
	},
	{
		chain: "ETH",
		label: "Ethereum",
		address: "0x438E7Be244e46D414f097B211cC4fa7549fB3C3b"
	},
	{
		chain: "SOL",
		label: "Solana",
		address: "G2dYPPTMorSSoUb68fKYbX55pARzrT1FcoRfjgYQFy9V"
	}
];
async function copyText(value) {
	try {
		await navigator.clipboard.writeText(value);
		return true;
	} catch {
		const el = document.createElement("textarea");
		el.value = value;
		el.setAttribute("readonly", "");
		el.style.position = "fixed";
		el.style.left = "-9999px";
		document.body.appendChild(el);
		el.select();
		const ok = document.execCommand("copy");
		document.body.removeChild(el);
		return ok;
	}
}
function WalletRow({ wallet }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function onCopy() {
		if (!await copyText(wallet.address)) return;
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1600);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2 rounded-lg bg-raised px-4 py-3 sm:flex-row sm:items-center sm:gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "w-16 shrink-0 text-xs font-medium tracking-[0.14em] text-muted uppercase",
				children: wallet.chain
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
				className: "min-w-0 flex-1 truncate font-mono text-xs text-fg sm:text-sm",
				children: wallet.address
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => void onCopy(),
				className: cn("inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md px-3 text-sm", copied ? "text-fg" : "text-muted hover:text-fg"),
				"aria-label": `Copy ${wallet.label} address`,
				children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Copied" : "Copy"]
			})
		]
	});
}
function DonateAsk({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("rounded-xl bg-surface shadow-[var(--shadow-border)]", compact ? "px-4 py-4" : "px-5 py-6 sm:px-6"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
				children: "Support"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: cn("mt-2 font-display tracking-[-0.02em]", compact ? "text-xl" : "text-2xl"),
				children: "A small donation keeps Forge independent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
				children: "Forge talks only to the public Hugging Face Hub. It never calls an xAI key. If the workshop is useful, a coffee-sized send on any of these chains is enough."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-2",
				children: WALLETS.map((wallet) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalletRow, { wallet }, wallet.chain))
			})
		]
	});
}
//#endregion
export { DonateAsk as t };
