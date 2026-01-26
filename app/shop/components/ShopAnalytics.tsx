"use client";

import { useEffect } from "react";
import { track } from "../../../lib/analytics/alpineiq";
import { useAgeGateStatus } from "../../components/AgeGate";

export default function ShopAnalytics() {
  const status = useAgeGateStatus();

  useEffect(() => {
    if (status !== "verified") {
      return;
    }

    track("menu_enter", { path: "/shop" });
  }, [status]);

  return null;
}
