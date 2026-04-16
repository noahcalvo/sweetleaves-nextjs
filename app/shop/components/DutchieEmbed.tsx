"use client";

import { useEffect, useRef } from "react";

interface Props {
  category?: string;
  brand?: string;
}

const SCRIPT_SRC = "https://dutchie.com/api/v2/embedded-menu/65ae80f7dbecc7000934725c.js";

function setDtcheParams(category?: string, brand?: string) {
  const url = new URL(window.location.href);
  url.searchParams.delete("dtche[category]");
  url.searchParams.delete("dtche[path]");
  url.searchParams.delete("dtche[brands]");

  if (category) {
    url.searchParams.set("dtche[category]", category);
  } else if (brand) {
    url.searchParams.set("dtche[path]", "brands");
    url.searchParams.set("dtche[brands]", brand);
  }

  window.history.replaceState(null, "", url.toString());
}

function clearDtcheParams() {
  const url = new URL(window.location.href);
  url.searchParams.delete("dtche[category]");
  url.searchParams.delete("dtche[path]");
  url.searchParams.delete("dtche[brands]");
  window.history.replaceState(null, "", url.toString());
}

export default function DutchieEmbed({ category, brand }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const container = rootRef.current;

    // Dutchie's script reads dtche params from window.location.search at init time,
    // so they must be set before the script tag is appended.
    setDtcheParams(category, brand);

    // Remove any stale script so a fresh one loads with the updated params.
    document.getElementById("dutchie--embed__script")?.remove();

    const s = document.createElement("script");
    s.id = "dutchie--embed__script";
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    container.appendChild(s);

    return () => {
      s.remove();
      container.innerHTML = "";
      clearDtcheParams();
    };
  }, [category, brand]);

  return <div ref={rootRef} />;
}
