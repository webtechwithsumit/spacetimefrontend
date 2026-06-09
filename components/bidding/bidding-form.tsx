"use client";

import { FormEvent, useEffect, useState } from "react";
import type { BidProperty } from "@/components/bidding/types";

type Countdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  ended: boolean;
};

function useCountdown(endsAt: string): Countdown {
  const [countdown, setCountdown] = useState<Countdown>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    ended: false,
  });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(endsAt).getTime() - Date.now();

      if (diff <= 0) {
        setCountdown({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          ended: true,
        });
        return;
      }

      setCountdown({
        days: String(Math.floor(diff / 86400000)),
        hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
        minutes: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        seconds: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
        ended: false,
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return countdown;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

type BiddingFormProps = {
  property: BidProperty;
};

export function BiddingForm({ property }: BiddingFormProps) {
  const countdown = useCountdown(property.endsAt);
  const [bidAmount, setBidAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setPending(true);

    const amount = bidAmount.trim();

    if (!amount) {
      setError("Please enter your bid amount");
      setPending(false);
      return;
    }

    setMessage(`Your bid of ${amount} has been placed successfully!`);
    setBidAmount("");
    setPending(false);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
          {property.area}
        </span>
        <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
          {property.buildingType}
        </span>
        <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
          {property.status}
        </span>
      </div>

      <h1 className="mt-4 text-xl font-bold leading-snug text-zinc-900 dark:text-white sm:text-2xl">
        {property.title}
      </h1>

      <p className="mt-3 flex items-start gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="mt-0.5 size-4 shrink-0"
        >
          <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        {property.address}
      </p>

      <div className="mt-5 rounded-lg bg-zinc-100 px-4 py-4 dark:bg-zinc-900">
        <p className="text-2xl font-bold text-zinc-900 dark:text-white">
          {property.currentBid}
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {property.pricePerSqft}
        </p>
      </div>

      <div className="mt-5 rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900 dark:text-indigo-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-4"
          >
            <path d="M14 10l-2 6M10 10l2 6M6 6h12l-1 14H7L6 6Z" />
          </svg>
          Auction Details
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Auction Start</p>
            <p className="mt-1 font-medium text-zinc-900 dark:text-white">
              {formatDate(property.startsAt)}
            </p>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Auction End</p>
            <p className="mt-1 font-medium text-zinc-900 dark:text-white">
              {formatDate(property.endsAt)}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Time left</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[
            { label: "d", value: countdown.days },
            { label: "h", value: countdown.hours },
            { label: "m", value: countdown.minutes },
            { label: "s", value: countdown.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-indigo-200 bg-white px-2 py-3 text-center dark:border-indigo-900/50 dark:bg-zinc-950"
            >
              <p className="text-lg font-bold text-zinc-900 tabular-nums dark:text-white">
                {item.value}
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="bidAmount"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Your Bid Amount
          </label>
          <input
            id="bidAmount"
            name="bidAmount"
            type="text"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`Min. above ${property.currentBid}`}
            disabled={countdown.ended}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["+0.5 Cr", "+1 Cr", "+2 Cr"].map((increment) => (
            <button
              key={increment}
              type="button"
              onClick={() => setBidAmount(increment.replace("+", ""))}
              className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400"
            >
              {increment}
            </button>
          ))}
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </p>
        )}

        {message && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || countdown.ended}
          className="w-full rounded-lg bg-zinc-900 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
        >
          {countdown.ended
            ? "Auction Ended"
            : pending
              ? "Placing Bid..."
              : "Place Bid"}
        </button>
      </form>

      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-5 text-red-500"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM8 18v-2h8v2H8Zm0-4v-2h5v2H8Zm6-8V4h2v6h-6V6h4Z" />
        </svg>
        Download Flyer (PDF)
      </button>
    </div>
  );
}
