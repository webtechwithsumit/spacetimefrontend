import { AuctionCard } from "@/components/auction-card";
import type { Auction } from "@/components/auction-card";

const liveAuctions: Auction[] = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    imageAlt: "Grade-A Office Tower in BKC, Mumbai",
    category: "Commercial Office",
    title: "Grade-A Office Tower",
    location: "BKC, Mumbai",
    endsAt: new Date(
      Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
    ).toISOString(),
    currentBid: "₹46.8 Cr",
    startingBid: "₹42 Cr",
    isLive: true,
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    imageAlt: "Logistics Hub in Gurgaon",
    category: "Industrial",
    title: "Logistics Hub",
    location: "Gurgaon",
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    currentBid: "₹28.5 Cr",
    startingBid: "₹25 Cr",
    isLive: true,
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    imageAlt: "High-Street Retail in Bandra",
    category: "Retail",
    title: "High-Street Retail",
    location: "Bandra",
    endsAt: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000,
    ).toISOString(),
    currentBid: "₹18.2 Cr",
    startingBid: "₹15 Cr",
    isLive: true,
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    imageAlt: "Land Parcel in Pune",
    category: "Land",
    title: "Land Parcel",
    location: "Pune",
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    currentBid: "₹12.4 Cr",
    startingBid: "₹10 Cr",
    isLive: true,
  },
];

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

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {liveAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </section>
    </main>
  );
}
