import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as Archive } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-CrCrsTzg.mjs";
import { i as useVault } from "./trust-panel-C8FohSzZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vault-pin-9Mraq9IH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VaultPinButton({ id, revision }) {
	const pinFromHub = useVault((s) => s.pinFromHub);
	const admitting = useVault((s) => s.admitting);
	const records = useVault((s) => s.records);
	const lastError = useVault((s) => s.lastError);
	const [localError, setLocalError] = (0, import_react.useState)(null);
	const already = Object.values(records).some((r) => r.id === id && (!revision || r.revision === revision));
	async function onPin() {
		setLocalError(null);
		if (!await pinFromHub(id, revision ?? void 0)) {
			const msg = useVault.getState().lastError ?? "Not admitted.";
			setLocalError(msg);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => void onPin(),
				disabled: admitting || already,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "size-3.5" }), already ? "In vault" : admitting ? "Checking Hub…" : "Pin to vault"]
			}),
			localError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-relaxed text-muted",
				children: localError
			}) : null,
			!localError && lastError && admitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: lastError
			}) : null
		]
	});
}
//#endregion
export { VaultPinButton as t };
