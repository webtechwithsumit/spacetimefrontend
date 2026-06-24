import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Register as a seller",
    description:
      "Create your SpaceTime account with seller access. Add your contact details and verify your profile to get started.",
  },
  {
    step: "02",
    title: "List your property",
    description:
      "Add property details, photos, location, starting bid, and auction schedule through the dashboard listing wizard.",
  },
  {
    step: "03",
    title: "Go live at auction",
    description:
      "Once approved, your property appears in live auctions. Verified buyers compete in real time during the auction window.",
  },
  {
    step: "04",
    title: "Close with the highest bid",
    description:
      "When the auction ends, the leading bidder wins. Track bids and auction status from your seller dashboard.",
  },
];

const benefits = [
  {
    title: "Maximum exposure",
    description:
      "Your listing reaches active buyers browsing live auctions — no cold outreach or scattered enquiries.",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
        <path d="M2 12h20" />
      </>
    ),
  },
  {
    title: "Market-driven price",
    description:
      "Competitive bidding helps you discover the true market value instead of relying on a single fixed asking price.",
    icon: (
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    ),
  },
  {
    title: "Full listing control",
    description:
      "Manage photos, descriptions, auction dates, starting bid, and increments from one dashboard.",
    icon: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </>
    ),
  },
  {
    title: "Verified buyer pool",
    description:
      "Only registered buyers can bid on your property, keeping the process professional and accountable.",
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

const tips = [
  "Upload clear photos and complete property details — buyers review everything before bidding.",
  "Set a realistic starting bid and increment to attract early participation.",
  "Choose auction start and end times that give buyers enough window to compete.",
  "You cannot bid on your own listing — SpaceTime keeps seller and buyer roles separate.",
];

export function SellersContent() {
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
            For property sellers
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            How selling on{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              SpaceTime
            </span>{" "}
            works
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            List once, reach verified buyers, and let live competition determine
            the best price for your property.
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
              Why sellers choose SpaceTime
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              A faster, fairer way to sell property with full visibility into
              buyer interest.
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
              Listing tips for sellers
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Set up your auction for success with these best practices.
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
              Ready to list your property?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Register as a seller, create your first listing, and launch a
              live auction from your dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
              >
                Register as Seller
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
              >
                Go to Dashboard
              </Link>
            </div>
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
              Already registered?{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
              >
                Log in
              </Link>{" "}
              to manage listings from Property in your dashboard.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
