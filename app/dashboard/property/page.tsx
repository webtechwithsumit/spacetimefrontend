import { Suspense } from "react";
import { PropertyList } from "@/dashboard/components/property/property-list";

export default function PropertyPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-zinc-500 dark:text-zinc-400">Loading properties...</p>
        </div>
      }
    >
      <PropertyList />
    </Suspense>
  );
}
