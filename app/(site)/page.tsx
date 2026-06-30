import Link from "next/link";
import { LiveAuctionsList } from "@/components/live-auctions-list";
import {
  HomeCategoryBrowse,
  HomeCtaBanner,
  HomeHeroSearch,
  HomeHowItWorks,
  HomeStatsBar,
} from "@/components/site/home-content";

export default function Home() {
  return (
    <main>
      <HomeHeroSearch />
      <HomeStatsBar />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Live Now
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Featured live auctions
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              Properties going under the hammer right now — updated in real time.
            </p>
          </div>
          <Link
            href="/auctions"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
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
          showSearch={false}
          skeletonCount={4}
          gridClassName="sm:grid-cols-2 xl:grid-cols-4"
        />
      </section>

      <HomeCategoryBrowse />
      <HomeHowItWorks />
      <HomeCtaBanner />
    </main>
  );
}
