import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, t as Shell } from "./shell-C_CGWYDo.mjs";
import { u as Check } from "../_libs/lucide-react.mjs";
import { r as Route$1 } from "./router-B2-wW3pW.mjs";
import { t as PLANS } from "./plans-CGAQANW4.mjs";
import { n as usePaypal } from "./store-86dT0MeV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/subscribe-DjxGjY3z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sdkCache = /* @__PURE__ */ new Map();
function loadSdk(clientId, mode) {
	const key = `${mode}:${clientId}`;
	const hit = sdkCache.get(key);
	if (hit) return hit;
	const pending = new Promise((resolve, reject) => {
		const existing = document.querySelector(`script[data-forge-paypal="${key}"]`);
		const onReady = () => {
			const paypal = window.paypal;
			if (paypal) resolve(paypal);
			else reject(/* @__PURE__ */ new Error("PayPal SDK missing"));
		};
		if (existing) {
			if (window.paypal) onReady();
			else existing.addEventListener("load", onReady, { once: true });
			return;
		}
		const script = document.createElement("script");
		script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&vault=true&intent=subscription&currency=USD${mode === "sandbox" ? "&debug=false" : ""}`;
		script.dataset.forgePaypal = key;
		script.async = true;
		script.onload = onReady;
		script.onerror = () => reject(/* @__PURE__ */ new Error("PayPal SDK failed to load"));
		document.head.appendChild(script);
	});
	sdkCache.set(key, pending);
	return pending;
}
function PaypalSubscribeButton({ clientId, mode, planId, planKey }) {
	const host = (0, import_react.useRef)(null);
	const setSubscription = usePaypal((s) => s.setSubscription);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const el = host.current;
		if (!el) return;
		let cancelled = false;
		el.innerHTML = "";
		loadSdk(clientId, mode).then((paypal) => {
			if (cancelled || !host.current) return;
			return paypal.Buttons({
				style: {
					color: "silver",
					shape: "rect",
					label: "subscribe",
					height: 44,
					layout: "vertical"
				},
				createSubscription: (_data, actions) => actions.subscription.create({ plan_id: planId }),
				onApprove: (data) => {
					if (!data.subscriptionID) return;
					setSubscription({
						planKey,
						subscriptionId: data.subscriptionID,
						at: (/* @__PURE__ */ new Date()).toISOString()
					});
				},
				onError: () => setError("PayPal could not complete checkout.")
			}).render(host.current);
		}).catch((err) => {
			if (!cancelled) setError(err instanceof Error ? err.message : "PayPal failed");
		});
		return () => {
			cancelled = true;
		};
	}, [
		clientId,
		mode,
		planId,
		planKey,
		setSubscription
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: host,
		className: "min-h-11"
	}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-xs text-muted",
		children: error
	}) : null] });
}
function PlanGrid({ config }) {
	const subscription = usePaypal((s) => s.subscription);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 lg:grid-cols-3",
		children: PLANS.map((plan) => {
			const planId = config.plans.find((p) => p.key === plan.key)?.planId ?? null;
			const active = subscription?.planKey === plan.key;
			const canCheckout = Boolean(config.clientId && planId);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: cn("flex flex-col rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]", active && "shadow-[var(--shadow-border-hover)]"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
						children: plan.product
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl tracking-[-0.02em]",
						children: plan.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 font-display text-4xl tracking-[-0.03em]",
						children: [
							"$",
							plan.price,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 text-base text-muted",
								children: "/mo"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: plan.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-5 grid gap-2 text-sm text-fg",
						children: plan.features.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-4 shrink-0 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
						}, item))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-auto pt-6",
						children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-fg",
							children: [
								"Active — ",
								subscription?.subscriptionId.slice(0, 12),
								"…"
							]
						}) : canCheckout && config.clientId && planId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaypalSubscribeButton, {
							clientId: config.clientId,
							mode: config.mode,
							planId,
							planKey: plan.key
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-subtle",
							children: "PayPal button arms after the Client ID is connected."
						})
					})
				]
			}, plan.key);
		})
	});
}
function SubscribePage() {
	const config = Route$1.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
				children: "PayPal subscriptions"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl tracking-[-0.03em] sm:text-5xl",
				children: "Monthly plans"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-base leading-relaxed text-muted",
				children: "Recurring support through PayPal Business. Crypto one-time sends stay on Donate. Checkout uses the official PayPal button — no house xAI key, no fake processor."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-sm leading-relaxed text-subtle",
				children: config.message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanGrid, { config })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-10 max-w-2xl text-sm leading-relaxed text-muted",
				children: [
					"Need a Business app first: developer.paypal.com → Apps & Credentials → Create App. A Personal account cannot receive subscriptions. Then send the Client ID and Secret here. One-time support is still",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/donate",
						className: "text-fg hover:text-muted",
						children: "BTC, ETH, or SOL"
					}),
					"."
				]
			})
		]
	}) });
}
//#endregion
export { SubscribePage as component };
