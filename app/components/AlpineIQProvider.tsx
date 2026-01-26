"use client";

import { useEffect } from "react";
import { ensureAlpineIQLoaded } from "../../lib/analytics/alpineiq";

export default function AlpineIQProvider() {
  useEffect(() => {
    ensureAlpineIQLoaded();
  }, []);

  return null;
}
