"use client";

import { CheckIcon } from "@/dashboard/icons/nav-icons";

type PropertyFormStepsProps = {
  currentStep: number;
  maxStep: number;
  onStepClick: (step: number) => void;
};

const STEPS = [
  { id: 1, label: "Basic Details", shortLabel: "Basic" },
  { id: 2, label: "Plot & Building", shortLabel: "Plot" },
  { id: 3, label: "Property Status", shortLabel: "Status" },
  { id: 4, label: "Financial Details", shortLabel: "Financial" },
  { id: 5, label: "Media & Documents", shortLabel: "Media" },
] as const;

const TRACK_START = 10;
const TRACK_WIDTH = 80;

export function PropertyFormSteps({
  currentStep,
  maxStep,
  onStepClick,
}: PropertyFormStepsProps) {
  const progressPercent =
    STEPS.length > 1 ? ((currentStep - 1) / (STEPS.length - 1)) * 100 : 0;

  return (
    <nav
      aria-label="Property form steps"
      className="mb-5 border-b border-zinc-100 pb-4 dark:border-zinc-800/80"
    >
      <div className="relative w-full overflow-x-auto">
        <div
          aria-hidden
          className="pointer-events-none absolute top-3 h-0.5 -translate-y-1/2 bg-zinc-200 dark:bg-zinc-700"
          style={{ left: `${TRACK_START}%`, right: `${TRACK_START}%` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-3 h-0.5 -translate-y-1/2 bg-indigo-500 transition-all duration-300 ease-out dark:bg-indigo-400"
          style={{
            left: `${TRACK_START}%`,
            width: `${(progressPercent / 100) * TRACK_WIDTH}%`,
          }}
        />

        <ol className="relative grid min-w-[32rem] grid-cols-5 sm:min-w-0">
          {STEPS.map((item) => {
            const isActive = currentStep === item.id;
            const isComplete = item.id < currentStep;
            const isClickable = item.id <= maxStep;
            const isLocked = !isClickable;

            return (
              <li
                key={item.id}
                className="flex min-w-0 flex-col items-center px-0.5 sm:px-1"
              >
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => isClickable && onStepClick(item.id)}
                  className={`group flex w-full flex-col items-center gap-1.5 ${isClickable ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
                >
                  <span
                    className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${isActive
                      ? "bg-indigo-600 text-white ring-2 ring-indigo-100 dark:bg-indigo-500 dark:ring-indigo-900/50"
                      : isComplete
                        ? "bg-emerald-500 text-white"
                        : isLocked
                          ? "bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                          : "bg-white text-zinc-500 ring-1 ring-zinc-200 group-hover:ring-indigo-200 dark:bg-zinc-950 dark:text-zinc-400 dark:ring-zinc-700 dark:group-hover:ring-indigo-800"
                      }`}
                  >
                    {isComplete ? <CheckIcon /> : item.id}
                  </span>

                  <span
                    title={item.label}
                    className={`w-full text-center text-[10px] font-medium leading-tight sm:text-[11px] ${isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : isComplete
                        ? "text-emerald-600 dark:text-emerald-500"
                        : isLocked
                          ? "text-zinc-400 dark:text-zinc-600"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                  >
                    <span className="sm:hidden">{item.shortLabel}</span>
                    <span className="hidden truncate sm:inline">{item.label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
