"use client";

import { useEffect } from "react";

type MessageModalProps = {
  open: boolean;
  title: string;
  message: string;
  variant?: "error" | "success" | "info";
  actionLabel?: string;
  onClose: () => void;
};

const variantConfig = {
  error: {
    label: "Notice",
    gradient: "from-rose-400 via-orange-400 to-amber-400",
    iconWrap:
      "bg-rose-50 text-rose-600 ring-rose-100/80 dark:bg-rose-950/30 dark:text-rose-400 dark:ring-rose-900/40",
    messageBox:
      "border-rose-100/80 bg-rose-50/50 text-rose-900/90 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-100/90",
  },
  success: {
    label: "Success",
    gradient: "from-emerald-400 via-teal-400 to-cyan-400",
    iconWrap:
      "bg-emerald-50 text-emerald-600 ring-emerald-100/80 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-900/40",
    messageBox:
      "border-emerald-100/80 bg-emerald-50/50 text-emerald-900/90 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-100/90",
  },
  info: {
    label: "Info",
    gradient: "from-indigo-500 via-violet-500 to-purple-500",
    iconWrap:
      "bg-indigo-50 text-indigo-600 ring-indigo-100/80 dark:bg-indigo-950/30 dark:text-indigo-400 dark:ring-indigo-900/40",
    messageBox:
      "border-indigo-100/80 bg-indigo-50/50 text-indigo-900/90 dark:border-indigo-900/30 dark:bg-indigo-950/20 dark:text-indigo-100/90",
  },
} as const;

function ModalIcon({ variant }: { variant: keyof typeof variantConfig }) {
  if (variant === "success") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className="size-7"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }

  if (variant === "info") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className="size-7"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 10v4M12 8h.01" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="size-7"
    >
      <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </svg>
  );
}

export function MessageModal({
  open,
  title,
  message,
  variant = "info",
  actionLabel = "Got it",
  onClose,
}: MessageModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const config = variantConfig[variant];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-zinc-900/45 backdrop-blur-[6px] transition-opacity dark:bg-black/60"
        onClick={onClose}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="message-modal-title"
        aria-describedby="message-modal-description"
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_24px_80px_-12px_rgba(0,0,0,0.28)] dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-[0_24px_80px_-12px_rgba(0,0,0,0.75)]"
      >
        <div className={`h-1 bg-gradient-to-r ${config.gradient}`} />

        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-4"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 pb-6 pt-8 sm:px-7 sm:pb-7 sm:pt-9">
          <div className="flex flex-col items-center text-center">
            <span
              className={`flex size-16 items-center justify-center rounded-2xl ring-4 ${config.iconWrap}`}
            >
              <ModalIcon variant={variant} />
            </span>

            <span className="mt-5 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              {config.label}
            </span>

            <h2
              id="message-modal-title"
              className="mt-3 text-xl font-semibold tracking-tight text-zinc-900 dark:text-white"
            >
              {title}
            </h2>

            <div
              id="message-modal-description"
              className={`mt-4 w-full rounded-xl border px-4 py-3.5 text-sm leading-relaxed ${config.messageBox}`}
            >
              {message}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.99] dark:bg-white dark:text-zinc-900"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
