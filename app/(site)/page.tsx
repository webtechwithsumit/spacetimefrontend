import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { LiveAuctionsList } from "@/components/live-auctions-list";

export default function Home() {
  return (
    <main>
      <PageHeader
        title="SpaceTime"
        description="India's trusted platform for live property auctions. Connect buyers, sellers, and brokers in one seamless marketplace."
      />

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Live Now
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Latest{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                Live Auctions
              </span>
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              Recently added properties going under the hammer right now.
            </p>
          </div>
          <Link
            href="/auctions"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
          >
            View all auctions
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-4"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <LiveAuctionsList
          limit={4}
          sort="latest"
          showPagination={false}
          skeletonCount={4}
          gridClassName="sm:grid-cols-2 xl:grid-cols-4"
        />
      </section>
    </main>
  );
}
