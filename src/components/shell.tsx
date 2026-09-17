import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5", className)}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 16.5 12 4l8 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8 16.5h8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 20h4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

const NAV = [
  { to: "/huggingface" as const, label: "Models" },
  { to: "/bay" as const, label: "Bay" },
  { to: "/vault" as const, label: "Vault" },
  { to: "/conduit" as const, label: "Router" },
  { to: "/subscribe" as const, label: "Subscribe" },
  { to: "/donate" as const, label: "Donate" },
];

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            to="/"
            className="flex min-h-11 items-center gap-2 text-sm font-medium tracking-tight"
          >
            <Mark />
            <span>Forge</span>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-muted transition-colors duration-150 hover:bg-raised hover:text-fg"
                activeProps={{ className: "text-fg bg-raised" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-border/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs leading-relaxed text-subtle">
            Independent of xAI. Source on{" "}
            <a
              href="https://github.com/buypeaky-crypto/Forge"
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-fg"
            >
              GitHub
            </a>
            .
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/subscribe"
              className="inline-flex min-h-11 items-center text-xs text-muted hover:text-fg"
            >
              PayPal monthly
            </Link>
            <Link
              to="/donate"
              className="inline-flex min-h-11 items-center text-xs text-muted hover:text-fg"
            >
              Small donation — BTC, ETH, SOL
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
