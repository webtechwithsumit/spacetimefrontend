export const UPCOMING_AUCTION_DAYS = 10;

export type AuctionStage = "live" | "ended" | "upcoming" | "other";

type AuctionStageInput = {
  auctionStatus?: string;
  auctionStartDateTime?: string;
  auctionEndDateTime?: string;
};

export function isPropertyLive(property: AuctionStageInput) {
  return resolveAuctionStage(property) === "live";
}

export function resolveAuctionStage(property: AuctionStageInput): AuctionStage {
  const now = Date.now();
  const end = property.auctionEndDateTime
    ? new Date(property.auctionEndDateTime).getTime()
    : null;
  const start = property.auctionStartDateTime
    ? new Date(property.auctionStartDateTime).getTime()
    : null;

  if (property.auctionStatus === "Ended") {
    return "ended";
  }

  if (property.auctionStatus === "Live") {
    if (end !== null && !Number.isNaN(end) && end <= now) {
      return "ended";
    }
    if (start !== null && !Number.isNaN(start) && start > now) {
      return "other";
    }
    return "live";
  }

  const upcomingCutoff = now + UPCOMING_AUCTION_DAYS * 24 * 60 * 60 * 1000;
  if (start && start > now && start <= upcomingCutoff) {
    return "upcoming";
  }

  return "other";
}

export function auctionStageLabel(stage: AuctionStage) {
  if (stage === "live") return "Live";
  if (stage === "ended") return "Ended";
  if (stage === "upcoming") return "Upcoming";
  return "—";
}

export function auctionStageClass(stage: AuctionStage) {
  if (stage === "live") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if (stage === "ended") {
    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
  }
  if (stage === "upcoming") {
    return "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300";
  }
  return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
}
