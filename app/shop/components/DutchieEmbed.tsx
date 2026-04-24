"use client";

import { useEffect, useRef } from "react";

interface Props {
  category?: string;
}

export default function DutchieEmbed({ category }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    if (document.getElementById("dutchie--embed__script")) return;

    if (category) {
      const url = new URL(window.location.href);
      url.searchParams.set("dtche[category]", category);
      window.history.replaceState({}, "", url.toString());
    }

    const s = document.createElement("script");
    s.id = "dutchie--embed__script";
    s.src = "https://dutchie.com/api/v2/embedded-menu/65ae80f7dbecc7000934725c.js";
    s.async = true;
    s.defer = true;
    rootRef.current.appendChild(s);
  }, [category]);

  return <div ref={rootRef} />;
}
