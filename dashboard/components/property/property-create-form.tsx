"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import {
  cardClass,
  inputClass,
  labelClass,
  PropertyResponse,
} from "@/dashboard/components/property/types";
import {
  PROPERTY_CATEGORIES,
  PROPERTY_MANAGER_ROLES,
  PROPERTY_STATUSES,
} from "@/dashboard/constants/property";
import { api, getApiErrorMessage } from "@/lib/api";

export function PropertyCreateForm() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const canManage = PROPERTY_MANAGER_ROLES.includes(user?.role ?? "");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const imagesRaw = (formData.get("images") as string)?.trim();
    const images = imagesRaw
      ? imagesRaw.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const payload = {
      title: (formData.get("title") as string)?.trim(),
      description: (formData.get("description") as string)?.trim(),
      images,
      address: (formData.get("address") as string)?.trim(),
      city: (formData.get("city") as string)?.trim(),
      state: (formData.get("state") as string)?.trim(),
      pincode: (formData.get("pincode") as string)?.trim(),
      category: formData.get("category") as string,
      buildingType: (formData.get("buildingType") as string)?.trim(),
      area: (formData.get("area") as string)?.trim(),
      pricePerSqft: (formData.get("pricePerSqft") as string)?.trim(),
      status: formData.get("status") as string,
    };

    try {
      const { data } = await api.post<PropertyResponse>("/api/properties", payload);
      if (!data.success) {
        toast.error(data.message || "Failed to create property");
        setPending(false);
        return;
      }

      toast.success(data.message || "Property created successfully");
      router.push("/dashboard/property");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setPending(false);
    }
  }

  if (!canManage) {
    return (
      <div>
        <PageHeader
          title="Create Property"
          description="Add a new property listing."
        />
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          Seller or Admin access required to create properties.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/property"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Properties
        </Link>
      </div>

      <PageHeader
        title="Create Property"
        description="Add a new property listing for auctions."
      />

      <form onSubmit={handleSubmit} className={cardClass}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className={labelClass}>Title</label>
            <input id="title" name="title" type="text" required className={inputClass} placeholder="3BHK Apartment in Gurgaon" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea id="description" name="description" rows={3} className={inputClass} placeholder="Property details..." />
          </div>
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <select id="category" name="category" required className={inputClass}>
              <option value="">Select category</option>
              {PROPERTY_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className={labelClass}>Status</label>
            <select id="status" name="status" defaultValue="Draft" className={inputClass}>
              {PROPERTY_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="buildingType" className={labelClass}>Building Type</label>
            <input id="buildingType" name="buildingType" type="text" className={inputClass} placeholder="Apartment, Villa, Office..." />
          </div>
          <div>
            <label htmlFor="area" className={labelClass}>Area</label>
            <input id="area" name="area" type="text" className={inputClass} placeholder="1200 sqft" />
          </div>
          <div>
            <label htmlFor="pricePerSqft" className={labelClass}>Price per Sqft</label>
            <input id="pricePerSqft" name="pricePerSqft" type="text" className={inputClass} placeholder="8500" />
          </div>
          <div>
            <label htmlFor="city" className={labelClass}>City</label>
            <input id="city" name="city" type="text" className={inputClass} placeholder="Gurgaon" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address" className={labelClass}>Address</label>
            <input id="address" name="address" type="text" className={inputClass} placeholder="Sector 45, Golf Course Road" />
          </div>
          <div>
            <label htmlFor="state" className={labelClass}>State</label>
            <input id="state" name="state" type="text" className={inputClass} placeholder="Haryana" />
          </div>
          <div>
            <label htmlFor="pincode" className={labelClass}>Pincode</label>
            <input id="pincode" name="pincode" type="text" className={inputClass} placeholder="122003" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="images" className={labelClass}>Image URLs</label>
            <input id="images" name="images" type="text" className={inputClass} placeholder="https://example.com/1.jpg, https://example.com/2.jpg" />
            <p className="mt-1 text-xs text-zinc-500">Comma-separated image URLs</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
          >
            {pending ? "Creating..." : "Create Property"}
          </button>
          <Link
            href="/dashboard/property"
            className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
