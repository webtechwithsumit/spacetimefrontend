import Link from "next/link";
import { notFound } from "next/navigation";
import { BiddingForm } from "@/components/bidding/bidding-form";
import { PropertyGallery } from "@/components/bidding/property-gallery";
import { PropertyTabs } from "@/components/bidding/property-tabs";
import type { BidProperty } from "@/components/bidding/types";

const properties: BidProperty[] = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    ],
    imageAlt: "Grade-A Office Tower in BKC, Mumbai",
    category: "Commercial Office",
    title: "Grade-A Office Tower with Premium Fittings",
    location: "BKC, Mumbai",
    address:
      "Bandra Kurla Complex, G Block, Mumbai, Maharashtra 400051, India",
    area: "12,500 Sq.ft",
    buildingType: "Commercial Office",
    status: "Vacant",
    endsAt: new Date(
      Date.now() + 121 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000,
    ).toISOString(),
    startsAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    currentBid: "₹46.8 Cr",
    startingBid: "₹42 Cr",
    pricePerSqft: "₹37,440 / Sq.ft",
    isLive: true,
    description:
      "Premium Grade-A office space located in the heart of BKC, Mumbai's premier business district. The property features modern infrastructure, high-speed elevators, 24/7 security, and excellent connectivity to the airport and western express highway. Ideal for corporate headquarters or financial services firms.",
    details: [
      { label: "Property Type", value: "Commercial Office" },
      { label: "Total Area", value: "12,500 Sq.ft" },
      { label: "Floor", value: "15th Floor" },
      { label: "Year Built", value: "2018" },
      { label: "Parking", value: "25 Slots" },
      { label: "Starting Bid", value: "₹42 Cr" },
    ],
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
      "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    ],
    imageAlt: "Logistics Hub in Gurgaon",
    category: "Industrial",
    title: "Ready-to-Occupy Industrial Warehouse with High Power Load",
    location: "Gurgaon",
    address: "Sector 37, Pace City II, Gurgaon, Haryana 122001, India",
    area: "31,000 Sq.ft",
    buildingType: "Independent Building (Industrial)",
    status: "Vacant",
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    startsAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    currentBid: "₹28.5 Cr",
    startingBid: "₹25 Cr",
    pricePerSqft: "₹9,193 / Sq.ft",
    isLive: true,
    description:
      "Ready-to-occupy industrial warehouse with high power load capacity, suitable for warehousing, logistics, and manufacturing operations. Features multiple loading docks, wide access roads, and proximity to NH-48.",
    details: [
      { label: "Property Type", value: "Industrial" },
      { label: "Total Area", value: "31,000 Sq.ft" },
      { label: "Power Load", value: "500 KVA" },
      { label: "Loading Docks", value: "4" },
      { label: "Ceiling Height", value: "32 ft" },
      { label: "Starting Bid", value: "₹25 Cr" },
    ],
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      "https://images.unsplash.com/photo-1555529669-2269763671c0?w=800&q=80",
      "https://images.unsplash.com/photo-1567401893414-76b7bdc1f932?w=800&q=80",
    ],
    imageAlt: "High-Street Retail in Bandra",
    category: "Retail",
    title: "High-Street Retail Space on Linking Road",
    location: "Bandra",
    address: "Linking Road, Bandra West, Mumbai, Maharashtra 400050, India",
    area: "2,400 Sq.ft",
    buildingType: "Retail",
    status: "Tenanted",
    endsAt: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000,
    ).toISOString(),
    startsAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    currentBid: "₹18.2 Cr",
    startingBid: "₹15 Cr",
    pricePerSqft: "₹75,833 / Sq.ft",
    isLive: true,
    description:
      "Prime high-street retail space on Linking Road, Bandra. Excellent footfall, strong brand presence, and ideal for fashion, lifestyle, or F&B brands seeking premium visibility.",
    details: [
      { label: "Property Type", value: "Retail" },
      { label: "Total Area", value: "2,400 Sq.ft" },
      { label: "Frontage", value: "40 ft" },
      { label: "Floor", value: "Ground Floor" },
      { label: "Tenant", value: "Fashion Brand" },
      { label: "Starting Bid", value: "₹15 Cr" },
    ],
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
      "https://images.unsplash.com/photo-1464146072230-91cabc968660?w=800&q=80",
    ],
    imageAlt: "Land Parcel in Pune",
    category: "Land",
    title: "Development-Ready Land Parcel near Hinjewadi",
    location: "Pune",
    address: "Hinjewadi Phase 3, Pune, Maharashtra 411057, India",
    area: "2.5 Acres",
    buildingType: "Land",
    status: "Vacant",
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    startsAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    currentBid: "₹12.4 Cr",
    startingBid: "₹10 Cr",
    pricePerSqft: "₹1,13,636 / Sq.ft",
    isLive: true,
    description:
      "Development-ready land parcel near Hinjewadi IT Park. Clear title, approved zoning for commercial development, and excellent connectivity to Mumbai-Bangalore highway.",
    details: [
      { label: "Property Type", value: "Land" },
      { label: "Total Area", value: "2.5 Acres" },
      { label: "Zoning", value: "Commercial" },
      { label: "Road Access", value: "40 ft" },
      { label: "Title", value: "Clear" },
      { label: "Starting Bid", value: "₹10 Cr" },
    ],
  },
];

type BidPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BidPage({ params }: BidPageProps) {
  const { id } = await params;
  const property = properties.find((item) => item.id === id);

  if (!property) {
    notFound();
  }

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
        <span className="text-zinc-900 dark:text-white">Property</span>
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

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <PropertyGallery
          images={property.images}
          alt={property.imageAlt}
          isLive={property.isLive}
        />
        <BiddingForm property={property} />
      </div>

      <PropertyTabs property={property} />
    </main>
  );
}
