"use client";

import { useEffect, useRef } from "react";

export default function DutchieEmbed() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    if (document.getElementById("dutchie--embed__script")) return;

    const s = document.createElement("script");
    s.id = "dutchie--embed__script";
    s.src = "https://dutchie.com/api/v2/embedded-menu/65ae80f7dbecc7000934725c.js";
    s.async = false;
    rootRef.current.appendChild(s);
  }, []);

  return <div ref={rootRef} />;
}
