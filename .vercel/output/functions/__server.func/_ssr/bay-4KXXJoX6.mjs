import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as formatCount, n as cn, o as formatRelative, s as shortSha, t as Shell } from "./shell-C_CGWYDo.mjs";
import { a as Pin, i as RefreshCw, l as Copy, s as ExternalLink, t as X, u as Check } from "../_libs/lucide-react.mjs";
import { a as Route$5, c as DOMAINS, d as domainCounts, f as domainMeta, h as useBay, l as bayList, m as isSyncDue, p as isDomainId, u as cliPull } from "./router-B2-wW3pW.mjs";
import { t as Button } from "./button-CrCrsTzg.mjs";
import { r as TrustPanel, t as Badge } from "./trust-panel-C8FohSzZ.mjs";
import { t as VaultPinButton } from "./vault-pin-9Mraq9IH.mjs";
import { t as Input } from "./input-RQyjWf9_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bay-4KXXJoX6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BayCard({ model, selected, onSelect }) {
	const [org, name] = model.id.includes("/") ? model.id.split("/") : ["", model.id];
	const domain = domainMeta(model.domain);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onSelect,
		className: cn("flex w-full flex-col items-start rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[var(--shadow-border-hover)]", selected && "shadow-[var(--shadow-border-hover)]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-sm leading-snug text-fg",
					children: org ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-subtle",
						children: [org, "/"]
					}), name] }) : model.id
				}), model.origin !== "auto" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, {
					className: "size-3.5 shrink-0 text-muted",
					strokeWidth: 1.75,
					"aria-label": "Pinned"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1.5 text-xs text-muted",
				children: [domain.label, model.snapshot.pipeline ? ` · ${model.snapshot.pipeline.replaceAll("-", " ")}` : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-3 text-xs tabular-nums text-subtle",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["score ", model.score.total.toFixed(2)] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: shortSha(model.snapshot.sha) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatCount(model.snapshot.downloads) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: model.status
					})
				]
			})
		]
	});
}
function BayCardSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-3/4 animate-pulse rounded bg-raised" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-3 w-1/2 animate-pulse rounded bg-raised" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-3 w-2/3 animate-pulse rounded bg-raised" })
		]
	});
}
async function copyText(value) {
	try {
		await navigator.clipboard.writeText(value);
		return true;
	} catch {
		return false;
	}
}
function ScoreRow({ parts }) {
	const rows = [
		["Downloads", parts.downloads],
		["Likes", parts.likes],
		["Recency", parts.recency],
		["Quality", parts.quality],
		["Task fit", parts.taskFit]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
		className: "grid gap-2",
		children: [rows.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-subtle",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "tabular-nums text-muted",
				children: value.toFixed(2)
			})]
		}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 border-t border-border pt-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-muted",
				children: "Total"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "tabular-nums text-fg",
				children: parts.total.toFixed(2)
			})]
		})]
	});
}
function BayDetail({ model, onClose }) {
	const pin = useBay((s) => s.pins[model.id]);
	const excluded = useBay((s) => s.exclusions.includes(model.id));
	const pinModel = useBay((s) => s.pin);
	const unpin = useBay((s) => s.unpin);
	const setPinPolicy = useBay((s) => s.setPinPolicy);
	const exclude = useBay((s) => s.exclude);
	const adoptPending = useBay((s) => s.adoptPending);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const domain = domainMeta(model.domain);
	const cmd = cliPull(model.id, model.snapshot.sha);
	async function onCopy() {
		if (!await copyText(cmd)) return;
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1400);
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
						children: model.id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: [domain.label, model.snapshot.pipeline ? ` · ${model.snapshot.pipeline.replaceAll("-", " ")}` : ""]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "relative -mr-1 inline-flex size-11 items-center justify-center rounded-lg text-muted hover:bg-raised hover:text-fg",
					"aria-label": "Close bay details",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: model.status }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: model.origin }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: shortSha(model.snapshot.sha) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-5 grid gap-3 px-5 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-subtle",
							children: "Pulled"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-fg",
							children: formatRelative(model.snapshot.pulledAt)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-subtle",
							children: "Downloads"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "tabular-nums text-fg",
							children: formatCount(model.snapshot.downloads)
						})]
					}),
					model.snapshot.params ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-subtle",
							children: "Parameters"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "tabular-nums text-fg",
							children: formatCount(model.snapshot.params)
						})]
					}) : null,
					model.snapshot.license ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-subtle",
							children: "License"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-fg",
							children: model.snapshot.license
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-subtle",
							children: "Files cached"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
							className: "tabular-nums text-fg",
							children: [model.snapshot.files.length, " names"]
						})]
					})
				]
			}),
			model.pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-5 mt-5 rounded-lg bg-raised px-4 py-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-fg",
						children: "Newer revision on the Hub"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: [
							"Held ",
							shortSha(model.snapshot.sha),
							" · Hub ",
							shortSha(model.pending.sha)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3 h-10",
						onClick: () => adoptPending(model.id),
						children: "Adopt Hub revision"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustPanel, {
				id: model.id,
				revision: model.snapshot.sha,
				license: model.snapshot.license,
				localPin: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.14em] text-muted uppercase",
					children: "Score"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRow, { parts: model.score })
				})]
			}),
			model.history.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.14em] text-muted uppercase",
					children: "History"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 grid gap-1.5 text-xs text-muted",
					children: model.history.map((rev, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: shortSha(rev.sha)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatRelative(rev.pulledAt) })]
					}, `${rev.sha ?? "none"}-${i}`))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-2 px-5",
				children: [pin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => unpin(model.id),
					children: "Unpin"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setPinPolicy(model.id, pin.policy === "lock" ? "follow" : "lock"),
					children: pin.policy === "lock" ? "Follow Hub" : "Lock revision"
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => pinModel(model.id, "follow"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-3.5" }), "Pin"]
				}), !excluded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => exclude(model.id),
					children: "Exclude"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 px-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultPinButton, {
					id: model.id,
					revision: model.snapshot.sha
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto grid gap-2 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void onCopy(),
					className: "inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-raised px-3 text-sm text-fg hover:text-fg",
					children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copied ? "Copied CLI" : "Copy huggingface-cli pull"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `https://huggingface.co/${model.id}`,
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-accent-fg transition-colors duration-150 hover:bg-fg",
					children: ["Open on Hugging Face", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
				})]
			})
		]
	});
}
var selectClass = "h-11 rounded-lg bg-surface px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none focus-visible:shadow-[var(--shadow-border-hover)]";
function BayExceptions() {
	const pins = useBay((s) => s.pins);
	const exclusions = useBay((s) => s.exclusions);
	const rules = useBay((s) => s.rules);
	const settings = useBay((s) => s.settings);
	const pin = useBay((s) => s.pin);
	const unpin = useBay((s) => s.unpin);
	const setPinPolicy = useBay((s) => s.setPinPolicy);
	const exclude = useBay((s) => s.exclude);
	const unexclude = useBay((s) => s.unexclude);
	const addRule = useBay((s) => s.addRule);
	const removeRule = useBay((s) => s.removeRule);
	const addManual = useBay((s) => s.addManual);
	const setSettings = useBay((s) => s.setSettings);
	const syncing = useBay((s) => s.syncing);
	const [pinId, setPinId] = (0, import_react.useState)("");
	const [excludeId, setExcludeId] = (0, import_react.useState)("");
	const [ruleMatch, setRuleMatch] = (0, import_react.useState)("");
	const [ruleKind, setRuleKind] = (0, import_react.useState)("keyword");
	const [ruleDomain, setRuleDomain] = (0, import_react.useState)("language");
	const [manualBusy, setManualBusy] = (0, import_react.useState)(false);
	async function onManual(e) {
		e.preventDefault();
		if (!pinId.trim()) return;
		setManualBusy(true);
		try {
			pin(pinId.trim(), "follow");
			await addManual(pinId.trim());
			setPinId("");
		} finally {
			setManualBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-[-0.02em]",
					children: "Pin a model"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
					children: "Pins stay in the bay even when they lose the automatic quota. Follow picks up new Hub revisions. Lock keeps the snapshot you already pulled."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 flex flex-col gap-2 sm:flex-row",
					onSubmit: (e) => void onManual(e),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: pinId,
						onChange: (e) => setPinId(e.target.value),
						placeholder: "org/model-id",
						className: "sm:max-w-sm",
						autoComplete: "off",
						spellCheck: false
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: manualBusy || syncing || !pinId.trim(),
						children: manualBusy ? "Pulling…" : "Pin and pull"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 grid gap-2",
					children: Object.keys(pins).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-subtle",
						children: "No pins yet."
					}) : Object.entries(pins).map(([id, pinRow]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-col gap-2 rounded-lg bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "min-w-0 font-mono text-sm break-all text-fg",
							children: id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "h-10",
								onClick: () => setPinPolicy(id, pinRow.policy === "lock" ? "follow" : "lock"),
								children: pinRow.policy === "lock" ? "Locked" : "Following"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "h-10",
								onClick: () => unpin(id),
								children: "Remove"
							})]
						})]
					}, id))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-[-0.02em]",
					children: "Exclude"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
					children: "Excluded ids are skipped before scoring. They will not re-enter on the next automatic pass."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 flex flex-col gap-2 sm:flex-row",
					onSubmit: (e) => {
						e.preventDefault();
						if (!excludeId.trim()) return;
						exclude(excludeId.trim());
						setExcludeId("");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: excludeId,
						onChange: (e) => setExcludeId(e.target.value),
						placeholder: "org/model-id",
						className: "sm:max-w-sm",
						autoComplete: "off",
						spellCheck: false
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "outline",
						disabled: !excludeId.trim(),
						children: "Exclude"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 grid gap-2",
					children: exclusions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-subtle",
						children: "Nothing excluded."
					}) : exclusions.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 rounded-lg bg-surface px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "min-w-0 font-mono text-sm break-all",
							children: id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "h-10",
							onClick: () => unexclude(id),
							children: "Restore"
						})]
					}, id))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-[-0.02em]",
					children: "Domain rules"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
					children: "First matching rule wins, before the built-in taxonomy. Use this for odd models you still want on a named shelf."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)_9rem_auto]",
					onSubmit: (e) => {
						e.preventDefault();
						if (!ruleMatch.trim()) return;
						addRule({
							kind: ruleKind,
							match: ruleMatch,
							domain: ruleDomain
						});
						setRuleMatch("");
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: selectClass,
							value: ruleKind,
							onChange: (e) => setRuleKind(e.target.value),
							"aria-label": "Rule kind",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "keyword",
									children: "Keyword"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "tag",
									children: "Tag"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "pipeline",
									children: "Pipeline"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: ruleMatch,
							onChange: (e) => setRuleMatch(e.target.value),
							placeholder: "match",
							autoComplete: "off",
							spellCheck: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: selectClass,
							value: ruleDomain,
							onChange: (e) => {
								if (isDomainId(e.target.value)) setRuleDomain(e.target.value);
							},
							"aria-label": "Target domain",
							children: DOMAINS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d.id,
								children: d.label
							}, d.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "outline",
							disabled: !ruleMatch.trim(),
							children: "Add rule"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 grid gap-2",
					children: rules.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-subtle",
						children: "No custom rules."
					}) : rules.map((rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-col gap-2 rounded-lg bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: rule.kind
								}),
								" “",
								rule.match,
								"” → ",
								rule.domain
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "h-10",
							onClick: () => removeRule(rule.id),
							children: "Remove"
						})]
					}, rule.id))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-[-0.02em]",
					children: "Cadence"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm leading-relaxed text-muted",
					children: "While this tab is open, Forge checks once a minute and syncs when the interval has elapsed. Closing the app pauses the clock; the next visit catches up."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-3 sm:flex-row sm:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm text-muted",
							htmlFor: "bay-interval",
							children: "Sync every"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "bay-interval",
							className: selectClass,
							value: settings.intervalHours,
							onChange: (e) => setSettings({ intervalHours: Number(e.target.value) }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: 6,
									children: "6 hours"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: 12,
									children: "12 hours"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: 24,
									children: "24 hours"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm text-muted",
							htmlFor: "bay-keep",
							children: "Keep per domain"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "bay-keep",
							className: selectClass,
							value: settings.keepPerDomain,
							onChange: (e) => setSettings({ keepPerDomain: Number(e.target.value) }),
							children: [
								3,
								4,
								5,
								6,
								8
							].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: n,
								children: n
							}, n))
						})
					]
				})
			] })
		]
	});
}
function BayPolicy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "max-w-2xl text-sm leading-relaxed text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-[-0.02em] text-fg",
				children: "How the bay decides"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3",
				children: "Forge does not store multi-gigabyte weights in the browser. The bay is a versioned local catalog: Hub metadata, file inventory, score, and the last three revisions. Weights stay on Hugging Face until you run the copied CLI locally."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-8 font-display text-xl text-fg",
				children: "Score"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2",
				children: "Each candidate is classified into a domain, then scored 0–1:"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 grid gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "35% downloads — log1p, referenced to 5M" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "15% likes — log1p, referenced to 8k" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "20% recency — exponential decay, 45-day time constant on lastModified" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "15% quality — safetensors, permissive license, paper/arxiv tag, likes ≥ 200" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "15% task fit — pipeline or tags matching the assigned domain" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3",
				children: "“Important” is the download/like mass. “Relevant” is recency plus domain fit. Quality stops junk forks with huge download counters from crowding out maintained checkpoints."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-8 font-display text-xl text-fg",
				children: "Triage"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2",
				children: "Each domain keeps its pins plus the highest-scoring auto slots (default 5). Auto picks need a score of at least 0.42 (0.55 for Other) so a burst of brand-new Hub dumps cannot crowd the shelf. If the bay exceeds max size, the lowest unpinned scores drop. Pins never drop."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-8 font-display text-xl text-fg",
				children: "Updates and conflicts"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2",
				children: "Default interval is 12 hours, checked on load and every minute while the page is visible. When a snapshot’s SHA changes: follow (the default) writes the new revision and keeps up to three previous snapshots. Lock leaves the current snapshot in place and stores the Hub revision as pending until you adopt it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-8 font-display text-xl text-fg",
				children: "Storage"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2",
				children: [
					"Everything lives in this browser under ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "text-fg",
						children: "forge-bay-v1"
					}),
					". No account. Clearing site data clears the bay. A record is the model id, domain, score vector, current snapshot (sha, files, license, stats), and history. That is enough to resume a local ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "text-fg",
						children: "huggingface-cli download"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-8 font-display text-xl text-fg",
				children: "Exceptions without breaking auto"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2",
				children: "Pin, exclude, or add a domain rule on the Exceptions tab. Rules are applied before scoring; exclusions before that; pins after. Adding a pin never changes the formula — it only reserves a slot. Removing a pin returns the model to ordinary competition on the next sync."
			})
		]
	});
}
function BayPage() {
	const { tab, domain, model: selectedId } = Route$5.useSearch();
	const navigate = Route$5.useNavigate();
	const hydrated = useBay((s) => s.hydrated);
	const models = useBay((s) => s.models);
	const syncing = useBay((s) => s.syncing);
	const lastSyncAt = useBay((s) => s.lastSyncAt);
	const lastSyncError = useBay((s) => s.lastSyncError);
	const intervalHours = useBay((s) => s.settings.intervalHours);
	const log = useBay((s) => s.log);
	const sync = useBay((s) => s.sync);
	const counts = domainCounts(models);
	const list = bayList(models, domain);
	const selected = selectedId ? models[selectedId] : void 0;
	const due = isSyncDue(lastSyncAt, intervalHours);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
						children: "Local model bay"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-3xl tracking-[-0.02em] sm:text-4xl",
						children: "Keep the shelf current"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
						children: "Forge scouts the public Hub, scores what matters, and pulls snapshots into this browser. Pins and rules keep the exceptions."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-start gap-2 sm:items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => void sync(),
							disabled: syncing,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-4", syncing && "animate-spin") }), syncing ? "Syncing…" : due ? "Sync now" : "Sync again"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-subtle",
							children: [
								"Last sync ",
								formatRelative(lastSyncAt),
								" · every ",
								intervalHours,
								"h"
							]
						}),
						lastSyncError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: lastSyncError
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex gap-2 overflow-x-auto pb-1",
				children: [
					["shelf", "Shelf"],
					["exceptions", "Exceptions"],
					["policy", "Policy"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void navigate({ search: (prev) => ({
						...prev,
						tab: id,
						model: void 0
					}) }),
					className: cn("inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm transition-colors duration-150", tab === id ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg"),
					children: label
				}, id))
			}),
			tab === "exceptions" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BayExceptions, {})
			}) : null,
			tab === "policy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BayPolicy, {})
			}) : null,
			tab === "shelf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DomainChip, {
						label: "All",
						count: Object.keys(models).length,
						active: domain === "all",
						onClick: () => void navigate({ search: (prev) => ({
							...prev,
							domain: "all",
							model: void 0
						}) })
					}), DOMAINS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DomainChip, {
						label: d.label,
						count: counts[d.id],
						active: domain === d.id,
						onClick: () => void navigate({ search: (prev) => ({
							...prev,
							domain: d.id,
							model: void 0
						}) })
					}, d.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("mt-8 grid gap-4", selected ? "lg:grid-cols-[1fr_22rem]" : ""),
					children: [!hydrated || syncing && list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: Array.from({ length: 6 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BayCardSkeleton, {}, i))
					}) : list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl bg-surface px-5 py-10 text-center text-sm text-muted shadow-[var(--shadow-border)]",
						children: "The bay is empty. Sync to scout the Hub, or pin a model under Exceptions."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BayCard, {
							model: item,
							selected: item.id === selectedId,
							onSelect: () => void navigate({ search: (prev) => ({
								...prev,
								model: item.id
							}) })
						}, item.id))
					}), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BayDetail, {
							model: selected,
							onClose: () => void navigate({ search: (prev) => ({
								...prev,
								model: void 0
							}) })
						})
					}) : null]
				}),
				log.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-14",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-[-0.02em]",
						children: "Recent pulls"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 grid gap-2",
						children: log.slice(0, 8).map((entry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col gap-1 rounded-lg bg-surface px-4 py-3 text-sm sm:flex-row sm:items-baseline sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-fg",
								children: entry.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted",
								children: [
									entry.action,
									" · ",
									entry.detail
								]
							})]
						}, `${entry.at}-${entry.id}-${i}`))
					})]
				}) : null
			] }) : null
		]
	}) });
}
function DomainChip({ label, count, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm transition-colors duration-150", active ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg"),
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("tabular-nums", active ? "text-accent-fg" : "text-subtle"),
			children: count
		})]
	});
}
//#endregion
export { BayPage as component };
