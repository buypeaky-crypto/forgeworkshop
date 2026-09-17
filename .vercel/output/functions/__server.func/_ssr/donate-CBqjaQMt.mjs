import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Shell } from "./shell-C_CGWYDo.mjs";
import { t as DonateAsk } from "./donate-C1S6RvfK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/donate-CBqjaQMt.js
var import_jsx_runtime = require_jsx_runtime();
function DonatePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
				children: "Keep the workshop open"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl tracking-[-0.03em] sm:text-5xl",
				children: "Donate"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-base leading-relaxed text-muted",
				children: [
					"One-time sends on Bitcoin, Ethereum, or Solana. For a monthly subscription (Vault Pro, Signals API, Sponsor) use",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/subscribe",
						className: "text-fg hover:text-muted",
						children: "PayPal plans"
					}),
					". There is no xAI spend."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DonateAsk, {})
			})
		]
	}) });
}
//#endregion
export { DonatePage as component };
