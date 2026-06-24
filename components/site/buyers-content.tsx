import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Create your account",
    description:
      "Register as a buyer with your email and phone. One account gives you access to all live auctions on SpaceTime.",
  },
  {
    step: "02",
    title: "Explore live auctions",
    description:
      "Browse commercial, residential, and land listings. Review property details, photos, and starting bid before you commit.",
  },
  {
    step: "03",
    title: "View property & place bid",
    description:
      "Open the full property page, check location and specs, then place your bid in real time. Minimum increments keep bidding fair.",
  },
  {
    step: "04",
    title: "Track from My Bids",
    description:
      "See every property you've bid on, your highest offer, and whether you're leading or have been outbid — all in your dashboard.",
  },
];

const benefits = [
  {
    title: "Transparent pricing",
    description:
      "Every bid is visible in real time. No hidden negotiations — you always know the current highest offer.",
    icon: (
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    ),
  },
  {
    title: "Fair competition",
    description:
      "Auctions run with clear start and end times. Bid increments are fixed so every buyer competes on equal terms.",
    icon: (
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z M12 6v6l4 2" />
    ),
  },
  {
    title: "Live bid status",
    description:
      "Know instantly if you're the leading bidder or need to raise your offer. Outbid alerts help you stay in the race.",
    icon: (
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    ),
  },
  {
    title: "Verified listings",
    description:
      "Properties are listed by registered sellers and brokers. Review full details before placing any bid.",
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

const tips = [
  "Always review the full property page before bidding — location, area, and auction end time matter.",
  "Your bid must meet the minimum increment above the current highest offer.",
  "If you're already the leading bidder, you cannot place another bid until someone outbids you.",
  "Use My Bids in your dashboard to track all active and past bids in one place.",
];

export function BuyersContent() {
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            For property buyers
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            How buying on{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              SpaceTime
            </span>{" "}
            works
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            From registration to closing your winning bid — a simple, transparent
            process built for serious buyers.
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
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Why buyers choose SpaceTime
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              Live auctions designed to give you clarity, control, and confidence
              at every step.
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Bidding tips for buyers
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Get the most out of live auctions with these quick guidelines.
            </p>
            <ul className="mt-6 space-y-4">
              {tips.map((tip) => (
                <li
                  key={tip}
                  className="flex gap-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-8 dark:border-zinc-800 dark:from-indigo-950/30 dark:via-zinc-950 dark:to-violet-950/20">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Ready to start bidding?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Create a free buyer account, explore live auctions, and place your
              first bid in minutes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
              >
                Register as Buyer
              </Link>
              <Link
                href="/auctions"
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
              >
                Browse Live Auctions
              </Link>
            </div>
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
              >
                Log in
              </Link>{" "}
              to view My Bids in your dashboard.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
