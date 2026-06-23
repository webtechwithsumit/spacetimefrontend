"use client";

import { formatBidAmount } from "@/lib/live-auctions";

type BiddingStatusCardProps = {
  variant: "leading" | "outbid";
  currentBidAmount: number;
  userLastBidAmount: number;
};

function GavelIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path d="M14 10l-2 6M10 10l2 6M6 6h12l-1 14H7L6 6Z" />
    </svg>
  );
}

export function BiddingStatusCard({
  variant,
  currentBidAmount,
  userLastBidAmount,
}: BiddingStatusCardProps) {
  const isLeading = variant === "leading";

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-indigo-200/80 bg-white shadow-sm dark:border-indigo-900/40 dark:bg-zinc-950">
      <div
        className={`h-1 bg-gradient-to-r ${
          isLeading
            ? "bg-black"
            : "from-amber-400 via-orange-400 to-rose-400"
        }`}
      />

      <div className="flex items-center justify-between gap-3 border-b border-indigo-100 px-4 py-3.5 dark:border-indigo-900/30">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <GavelIcon className="size-4" />
          </span>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Your Bidding Status
          </h3>
        </div>
        {isLeading ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-3.5"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Highest Bidder
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-3.5"
            >
              <path d="M12 9v4m0 4h.01" />
            </svg>
            Outbid
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 px-3 py-3 dark:border-indigo-900/40 dark:bg-indigo-950/20">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Current Highest Bid
          </p>
          <p className="mt-1.5 text-lg font-bold tracking-tight text-indigo-950 dark:text-indigo-200">
            {formatBidAmount(currentBidAmount)}
          </p>
        </div>
        <div
          className={`rounded-xl border px-3 py-3 ${
            isLeading
              ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20"
              : "border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20"
          }`}
        >
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Your Last Bid
          </p>
          <p
            className={`mt-1.5 text-lg font-bold tracking-tight ${
              isLeading
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-700 dark:text-amber-400"
            }`}
          >
            {formatBidAmount(userLastBidAmount)}
          </p>
        </div>
      </div>

      <div className="border-t border-indigo-100 px-4 py-3.5 dark:border-indigo-900/30">
        <p className="text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {isLeading
            ? "You're in the lead. You can place a new bid only if someone outbids you."
            : "Someone has placed a higher bid. Enter a new amount below to regain the lead."}
        </p>
      </div>
    </div>
  );
}
