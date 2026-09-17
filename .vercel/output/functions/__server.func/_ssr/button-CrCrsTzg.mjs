import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn } from "./shell-C_CGWYDo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-CrCrsTzg.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-[background-color,box-shadow,opacity,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-40 min-h-11 px-4 active:scale-[0.98]", {
	variants: { variant: {
		primary: "bg-accent text-accent-fg hover:bg-fg",
		ghost: "text-fg hover:bg-raised",
		outline: "bg-surface text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
	} },
	defaultVariants: { variant: "primary" }
});
function Button({ className, variant, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Button as t };
