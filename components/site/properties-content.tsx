import Link from "next/link";
import { LiveAuctionsList } from "@/components/live-auctions-list";
import { PROPERTY_CATEGORIES } from "@/dashboard/constants/property";

const steps = [
  {
    step: "01",
    title: "Browse listings",
    description:
      "Explore commercial office spaces, retail units, and independent buildings listed on SpaceTime across major Indian cities.",
  },
  {
    step: "02",
    title: "Review full details",
    description:
      "Open any property to see photos, location, carpet area, occupancy status, starting bid, and auction schedule.",
  },
  {
    step: "03",
    title: "Compare & shortlist",
    description:
      "Check price per sq.ft, building type, and micro-market locality to find assets that match your investment goals.",
  },
  {
    step: "04",
    title: "Bid on live auctions",
    description:
      "When an auction is live, register and place your bid in real time. Track every offer from your My Bids dashboard.",
  },
];

const benefits = [
  {
    title: "Commercial focus",
    description:
      "Office spaces, retail shops, and independent commercial buildings — curated for serious investors and occupiers.",
    icon: (
      <>
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
      </>
    ),
  },
  {
    title: "Rich property data",
    description:
      "Each listing includes area, furnishing, parking, approvals, occupancy status, and detailed descriptions.",
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </>
    ),
  },
  {
    title: "Live auction ready",
    description:
      "Properties move from listed to live auction with transparent start/end times and real-time bid tracking.",
    icon: (
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z M12 6v6l4 2" />
    ),
  },
  {
    title: "Verified sellers",
    description:
      "Listings are submitted by registered sellers and brokers, with admin review before going live.",
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

const highlights = [
  "Location — city, state, micro-market locality, and full address",
  "Area & pricing — carpet area, price per sq.ft, and starting bid amount",
  "Building info — category, building type, occupancy, and construction status",
  "Auction details — start/end time, bid increment, and current highest offer",
  "Media & documents — property photos and supporting listing documents",
];

export function PropertiesContent() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-3.5"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
              <path d="M9 22V12h6v10" />
            </svg>
            Property listings
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Property{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              categories
            </span>{" "}
            on SpaceTime
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Commercial real estate listings across India — from office spaces to
            retail and industrial buildings.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROPERTY_CATEGORIES.map((category) => (
            <div
              key={category}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="size-4"
                >
                  <path d="M3 21h18M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
                </svg>
              </span>
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {category}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              How to explore properties
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              From discovery to bidding — everything you need to evaluate a
              property on SpaceTime.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <article
                key={item.step}
                className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {item.step}
                </span>
                <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Why explore on SpaceTime
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Structured listings built for commercial property buyers and investors.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="size-5"
                >
                  {item.icon}
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Live Now
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Properties under{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  live auction
                </span>
              </h2>
              <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
                Currently active listings open for bidding right now.
              </p>
            </div>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
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
            limit={8}
            sort="latest"
            showPagination={false}
            skeletonCount={4}
            gridClassName="sm:grid-cols-2 xl:grid-cols-4"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              What each listing includes
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Every property page on SpaceTime gives you the details needed to
              make an informed decision.
            </p>
            <ul className="mt-6 space-y-4">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-8 dark:border-zinc-800 dark:from-indigo-950/30 dark:via-zinc-950 dark:to-violet-950/20">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Want to list a property?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Sellers and brokers can create listings and launch live auctions
              directly from the SpaceTime dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
              >
                Get Started
              </Link>
              <Link
                href="/sellers"
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
              >
                Learn for Sellers
              </Link>
            </div>
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
              Looking to buy?{" "}
              <Link
                href="/buyers"
                className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
              >
                See how buying works
              </Link>{" "}
              or browse{" "}
              <Link
                href="/auctions"
                className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
              >
                live auctions
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
