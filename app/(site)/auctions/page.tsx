import { LiveAuctionsList } from "@/components/live-auctions-list";

export default function AuctionsPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-20">
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-3.5"
            >
              <path d="M14 10l-2 6M10 10l2 6M6 6h12l-1 14H7L6 6Z" />
            </svg>
            Under the hammer
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Live{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Auctions
            </span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            Bid in real-time on commercial properties as they go under the
            hammer.
          </p>
        </div>

        <LiveAuctionsList gridClassName="sm:grid-cols-2 xl:grid-cols-4" />
      </section>
    </main>
  );
}
