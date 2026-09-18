import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const GA_MEASUREMENT_ID = "G-QYQJQH756M";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GaPageviews() {
  const href = useRouterState({ select: (s) => s.location.href });
  const skipFirst = useRef(true);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}`,
    });
  }, [href]);

  return null;
}
