import Link from "next/link";

const stats = [
  { label: "Cities covered", value: "6+" },
  { label: "Property categories", value: "Office, Retail & more" },
  { label: "User roles", value: "Buyers, Sellers, Brokers" },
  { label: "Auction model", value: "Live & transparent" },
];

const values = [
  {
    title: "Transparency",
    description:
      "Every live auction shows real-time bids, clear timings, and fixed increments — so everyone competes on equal terms.",
  },
  {
    title: "Trust",
    description:
      "Listings come from verified sellers and brokers. KYC, documents, and property details help you decide with confidence.",
  },
  {
    title: "Access",
    description:
      "Whether you are buying your first office space or selling a portfolio asset, SpaceTime connects you to the right audience across India.",
  },
  {
    title: "Support",
    description:
      "Our team and community resources help you through registration, bidding, and post-auction queries.",
  },
];

const offerings = [
  {
    title: "For buyers",
    description:
      "Browse live commercial auctions, review full property details, and bid in real time from your dashboard.",
    href: "/buyers",
    cta: "Learn about buying",
  },
  {
    title: "For sellers",
    description:
      "List properties, set auction terms, and reach serious buyers through a structured live bidding process.",
    href: "/sellers",
    cta: "Learn about selling",
  },
  {
    title: "For brokers",
    description:
      "Manage listings on behalf of clients, monitor live bids, and participate where broker bidding is enabled.",
    href: "/brokers",
    cta: "Learn about brokers",
  },
];

export function AboutContent() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              Who we are
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              India&apos;s platform for{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                live property auctions
              </span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              SpaceTime is a commercial property auction platform built for buyers,
              sellers, and brokers across India. We bring office spaces, retail
              units, and independent buildings to a single marketplace where deals
              happen through open, time-bound live bidding — not opaque back-room
              negotiations.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Our mission is simple: make commercial real estate discovery and
              transaction more transparent, faster, and accessible. From Mumbai to
              Bengaluru, Hyderabad to Delhi, we help serious participants find the
              right property at the right price.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-8 dark:border-zinc-800 dark:from-indigo-950/30 dark:via-zinc-950 dark:to-violet-950/20">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              At a glance
            </h3>
            <dl className="mt-6 space-y-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-4 border-b border-zinc-200/80 pb-4 last:border-0 last:pb-0 dark:border-zinc-800"
                >
                  <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.label}
                  </dt>
                  <dd className="text-right text-sm font-medium text-zinc-900 dark:text-white">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              What we stand for
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              SpaceTime is designed around clarity, fairness, and support for every
              participant in the auction process.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
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
        <div className="mb-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Built for everyone in the deal
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            One platform, three roles — each with tools tailored to how you
            participate in commercial property auctions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {offerings.map((item) => (
            <article
              key={item.title}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                {item.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-900 px-8 py-10 text-white dark:border-zinc-800">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Get in touch
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                Have questions about listings, bidding, or your account? Our
                support team is here to help. Raise a ticket and we will get back
                to you as soon as possible.
              </p>
              <p className="mt-4 text-sm text-zinc-400">
                Email:{" "}
                <a
                  href="mailto:support@spacetime.com.co"
                  className="text-indigo-300 hover:text-indigo-200"
                >
                  support@spacetime.com.co
                </a>
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/support"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-opacity hover:opacity-90"
              >
                Contact support
              </Link>
              <Link
                href="/auctions"
                className="inline-flex items-center justify-center rounded-full border border-zinc-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-zinc-400"
              >
                Browse auctions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
