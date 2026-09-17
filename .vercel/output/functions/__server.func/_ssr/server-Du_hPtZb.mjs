import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { t as PLANS } from "./plans-CGAQANW4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-Du_hPtZb.js
function env(key) {
	return process.env[key]?.trim() || void 0;
}
var tokenCache = null;
var planCache = null;
function paypalBase() {
	return (env("PAYPAL_ENV") === "live" ? "live" : "sandbox") === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}
function credentials() {
	const id = env("PAYPAL_CLIENT_ID") || env("VITE_PAYPAL_CLIENT_ID");
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
		vault: env("PAYPAL_PLAN_VAULT"),
		signals: env("PAYPAL_PLAN_SIGNALS"),
		sponsor: env("PAYPAL_PLAN_SPONSOR")
	}[key] || null;
}
var paypalConfig_createServerFn_handler = createServerRpc({
	id: "d7d484e44fee0b51d4adf98fb9a771bdfd0279664153f1844458064bc22238a9",
	name: "paypalConfig",
	filename: "src/lib/paypal/server.ts"
}, (opts) => paypalConfig.__executeServer(opts));
var paypalConfig = createServerFn({ method: "GET" }).handler(paypalConfig_createServerFn_handler, async () => {
	const clientId = env("PAYPAL_CLIENT_ID") || env("VITE_PAYPAL_CLIENT_ID") || null;
	const mode = env("PAYPAL_ENV") === "live" ? "live" : "sandbox";
	const fromEnv = PLANS.map((p) => ({
		key: p.key,
		planId: envPlanId(p.key)
	}));
	if (!clientId) return {
		ready: false,
		clientId: null,
		mode,
		plans: fromEnv,
		message: "PayPal checkout is wired. Create a Business app at developer.paypal.com, then send the Client ID and Secret here."
	};
	if (!credentials()) {
		const hasPlans = fromEnv.every((p) => p.planId);
		return {
			ready: hasPlans,
			clientId,
			mode,
			plans: fromEnv,
			message: hasPlans ? "PayPal Client ID is set. Subscribe with the buttons below." : "Client ID is present. A Secret is still needed to create the three subscription plans."
		};
	}
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
			plans: fromEnv,
			message: err instanceof Error ? err.message : "PayPal plan setup failed"
		};
	}
});
//#endregion
export { paypalConfig_createServerFn_handler };
