"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PROPERTY_CATEGORIES } from "@/dashboard/constants/property";

const POPULAR_CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Chennai",
];

export function HomeHeroSearch() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);
    if (city.trim()) params.set("city", city.trim());
    const query = params.toString();
    router.push(query ? `/auctions?${query}` : "/auctions");
  }

  function searchCity(name: string) {
    router.push(`/auctions?city=${encodeURIComponent(name)}`);
  }

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: "url('/images/home.png')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-indigo-950/65" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:py-32">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
            <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
            Live property auctions across India
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find commercial property.
            <span className="mt-2 block text-indigo-300">Bid with confidence.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Discover office spaces, retail units, and independent buildings on
            India&apos;s trusted live auction platform — built for buyers, sellers,
            and brokers.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-10 rounded-2xl border border-white/10 bg-white p-3 shadow-2xl shadow-black/30 sm:p-4"
        >
          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search city, locality, or property..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none focus:border-indigo-500"
            >
              <option value="">All property types</option>
              {PROPERTY_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="City"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Search auctions
            </button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-300">
          <span className="text-slate-400">Popular:</span>
          {POPULAR_CITIES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => searchCity(name)}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 transition-colors hover:bg-white/15"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeStatsBar() {
  const stats = [
    { label: "Live auctions", value: "Real-time" },
    { label: "Property types", value: "5+" },
    { label: "Coverage", value: "Pan-India" },
    { label: "Platform", value: "Verified listings" },
  ];

  return (
    <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <p className="text-lg font-semibold text-zinc-900 dark:text-white">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomeCategoryBrowse() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Browse by property type
          </h2>
          <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            Commercial assets curated for investors, occupiers, and brokers.
          </p>
        </div>
        <Link
          href="/properties"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all listings →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROPERTY_CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/auctions?category=${encodeURIComponent(category)}`}
            className="group rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-900"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="size-5"
              >
                <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
              </svg>
            </div>
            <h3 className="mt-4 font-medium text-zinc-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
              {category}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">View live auctions →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Search & discover",
    description:
      "Filter by city, category, and locality to find commercial properties that match your goals.",
  },
  {
    title: "Review full details",
    description:
      "Photos, area, pricing, occupancy, auction schedule, and documents — all in one place.",
  },
  {
    title: "Bid live",
    description:
      "Place real-time bids during live auctions and track activity from your dashboard.",
  },
  {
    title: "Close with confidence",
    description:
      "Transparent bidding history and verified sellers help you move faster.",
  },
];

export function HomeHowItWorks() {
  return (
    <section className="bg-zinc-50 py-16 dark:bg-zinc-900/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            How SpaceTime works
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            A simple path from discovery to winning bid — inspired by the best
            property marketplaces.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 font-medium text-zinc-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 pt-4">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-12 text-white sm:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Ready to list or bid?
            </h2>
            <p className="mt-3 text-sm leading-6 text-indigo-100 sm:text-base">
              Join SpaceTime as a buyer, seller, or broker. List properties,
              run live auctions, and reach serious investors nationwide.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition-opacity hover:opacity-90"
            >
              Create free account
            </Link>
            <Link
              href="/auctions"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse auctions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
