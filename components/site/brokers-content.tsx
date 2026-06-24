import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Join as a broker",
    description:
      "Register with broker access on SpaceTime. Build your profile and connect with sellers and buyers on one platform.",
  },
  {
    step: "02",
    title: "List client properties",
    description:
      "Create and manage property listings on behalf of clients — photos, details, auction schedule, and pricing.",
  },
  {
    step: "03",
    title: "Drive live auctions",
    description:
      "Get client properties in front of verified buyers during live auction windows with real-time competitive bidding.",
  },
  {
    step: "04",
    title: "Bid & track deals",
    description:
      "Brokers can also bid on behalf of clients. Use My Bids in the dashboard to monitor every active offer.",
  },
];

const benefits = [
  {
    title: "One platform for all roles",
    description:
      "List properties for sellers and place bids for buyers — manage both sides of the deal from a single account.",
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    title: "Grow your pipeline",
    description:
      "Live auctions attract serious buyers faster than traditional listings, helping you close deals quicker.",
    icon: (
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    ),
  },
  {
    title: "Transparent for clients",
    description:
      "Every bid is visible in real time. Share auction progress with clients confidently — no hidden steps.",
    icon: (
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    ),
  },
  {
    title: "Admin-ready listings",
    description:
      "Work with SpaceTime admins on property approval, broker assignment, and auction configuration when needed.",
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

const tips = [
  "Complete every listing with accurate specs — buyers decide based on the property page.",
  "Coordinate auction timing with your client so they are ready when bidding opens.",
  "Use My Bids to track client offers and respond quickly when outbid.",
  "You cannot bid on properties you have listed yourself — assign a separate buyer account if needed.",
];

export function BrokersContent() {
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
            For property brokers
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            How brokering on{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              SpaceTime
            </span>{" "}
            works
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Connect sellers with buyers through live auctions — list, manage, and
            bid all from one professional dashboard.
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
              Why brokers choose SpaceTime
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              Tools built for professionals who manage listings and bids on
              behalf of clients.
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
              Tips for brokers
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Make the most of SpaceTime for your clients and your business.
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
              Ready to partner with SpaceTime?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Register as a broker, list client properties, and start participating
              in live auctions today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-900"
              >
                Register as Broker
              </Link>
              <Link
                href="/auctions"
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
              >
                View Live Auctions
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
              to manage properties and My Bids from your dashboard.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
