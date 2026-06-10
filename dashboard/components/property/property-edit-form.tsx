"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/toast-provider";
import { PageHeader } from "@/dashboard/components/page-header";
import {
  canEditProperty,
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

const emptyForm = {
  title: "",
  description: "",
  images: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  category: "",
  buildingType: "",
  area: "",
  pricePerSqft: "",
  status: "",
};

function categoryOptions(current: string) {
  if (current && !PROPERTY_CATEGORIES.includes(current as (typeof PROPERTY_CATEGORIES)[number])) {
    return [current, ...PROPERTY_CATEGORIES];
  }
  return [...PROPERTY_CATEGORIES];
}

function statusOptions(current: string) {
  if (current && !PROPERTY_STATUSES.includes(current as (typeof PROPERTY_STATUSES)[number])) {
    return [current, ...PROPERTY_STATUSES];
  }
  return [...PROPERTY_STATUSES];
}

type PropertyEditFormProps = {
  propertyId: string;
};

export function PropertyEditForm({ propertyId }: PropertyEditFormProps) {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState(emptyForm);
  const [sellerId, setSellerId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  const canEdit = canEditProperty(user?.role, user?._id, sellerId || undefined);

  const fetchProperty = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const { data } = await api.get<PropertyResponse>(`/api/properties/${propertyId}`);
      if (!data.success || !data.data) {
        toast.error(data.message || "Failed to load property");
        return;
      }

      const property = data.data;
      const ownerId =
        typeof property.sellerId === "string"
          ? property.sellerId
          : property.sellerId?._id ?? "";

      setSellerId(ownerId);
      setForm({
        title: property.title ?? "",
        description: property.description ?? "",
        images: (property.images ?? []).join(", "),
        address: property.address ?? "",
        city: property.city ?? "",
        state: property.state ?? "",
        pincode: property.pincode ?? "",
        category: property.category ?? "",
        buildingType: property.buildingType ?? "",
        area: property.area ?? "",
        pricePerSqft: property.pricePerSqft ?? "",
        status: property.status ?? "",
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, propertyId, toast]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const images = form.images
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      images,
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      category: form.category.trim(),
      buildingType: form.buildingType.trim(),
      area: form.area.trim(),
      pricePerSqft: form.pricePerSqft.trim(),
      status: form.status.trim(),
    };

    try {
      const { data } = await api.put<PropertyResponse>(
        `/api/properties/${propertyId}`,
        payload,
      );

      if (!data.success) {
        toast.error(data.message || "Failed to update property");
        setPending(false);
        return;
      }

      toast.success(data.message || "Property updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  if (!PROPERTY_MANAGER_ROLES.includes(user?.role ?? "")) {
    return (
      <div>
        <PageHeader title="Edit Property" description="Update property listing details." />
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          Seller or Admin access required to edit properties.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Edit Property" description="Update property listing details." />
        <div className={`${cardClass} h-96 animate-pulse`} />
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div>
        <div className="mb-6">
          <Link href="/dashboard/property" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to Properties
          </Link>
        </div>
        <PageHeader title="Edit Property" description="Update property listing details." />
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          You can only edit properties that you own.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/property" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Properties
        </Link>
      </div>

      <PageHeader title="Edit Property" description="Update title, location, category, status, and images." />

      <form onSubmit={handleSubmit} className={cardClass}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className={labelClass}>Title</label>
            <input id="title" type="text" required value={form.title} onChange={(e) => updateField("title", e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea id="description" rows={3} value={form.description} onChange={(e) => updateField("description", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="category" className={labelClass}>Category</label>
            <select id="category" required value={form.category} onChange={(e) => updateField("category", e.target.value)} className={inputClass}>
              <option value="">Select category</option>
              {categoryOptions(form.category).map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className={labelClass}>Status</label>
            <select id="status" value={form.status} onChange={(e) => updateField("status", e.target.value)} className={inputClass}>
              <option value="">Select status</option>
              {statusOptions(form.status).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="buildingType" className={labelClass}>Building Type</label>
            <input id="buildingType" type="text" value={form.buildingType} onChange={(e) => updateField("buildingType", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="area" className={labelClass}>Area</label>
            <input id="area" type="text" value={form.area} onChange={(e) => updateField("area", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="pricePerSqft" className={labelClass}>Price per Sqft</label>
            <input id="pricePerSqft" type="text" value={form.pricePerSqft} onChange={(e) => updateField("pricePerSqft", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="city" className={labelClass}>City</label>
            <input id="city" type="text" value={form.city} onChange={(e) => updateField("city", e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address" className={labelClass}>Address</label>
            <input id="address" type="text" value={form.address} onChange={(e) => updateField("address", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="state" className={labelClass}>State</label>
            <input id="state" type="text" value={form.state} onChange={(e) => updateField("state", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="pincode" className={labelClass}>Pincode</label>
            <input id="pincode" type="text" value={form.pincode} onChange={(e) => updateField("pincode", e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="images" className={labelClass}>Image URLs</label>
            <input id="images" type="text" value={form.images} onChange={(e) => updateField("images", e.target.value)} className={inputClass} placeholder="https://example.com/1.jpg, https://example.com/2.jpg" />
            <p className="mt-1 text-xs text-zinc-500">Comma-separated image URLs</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" disabled={pending} className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-zinc-900">
            {pending ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/dashboard/property" className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
