import Link from "next/link";
import { PropertyPageContent } from "@/components/bidding/property-page-content";

type PropertyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AuctionPropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <nav className="mb-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-zinc-900 dark:hover:text-white">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/auctions"
          className="hover:text-zinc-900 dark:hover:text-white"
        >
          Auctions
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900 dark:text-white">Property Details</span>
      </nav>

      <Link
        href="/auctions"
        className="mb-8 inline-flex items-center gap-2 rounded-lg border border-indigo-500 px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="size-4"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Auctions
      </Link>

      <PropertyPageContent propertyId={id} />
    </main>
  );
}
