import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { n as PAYPAL_PLAN_IDS, r as PLANS, t as PAYPAL_MODE } from "./plans-DTpS9Q9L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-Dg3BR37K.js
function env(key) {
	return process.env[key]?.trim() || void 0;
}
var tokenCache = null;
var planCache = null;
function paypalBase() {
	return paypalMode() === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}
function paypalMode() {
	if (env("PAYPAL_ENV") === "sandbox") return "sandbox";
	if (env("PAYPAL_ENV") === "live") return "live";
	return PAYPAL_MODE;
}
function credentials() {
	const id = env("PAYPAL_CLIENT_ID") || env("VITE_PAYPAL_CLIENT_ID") || "BAACmrgBU9Y2WQvxLemxUHGup5Il7me80I4BWA1XWcyqW1UAyh4XrxQyG6tC8-L6ChjX6jovyl2b6VBVq4";
	const secret = env("PAYPAL_CLIENT_SECRET");
	if (!id || !secret) return null;
	return {
		id,
		secret
	};
}
async function accessToken() {
	if (tokenCache && tokenCache.exp > Date.now() + 1e4) return tokenCache.token;
	const creds = credentials();
	if (!creds) throw new Error("PayPal credentials missing");
	const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
		method: "POST",
		headers: {
			Authorization: `Basic ${btoa(`${creds.id}:${creds.secret}`)}`,
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: "grant_type=client_credentials"
	});
	if (!res.ok) throw new Error(`PayPal auth ${res.status}`);
	const json = await res.json();
	tokenCache = {
		token: json.access_token,
		exp: Date.now() + json.expires_in * 1e3
	};
	return json.access_token;
}
async function paypalJson(path, init) {
	const token = await accessToken();
	const res = await fetch(`${paypalBase()}${path}`, {
		...init,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			Accept: "application/json",
			...init?.headers ?? {}
		}
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`PayPal ${path} ${res.status}: ${text.slice(0, 240)}`);
	}
	return await res.json();
}
async function findOrCreateProduct(name, description) {
	const hit = (await paypalJson("/v1/catalogs/products?page_size=20&page=1")).products?.find((p) => p.name === name);
	if (hit) return hit.id;
	return (await paypalJson("/v1/catalogs/products", {
		method: "POST",
		body: JSON.stringify({
			name,
			description,
			type: "SERVICE",
			category: "SOFTWARE"
		})
	})).id;
}
async function findOrCreatePlan(input) {
	const hit = (await paypalJson("/v1/billing/plans?page_size=20&page=1")).plans?.find((p) => p.name === input.name && p.status !== "INACTIVE");
	if (hit) return hit.id;
	return (await paypalJson("/v1/billing/plans", {
		method: "POST",
		body: JSON.stringify({
			product_id: input.productId,
			name: input.name,
			description: input.description,
			status: "ACTIVE",
			billing_cycles: [{
				frequency: {
					interval_unit: "MONTH",
					interval_count: 1
				},
				tenure_type: "REGULAR",
				sequence: 1,
				total_cycles: 0,
				pricing_scheme: { fixed_price: {
					value: input.price.toFixed(2),
					currency_code: "USD"
				} }
			}],
			payment_preferences: {
				auto_bill_outstanding: true,
				payment_failure_threshold: 3
			}
		})
	})).id;
}
function envPlanId(key) {
	return {
		vault: env("PAYPAL_PLAN_VAULT") || PAYPAL_PLAN_IDS.vault,
		signals: env("PAYPAL_PLAN_SIGNALS") || PAYPAL_PLAN_IDS.signals,
		sponsor: env("PAYPAL_PLAN_SPONSOR") || PAYPAL_PLAN_IDS.sponsor
	}[key] || null;
}
var paypalConfig_createServerFn_handler = createServerRpc({
	id: "d7d484e44fee0b51d4adf98fb9a771bdfd0279664153f1844458064bc22238a9",
	name: "paypalConfig",
	filename: "src/lib/paypal/server.ts"
}, (opts) => paypalConfig.__executeServer(opts));
var paypalConfig = createServerFn({ method: "GET" }).handler(paypalConfig_createServerFn_handler, async () => {
	const clientId = env("PAYPAL_CLIENT_ID") || env("VITE_PAYPAL_CLIENT_ID") || "BAACmrgBU9Y2WQvxLemxUHGup5Il7me80I4BWA1XWcyqW1UAyh4XrxQyG6tC8-L6ChjX6jovyl2b6VBVq4";
	const mode = paypalMode();
	const baked = PLANS.map((p) => ({
		key: p.key,
		planId: envPlanId(p.key)
	}));
	if (Boolean(clientId && baked.every((p) => p.planId))) {
		planCache = {
			ready: true,
			clientId,
			mode,
			plans: baked,
			message: "PayPal subscriptions are live. Checkout uses the official button."
		};
		return planCache;
	}
	if (!clientId) return {
		ready: false,
		clientId: null,
		mode,
		plans: baked,
		message: "PayPal checkout is wired. Create a Business app at developer.paypal.com, then send the Client ID and Secret here."
	};
	if (!credentials()) return {
		ready: false,
		clientId,
		mode,
		plans: baked,
		message: "Client ID is present. A Secret is still needed to create the three subscription plans."
	};
	if (planCache?.ready && planCache.clientId === clientId) return planCache;
	try {
		const plans = [];
		for (const plan of PLANS) {
			const existing = envPlanId(plan.key);
			if (existing) {
				plans.push({
					key: plan.key,
					planId: existing
				});
				continue;
			}
			const planId = await findOrCreatePlan({
				productId: await findOrCreateProduct(plan.name, plan.description),
				name: plan.name,
				description: plan.description,
				price: plan.price
			});
			plans.push({
				key: plan.key,
				planId
			});
		}
		planCache = {
			ready: plans.every((p) => p.planId),
			clientId,
			mode,
			plans,
			message: "PayPal subscriptions are live."
		};
		return planCache;
	} catch (err) {
		return {
			ready: false,
			clientId,
			mode,
			plans: baked,
			message: err instanceof Error ? err.message : "PayPal plan setup failed"
		};
	}
});
//#endregion
export { paypalConfig_createServerFn_handler };
