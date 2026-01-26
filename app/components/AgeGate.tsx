"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const DEFAULT_TTL_HOURS = 12;
const FOCUSABLE_SELECTOR =
  "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

type GateStatus = "prompt" | "exit" | "verified";

const AgeGateContext = createContext<GateStatus>("prompt");

export function useAgeGateStatus() {
  return useContext(AgeGateContext);
}

function getTtlHours(): number {
  const raw = process.env.NEXT_PUBLIC_AGE_GATE_TTL_HOURS;
  const parsed = Number(raw);

  if (!Number.isFinite(parsed)) {
    return DEFAULT_TTL_HOURS;
  }

  if (parsed === 0) {
    return 0;
  }

  if (parsed < 0) {
    return DEFAULT_TTL_HOURS;
  }

  return parsed;
}

function isExpired(verifiedAt: number, ttlHours: number): boolean {
  if (!Number.isFinite(verifiedAt)) {
    return true;
  }

  if (ttlHours === 0) {
    return true;
  }

  const ttlMs = ttlHours * 60 * 60 * 1000;
  return Date.now() - verifiedAt > ttlMs;
}

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<GateStatus>(() => {
    const verified =
      typeof window !== "undefined" &&
      localStorage.getItem("ageGate:verified") === "true";
    const verifiedAt = Number(
      typeof window !== "undefined"
        ? localStorage.getItem("ageGate:verifiedAt")
        : ""
    );
    const ttlHours = getTtlHours();
    const expired = isExpired(verifiedAt, ttlHours);

    if (verified && !expired) {
      return "verified";
    } else {
      return "prompt";
    }
  });
  const dialogRef = useRef<HTMLDivElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (status === "verified") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [status]);

  useEffect(() => {
    if (status !== "prompt") {
      return;
    }

    yesButtonRef.current?.focus();
  }, [status]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const container = dialogRef.current;
    if (!container) {
      return;
    }

    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter((element) => !element.hasAttribute("disabled"));

    if (focusables.length === 0) {
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleYes = () => {
    localStorage.setItem("ageGate:verified", "true");
    localStorage.setItem("ageGate:verifiedAt", String(Date.now()));
    setStatus("verified");
  };

  const handleNo = () => {
    setStatus("exit");
  };

  const gateActive = status !== "verified";

  return (
    <AgeGateContext.Provider value={status}>
      <div className="relative">
        {gateActive ? null : children}

        {gateActive ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 py-10 backdrop-blur-sm">
            {status === "prompt" ? (
              <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="age-gate-title"
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-zinc-900 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              >
                <h1 id="age-gate-title" className="text-2xl font-semibold">
                  Are you 21 years of age or older?
                </h1>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                  You must be 21+ to enter this site.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    ref={yesButtonRef}
                    type="button"
                    onClick={handleYes}
                    className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Yes, Enter
                  </button>
                  <button
                    type="button"
                    onClick={handleNo}
                    className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="age-gate-exit-title"
                className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-zinc-900 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              >
                <h1 id="age-gate-exit-title" className="text-2xl font-semibold">
                  Access Restricted
                </h1>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                  This site is restricted to users 21 years of age or older.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </AgeGateContext.Provider>
  );
}
