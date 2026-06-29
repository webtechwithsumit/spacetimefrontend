"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Auction } from "@/components/auction-card/types";
import { trackPropertyCardClick } from "@/lib/analytics";

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

const propertyHref = (id: string) => `/auctions/${id}`;

export function AuctionCard({ auction }: AuctionCardProps) {
  const timeLeft = useCountdown(auction.endsAt);
  const [imageError, setImageError] = useState(false);
  const hasEnded = timeLeft === "Ended";
  const href = propertyHref(auction.id);

  function handleCardClick(source: "image" | "title" | "button") {
    trackPropertyCardClick(auction.id, {
      source,
      category: auction.category,
      city: auction.location,
      title: auction.title,
    });
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <Link
        href={href}
        onClick={() => handleCardClick("image")}
        className="relative aspect-[4/3] shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900"
      >
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

        {hasEnded ? (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-zinc-400" />
            Ended
          </span>
        ) : (
          auction.isLive && (
            <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Live Now
            </span>
          )
        )}

        <span className="absolute bottom-3 left-3 z-10 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold tracking-wide text-zinc-900 uppercase shadow-sm">
          {auction.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="min-h-[3.75rem]">
          <Link href={href} onClick={() => handleCardClick("title")} className="group block">
            <h3 className="line-clamp-2 min-h-[2.75rem] text-base leading-snug font-semibold text-zinc-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
              {auction.title}
            </h3>
          </Link>
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
        </div>

        <div className="mt-3 flex min-h-9 items-center justify-between rounded-lg bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-900">
          <span className="text-zinc-500 dark:text-zinc-400">Ends in</span>
          <span className="font-medium text-zinc-900 tabular-nums dark:text-white">
            {timeLeft}
          </span>
        </div>

        <div className="mt-auto space-y-3 pt-4">
          <div>
            <p className="text-[10px] font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              Current Bid
            </p>
            <p className="text-lg leading-tight font-bold text-zinc-900 dark:text-white">
              {auction.currentBid}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Start {auction.startingBid}
            </p>
          </div>
          <Link
            href={href}
            onClick={() => handleCardClick("button")}
            data-analytics-id="view-property"
            className="flex h-10 w-full items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
          >
            View Property
          </Link>
        </div>
      </div>
    </article>
  );
}
