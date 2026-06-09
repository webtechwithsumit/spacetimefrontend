"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Auction } from "@/components/auction-card/types";

function useCountdown(endsAt: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const tick = () => {
      const diff = new Date(endsAt).getTime() - Date.now();

      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setTimeLeft(
        `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`,
      );
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return timeLeft;
}

type AuctionCardProps = {
  auction: Auction;
};

export function AuctionCard({ auction }: AuctionCardProps) {
  const timeLeft = useCountdown(auction.endsAt);
  const [imageError, setImageError] = useState(false);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {!imageError ? (
          <Image
            src={auction.image}
            alt={auction.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-10 text-zinc-400"
            >
              <path d="M3 21h18M5 21V9l7-4 7 4v12M9 21v-6h6v6" />
            </svg>
          </div>
        )}

        {auction.isLive && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Live Now
          </span>
        )}

        <span className="absolute bottom-3 left-3 z-10 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold tracking-wide text-zinc-900 uppercase shadow-sm">
          {auction.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-zinc-900 dark:text-white">
          {auction.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-3.5 shrink-0"
          >
            <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span className="truncate">{auction.location}</span>
        </p>

        <div className="mt-3 flex items-center justify-between rounded-lg bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-900">
          <span className="text-zinc-500 dark:text-zinc-400">Ends in</span>
          <span className="font-medium text-zinc-900 tabular-nums dark:text-white">
            {timeLeft}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              Current Bid
            </p>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">
              {auction.currentBid}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Start {auction.startingBid}
            </p>
          </div>
          <Link
            href={`/auctions/${auction.id}/bid`}
            className="shrink-0 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
          >
            Place Bid
          </Link>
        </div>
      </div>
    </article>
  );
}
