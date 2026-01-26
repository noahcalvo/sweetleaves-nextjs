type AlpineIQTracker = {
  track?: (eventName: string, payload?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    AlpineIQ?: AlpineIQTracker;
    alpineiq?: AlpineIQTracker;
    __alpineIqQueue?: Array<{ eventName: string; payload: Record<string, unknown> }>;
  }
}

const SCRIPT_ID = "alpineiq-script";

function getScriptSrc(): string | null {
  return process.env.NEXT_PUBLIC_ALPINEIQ_SCRIPT_SRC || null;
}

let loadPromise: Promise<void> | null = null;

export function ensureAlpineIQLoaded(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.AlpineIQ || window.alpineiq) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  const scriptSrc = getScriptSrc();
  if (!scriptSrc) {
    return Promise.resolve();
  }

  loadPromise = new Promise((resolve) => {
    if (document.getElementById(SCRIPT_ID)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = scriptSrc;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => resolve();

    document.head.appendChild(script);
  });

  return loadPromise;
}

export async function track(eventName: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") {
    return;
  }

  await ensureAlpineIQLoaded();

  const tracker = window.AlpineIQ || window.alpineiq;
  if (tracker?.track) {
    tracker.track(eventName, payload);
    return;
  }

  if (!window.__alpineIqQueue) {
    window.__alpineIqQueue = [];
  }

  window.__alpineIqQueue.push({ eventName, payload });
}
