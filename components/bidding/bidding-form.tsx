"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import type { BidProperty } from "@/components/bidding/types";
import { BiddingStatusCard } from "@/components/bidding/bidding-status-card";
import { MessageModal } from "@/components/message-modal";
import { api, getApiErrorMessage } from "@/lib/api";
import { formatBidAmount } from "@/lib/live-auctions";
import {
  formatIndianNumber,
  formatNumericInput,
  parseIndianNumber,
} from "@/lib/property-form-utils";

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
  onBidPlaced?: () => void;
};

type PlaceBidResponse = {
  success: boolean;
  message?: string;
  data?: {
    currentBidAmount: number;
  };
};

type FeedbackModal = {
  open: boolean;
  title: string;
  message: string;
  variant: "error" | "success" | "info";
};

const closedModal: FeedbackModal = {
  open: false,
  title: "",
  message: "",
  variant: "info",
};

export function BiddingForm({ property, onBidPlaced }: BiddingFormProps) {
  const { user, isAuthenticated, isReady } = useAuth();
  const countdown = useCountdown(property.endsAt);
  const [currentBid, setCurrentBid] = useState(property.currentBid);
  const [currentBidAmount, setCurrentBidAmount] = useState(
    property.currentBidAmount ?? 0,
  );
  const [bidAmount, setBidAmount] = useState("");
  const [feedbackModal, setFeedbackModal] = useState(closedModal);
  const [pending, setPending] = useState(false);

  const isOwnProperty = Boolean(
    isAuthenticated &&
      user?._id &&
      property.sellerId &&
      user._id === property.sellerId,
  );
  const isLeadingBidder = Boolean(
    isAuthenticated &&
      user?._id &&
      property.leadingBidderId &&
      user._id === property.leadingBidderId,
  );
  const userLastBidAmount = property.userLastBidAmount ?? 0;
  const hasPreviousBid = userLastBidAmount > 0;
  const isOutbid =
    isAuthenticated && hasPreviousBid && !isLeadingBidder && !isOwnProperty;
  const canBid =
    isAuthenticated && !isOwnProperty && !isLeadingBidder && !countdown.ended;
  const showBidForm =
    isReady && !isOwnProperty && !isLeadingBidder && !countdown.ended;
  const showLeadingStatus = isReady && isAuthenticated && isLeadingBidder;
  const showOutbidStatus = isReady && isOutbid;

  function showFeedback(
    title: string,
    message: string,
    variant: FeedbackModal["variant"],
  ) {
    setFeedbackModal({ open: true, title, message, variant });
  }

  function closeFeedback() {
    setFeedbackModal(closedModal);
  }

  useEffect(() => {
    setCurrentBid(property.currentBid);
    setCurrentBidAmount(property.currentBidAmount ?? 0);
  }, [property.currentBid, property.currentBidAmount, property.leadingBidderId]);

  const increment = parseIndianNumber(property.bidIncrement || "");
  const minimumBid = useMemo(() => {
    const base = currentBidAmount || parseIndianNumber(property.startingBid);
    return increment > 0 ? base + increment : base + 1;
  }, [currentBidAmount, increment, property.startingBid]);

  const quickIncrements = useMemo(() => {
    const options: number[] = [];
    if (increment > 0) {
      options.push(minimumBid, minimumBid + increment, minimumBid + increment * 2);
    } else {
      options.push(minimumBid, minimumBid + 1_000_000, minimumBid + 5_000_000);
    }
    return [...new Set(options)].slice(0, 3);
  }, [increment, minimumBid]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isAuthenticated) {
      showFeedback(
        "Login required",
        "Please log in to place a bid on this property.",
        "info",
      );
      return;
    }

    if (isOwnProperty || isLeadingBidder) {
      return;
    }

    const amount = parseIndianNumber(bidAmount.trim());

    if (!amount) {
      showFeedback(
        "Enter bid amount",
        "Please enter your bid amount before submitting.",
        "error",
      );
      return;
    }

    if (amount < minimumBid) {
      showFeedback(
        "Bid too low",
        `Your bid must be at least ${formatBidAmount(minimumBid)}.`,
        "error",
      );
      return;
    }

    setPending(true);

    try {
      const { data } = await api.post<PlaceBidResponse>(
        `/api/properties/${property.id}/bids`,
        { amount },
      );

      if (!data.success) {
        showFeedback(
          "Bid not placed",
          data.message || "Failed to place bid",
          "error",
        );
        return;
      }

      const nextAmount = data.data?.currentBidAmount ?? amount;
      setCurrentBidAmount(nextAmount);
      setCurrentBid(formatBidAmount(nextAmount));
      setBidAmount("");
      onBidPlaced?.();
      showFeedback(
        "Bid placed",
        `Your bid of ${formatBidAmount(nextAmount)} has been placed successfully!`,
        "success",
      );
    } catch (err) {
      showFeedback(
        "Bid not placed",
        getApiErrorMessage(err, "Failed to place bid"),
        "error",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <MessageModal
        open={feedbackModal.open}
        title={feedbackModal.title}
        message={feedbackModal.message}
        variant={feedbackModal.variant}
        onClose={closeFeedback}
      />

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
        <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
          Current Bid
        </p>
        <p className="text-2xl font-bold text-zinc-900 dark:text-white">
          {currentBid}
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

      {isReady && isAuthenticated && isOwnProperty && (
        <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="size-4"
              >
                <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-indigo-950 dark:text-indigo-200">
                You cannot bid on this property
              </p>
              <p className="mt-1 text-sm leading-relaxed text-indigo-800/90 dark:text-indigo-300/90">
                This is your own listing. Sellers and property owners are not
                allowed to bid on auctions they have listed.
              </p>
            </div>
          </div>
        </div>
      )}

      {showLeadingStatus && (
        <BiddingStatusCard
          variant="leading"
          currentBidAmount={currentBidAmount}
          userLastBidAmount={userLastBidAmount || currentBidAmount}
        />
      )}

      {showOutbidStatus && (
        <BiddingStatusCard
          variant="outbid"
          currentBidAmount={currentBidAmount}
          userLastBidAmount={userLastBidAmount}
        />
      )}

      {isReady && !isAuthenticated && !countdown.ended && (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          <Link href="/login" className="font-semibold underline">
            Log in
          </Link>{" "}
          to place a bid on this property.
        </div>
      )}

      {showBidForm && (
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="bidAmount"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {isOutbid ? "Your New Bid Amount" : "Your Bid Amount"}
          </label>
          <input
            id="bidAmount"
            name="bidAmount"
            type="text"
            inputMode="numeric"
            value={bidAmount}
            onChange={(e) => setBidAmount(formatNumericInput(e.target.value))}
            placeholder={`Min. ${formatBidAmount(minimumBid)}`}
            disabled={!canBid}
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Minimum bid: {formatBidAmount(minimumBid)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickIncrements.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setBidAmount(formatIndianNumber(amount))}
              disabled={!canBid}
              className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400"
            >
              {formatBidAmount(amount)}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={pending || !canBid}
          className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900"
        >
          {countdown.ended
            ? "Auction Ended"
            : isOwnProperty
              ? "Bidding Not Available"
            : !isAuthenticated
              ? "Log in to Bid"
              : pending
                ? "Placing Bid..."
                : isOutbid
                  ? "Place Higher Bid"
                  : "Place Bid"}
        </button>
      </form>
      )}

      {isReady && countdown.ended && !isOwnProperty && !isLeadingBidder && (
        <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          This auction has ended. Bidding is no longer available.
        </div>
      )}

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
    </>
  );
}
