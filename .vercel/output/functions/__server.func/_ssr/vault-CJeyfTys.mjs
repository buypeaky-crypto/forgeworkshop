import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, o as formatRelative, r as formatBytes, s as shortSha, t as Shell } from "./shell-C_CGWYDo.mjs";
import { l as Copy, s as ExternalLink, t as X, u as Check } from "../_libs/lucide-react.mjs";
import { h as useBay, n as Route } from "./router-B2-wW3pW.mjs";
import { t as Button } from "./button-CrCrsTzg.mjs";
import { i as hubTreeUrl, o as webseedUrl, r as hubCardUrl } from "./webseed-CX85z8gt.mjs";
import { a as vaultList, i as useVault, n as PERMISSIVE_LICENSES, r as TrustPanel, t as Badge } from "./trust-panel-C8FohSzZ.mjs";
import { t as Input } from "./input-RQyjWf9_.mjs";
import { n as usePaypal, t as hasPlan } from "./store-86dT0MeV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vault-CJeyfTys.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VaultCard({ record, selected, onSelect }) {
	const weights = record.files.filter((f) => f.role === "weight").length;
	const bytes = record.files.reduce((n, f) => n + f.size, 0);
	const [org, name] = record.id.includes("/") ? record.id.split("/") : ["", record.id];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onSelect,
		className: cn("flex w-full flex-col items-start rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[var(--shadow-border-hover)]", selected && "shadow-[var(--shadow-border-hover)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-sm leading-snug text-fg",
				children: org ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-subtle",
					children: [org, "/"]
				}), name] }) : record.id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1.5 text-xs text-muted",
				children: [record.license, record.pipeline ? ` · ${record.pipeline.replaceAll("-", " ")}` : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-3 text-xs tabular-nums text-subtle",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: shortSha(record.revision) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						weights,
						" hashed ",
						weights === 1 ? "file" : "files"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatBytes(bytes) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatRelative(record.pinnedAt) })
				]
			})
		]
	});
}
var SAFETY_DISCLAIMER = "Checksums prove bytes match the Hugging Face source. They do not prove a model is safe to run.";
function webseedBundle(record) {
	const files = record.files.map((file) => ({
		path: file.path,
		size: file.size,
		sha256: file.sha256,
		url: webseedUrl(record.id, record.revision, file.path)
	}));
	return {
		protocol: "forge-webseed-v1",
		source: "huggingface",
		id: record.id,
		revision: record.revision,
		license: record.license,
		"url-list": files.map((f) => f.url),
		files,
		note: "Default fetch is Hugging Face HTTPS (BEP-19 web-seed). This bundle is the torrent fallback: hashes plus url-list. It is not a BEP-3 .torrent (piece hashes require the bytes).",
		disclaimer: SAFETY_DISCLAIMER
	};
}
function bundleText(record) {
	return JSON.stringify(webseedBundle(record), null, 2);
}
function cliPull(id, revision) {
	return `huggingface-cli download ${id} --revision ${revision}`;
}
var REPORT_REASONS = [
	"malware",
	"license",
	"illegal",
	"other"
];
async function copyText(value) {
	try {
		await navigator.clipboard.writeText(value);
		return true;
	} catch {
		return false;
	}
}
function VaultDetail({ record, onClose }) {
	const drop = useVault((s) => s.drop);
	const report = useVault((s) => s.report);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)("malware");
	const [note, setNote] = (0, import_react.useState)("");
	const [reported, setReported] = (0, import_react.useState)(false);
	async function onCopy(kind) {
		if (!await copyText(kind === "bundle" ? bundleText(record) : cliPull(record.id, record.revision))) return;
		setCopied(kind);
		window.setTimeout(() => setCopied(null), 1400);
	}
	function onReport(e) {
		e.preventDefault();
		report({
			modelId: record.id,
			revision: record.revision,
			reason,
			note
		});
		setReported(true);
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex h-full flex-col rounded-xl bg-surface shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 p-5 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-sm leading-snug text-fg break-all",
						children: record.id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: [
							record.license,
							" · ",
							shortSha(record.revision)
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "relative -mr-1 inline-flex size-11 items-center justify-center rounded-lg text-muted hover:bg-raised hover:text-fg",
					"aria-label": "Close vault record",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: record.source }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [record.files.length, " hashed"] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 px-5 text-xs leading-relaxed text-subtle",
				children: SAFETY_DISCLAIMER
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustPanel, {
				id: record.id,
				revision: record.revision,
				license: record.license,
				localPin: true,
				initialFiles: record.files
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 min-h-0 flex-1 overflow-y-auto px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.14em] text-muted uppercase",
					children: "Files"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 grid gap-2",
					children: record.files.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg bg-raised px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs break-all text-fg",
								children: file.path
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-xs break-all text-subtle",
								children: file.sha256
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									file.role,
									" · ",
									formatBytes(file.size),
									" · ",
									shortSha(record.revision)
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: webseedUrl(record.id, record.revision, file.path),
									target: "_blank",
									rel: "noreferrer",
									className: "min-h-11 inline-flex items-center text-muted hover:text-fg",
									children: "HF web-seed"
								})]
							})
						]
					}, file.path))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: hubTreeUrl(record.id, record.revision),
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-accent-fg transition-colors duration-150 hover:bg-fg",
						children: ["Get from Hugging Face", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => void onCopy("bundle"),
						children: [copied === "bundle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copied === "bundle" ? "Copied bundle" : "Copy web-seed bundle"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => void onCopy("cli"),
						children: copied === "cli" ? "Copied CLI" : "Copy huggingface-cli"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: hubCardUrl(record.id),
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex h-11 items-center justify-center text-sm text-muted hover:text-fg",
						children: "Model card"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => drop(record.key),
						children: "Drop pin"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "border-t border-border px-5 py-4",
				onSubmit: onReport,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.14em] text-muted uppercase",
						children: "Report"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs leading-relaxed text-subtle",
						children: "Report removes this pin and hides the id. Forge does not host the bytes — takedown here means we will not keep the record."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-3 block text-xs text-muted",
						htmlFor: "vault-reason",
						children: "Reason"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						id: "vault-reason",
						className: "mt-1 h-11 w-full rounded-lg bg-raised px-3 text-sm text-fg",
						value: reason,
						onChange: (e) => setReason(e.target.value),
						children: REPORT_REASONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: r,
							children: r
						}, r))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mt-3 block text-xs text-muted",
						htmlFor: "vault-note",
						children: "Note"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "vault-note",
						value: note,
						onChange: (e) => setNote(e.target.value),
						rows: 2,
						className: "mt-1 w-full rounded-lg bg-raised px-3 py-2 text-sm text-fg outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "outline",
						className: "mt-3",
						disabled: reported,
						children: "Submit report and hide"
					})
				]
			})
		]
	});
}
function VaultPolicy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "max-w-2xl text-sm leading-relaxed text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-[-0.02em] text-fg",
				children: "Permanence, not a pirate bay"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3",
				children: "The vault pins open models that already exist on the public Hugging Face Hub. HF is the source of truth. Forge does not take raw weight zips, does not invent hashes, and does not host the bytes."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-8 font-display text-xl text-fg",
				children: "Admission"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 grid gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Public Hub repo only — private and gated are rejected." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"License on the model card (or ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "text-fg",
							children: "license:"
						}),
						" tag) must be clearly permissive OSI: ",
						PERMISSIVE_LICENSES.join(", "),
						"."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Llama, Gemma, OpenRAIL, NC, and blank/custom licenses fail the gate." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Revision/commit is stored. Files without official LFS SHA-256 are not pinned." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A baked denylist and any local report hide the id immediately." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-8 font-display text-xl text-fg",
				children: "Downloads"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2",
				children: [
					"Default is Hugging Face HTTPS at ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
						className: "text-fg",
						children: [
							"/resolve/",
							"{revision}",
							"/",
							"{path}"
						]
					}),
					"— the BEP-19 web-seed. The torrent control is a fallback: a JSON bundle of those URLs plus SHA-256. It is not a BEP-3 .torrent; piece hashes need the bytes, which this workshop does not store."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-8 font-display text-xl text-fg",
				children: "Checksums"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2",
				children: SAFETY_DISCLAIMER
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-8 font-display text-xl text-fg",
				children: "Report and takedown"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2",
				children: "Every record has a report form (malware, license, illegal, other). A report drops the pin and hides the model id so it cannot be re-admitted until you restore it under Reports. If the Hub removes or gates a model, a later pin attempt fails. No tokens, airdrops, or leaked-weight UX."
			})
		]
	});
}
function vaultAuditText(records) {
	const lines = [
		"Forge vault SHA-256 audit",
		`Generated ${(/* @__PURE__ */ new Date()).toISOString()}`,
		"Checksums prove bytes match the Hugging Face source. They do not prove a model is safe to run.",
		""
	];
	for (const record of records) {
		lines.push(`${record.id}@${record.revision}`);
		lines.push(`license: ${record.license}`);
		for (const file of record.files) lines.push(`  ${file.sha256}  ${file.path}  ${file.size}`);
		lines.push("");
	}
	return lines.join("\n");
}
function downloadText(filename, body, type = "text/plain") {
	const blob = new Blob([body], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function VaultPerks() {
	const subscription = usePaypal((s) => s.subscription);
	const records = useVault((s) => s.records);
	const models = useBay((s) => s.models);
	const log = useBay((s) => s.log);
	const sponsor = hasPlan(subscription, "sponsor");
	const vaultPro = hasPlan(subscription, "vault");
	const signals = hasPlan(subscription, "signals");
	const auditOk = vaultPro || sponsor;
	const list = vaultList(records);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-12 rounded-xl bg-surface px-5 py-6 shadow-[var(--shadow-border)] sm:px-6",
		children: [
			sponsor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center gap-3 border-b border-border pb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex size-10 items-center justify-center rounded-lg bg-raised font-display text-lg",
					children: "F"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
					children: "Sponsor"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl tracking-[-0.02em]",
					children: "Forge Sponsor"
				})] })]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
				children: "Subscriber tools"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
				children: "Vault Pro unlocks the SHA-256 audit. Signals API exports bay history as JSON. Sponsor places a mark in this footer."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						disabled: !auditOk,
						onClick: () => downloadText("forge-vault-audit.txt", vaultAuditText(list)),
						children: "SHA-256 audit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						disabled: !signals,
						onClick: () => downloadText("bay.json", JSON.stringify({
							models,
							log,
							exportedAt: (/* @__PURE__ */ new Date()).toISOString()
						}, null, 2), "application/json"),
						children: "Download bay.json"
					}),
					!subscription ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/subscribe",
						className: "inline-flex h-11 items-center px-3 text-sm text-muted hover:text-fg",
						children: "Subscribe on PayPal"
					}) : null
				]
			})
		]
	});
}
function VaultPage() {
	const { tab, record: selectedKey } = Route.useSearch();
	const navigate = Route.useNavigate();
	const records = useVault((s) => s.records);
	const hidden = useVault((s) => s.hidden);
	const reports = useVault((s) => s.reports);
	const lastError = useVault((s) => s.lastError);
	const admitting = useVault((s) => s.admitting);
	const pinFromHub = useVault((s) => s.pinFromHub);
	const unhide = useVault((s) => s.unhide);
	const [pinId, setPinId] = (0, import_react.useState)("");
	const list = vaultList(records);
	const selected = selectedKey ? records[selectedKey] : void 0;
	async function onPin(e) {
		e.preventDefault();
		const record = await pinFromHub(pinId);
		if (record) {
			setPinId("");
			navigate({ search: (prev) => ({
				...prev,
				tab: "catalog",
				record: record.key
			}) });
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
				children: "Open-model vault"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl tracking-[-0.02em] sm:text-4xl",
				children: "Pin the Hub revision"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
				children: "Only public Hugging Face models with a clearly permissive license. Each file keeps the official SHA-256 and commit. Downloads go to HF first; torrents are a web-seed fallback."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 flex flex-col gap-2 sm:flex-row sm:items-center",
				onSubmit: (e) => void onPin(e),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "vault-admit-id",
					value: pinId,
					onChange: (e) => setPinId(e.target.value),
					placeholder: "org/model-id",
					className: "sm:max-w-sm",
					autoComplete: "off",
					spellCheck: false
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: admitting || !pinId.trim(),
					children: admitting ? "Checking Hub…" : "Admit to vault"
				})]
			}),
			lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-xs leading-relaxed text-muted",
				children: lastError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex gap-2 overflow-x-auto pb-1",
				children: [
					["catalog", "Catalog"],
					["policy", "Policy"],
					["reports", "Reports"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void navigate({ search: (prev) => ({
						...prev,
						tab: id,
						record: void 0
					}) }),
					className: cn("inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm transition-colors duration-150", tab === id ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg"),
					children: label
				}, id))
			}),
			tab === "policy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultPolicy, {})
			}) : null,
			tab === "reports" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-[-0.02em]",
					children: "Reports"
				}), reports.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-subtle",
					children: "No reports yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 grid gap-2",
					children: reports.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg bg-surface px-4 py-3 text-sm shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-fg break-all",
								children: row.modelId
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-muted",
								children: [
									row.reason,
									" · ",
									formatRelative(row.at),
									" · ",
									row.revision.slice(0, 7)
								]
							}),
							row.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-subtle",
								children: row.note
							}) : null
						]
					}, row.id))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-[-0.02em]",
					children: "Hidden ids"
				}), hidden.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-subtle",
					children: "Nothing hidden."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 grid gap-2",
					children: hidden.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 rounded-lg bg-surface px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-sm break-all",
							children: id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "h-10",
							onClick: () => unhide(id),
							children: "Restore"
						})]
					}, id))
				})] })]
			}) : null,
			tab === "catalog" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mt-8 grid gap-4", selected ? "lg:grid-cols-[1fr_24rem]" : ""),
				children: [list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl bg-surface px-5 py-10 text-center text-sm text-muted shadow-[var(--shadow-border)]",
					children: "The vault is empty. Admit a public, permissively licensed Hub model, or pin one from Models / Bay."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultCard, {
						record: item,
						selected: item.key === selectedKey,
						onSelect: () => void navigate({ search: (prev) => ({
							...prev,
							record: item.key
						}) })
					}, item.key))
				}), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultDetail, {
						record: selected,
						onClose: () => void navigate({ search: (prev) => ({
							...prev,
							record: void 0
						}) })
					})
				}) : null]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultPerks, {})
		]
	}) });
}
//#endregion
export { VaultPage as component };
