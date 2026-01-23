"use client";

import { useEffect, useRef } from "react";

export default function WaxCarousel() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    if (document.getElementById("dutchie--carousel-embed-7f95a3d5-67f4-4ebe-b4a3-ed05721d414f__script")) return;

    const s = document.createElement("script");
    s.id = "dutchie--carousel-embed-fb17ca0d-7fd8-4201-b394-f7ec628097b4__script";
    s.src = "https://dutchie.com/api/v3/embedded-menu/65ae80f7dbecc7000934725c/carousels/fb17ca0d-7fd8-4201-b394-f7ec628097b4.js?routeRoot=https%3A%2F%2Fsweetleavesnorthloop.com%2Fshop-now";
    s.async = true;
    rootRef.current.appendChild(s);
  }, []);

  return <div ref={rootRef} />;
}
