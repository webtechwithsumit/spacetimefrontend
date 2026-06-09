"use client";

import { useState } from "react";
import type { BidProperty } from "@/components/bidding/types";

type PropertyTabsProps = {
  property: BidProperty;
};

const tabs = ["Property Description", "Property Details", "Data Room"] as const;

export function PropertyTabs({ property }: PropertyTabsProps) {
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>("Property Description");

  return (
    <section className="mt-12">
      <div className="flex gap-8 border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        {activeTab === "Property Description" && (
          <>
            <div className="flex items-center gap-2 bg-indigo-950 px-4 py-3 text-sm font-medium text-white dark:bg-indigo-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="size-4"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 10v4M12 8h.01" />
              </svg>
              Description
            </div>
            <p className="p-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {property.description}
            </p>
          </>
        )}

        {activeTab === "Property Details" && (
          <div className="grid gap-px bg-zinc-200 p-px dark:bg-zinc-800 sm:grid-cols-2">
            {property.details.map((item) => (
              <div
                key={item.label}
                className="flex justify-between bg-white px-5 py-4 dark:bg-zinc-950"
              >
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {item.label}
                </span>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Data Room" && (
          <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Property documents and data room files will be available here.
          </div>
        )}
      </div>
    </section>
  );
}
