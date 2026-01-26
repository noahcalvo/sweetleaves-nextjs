"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "../../lib/analytics/alpineiq";
import { useAgeGateStatus } from "./AgeGate";

export default function PageViewTracker() {
  const pathname = usePathname();
  const status = useAgeGateStatus();

  useEffect(() => {
    if (status !== "verified") {
      return;
    }

    track("page_view", { path: pathname });
  }, [pathname, status]);

  return null;
}
