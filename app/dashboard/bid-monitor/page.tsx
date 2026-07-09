import { Suspense } from "react";
import { LiveBidMonitor } from "@/dashboard/components/live-bid-monitor";

export default function BidMonitorPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-zinc-500 dark:text-zinc-400">Loading bid monitor...</p>
        </div>
      }
    >
      <LiveBidMonitor />
    </Suspense>
  );
}
