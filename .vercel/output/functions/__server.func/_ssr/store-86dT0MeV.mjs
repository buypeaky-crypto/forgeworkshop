import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-86dT0MeV.js
var usePaypal = create()(persist((set) => ({
	subscription: null,
	setSubscription: (subscription) => set({ subscription }),
	clear: () => set({ subscription: null })
}), { name: "forge-paypal-v1" }));
function hasPlan(sub, key) {
	return sub?.planKey === key;
}
//#endregion
export { usePaypal as n, hasPlan as t };
