"use client";

import { useToast } from "@/components/toast-provider";
import { PropertySection } from "@/dashboard/components/property/property-section";
import type { PropertyFormState } from "@/dashboard/components/property/property-form";
import { SelectField } from "@/dashboard/components/property/property-select";
import { inputClass, labelClass } from "@/dashboard/components/property/types";
import {
  INDIAN_STATES,
  PROPERTY_CATEGORIES,
  PROPERTY_STATUSES,
} from "@/dashboard/constants/property";

type PropertyBasicFieldsProps = {
  form: PropertyFormState;
  onFieldChange: (field: keyof PropertyFormState, value: string) => void;
  categoryOptions?: string[];
  statusOptions?: string[];
  stateOptions?: string[];
};

function optionList(
  current: string,
  defaults: readonly string[],
): string[] {
  const list =
    current && !defaults.includes(current as (typeof defaults)[number])
      ? [current, ...defaults]
      : [...defaults];
  return [...new Set(list)];
}

export function PropertyBasicFields({
  form,
  onFieldChange,
  categoryOptions,
  statusOptions,
  stateOptions,
}: PropertyBasicFieldsProps) {
  const toast = useToast();
  const categories = categoryOptions ?? optionList(form.category, PROPERTY_CATEGORIES);
  const statuses = statusOptions ?? optionList(form.status, PROPERTY_STATUSES);
  const states = stateOptions ?? optionList(form.state, INDIAN_STATES);

  return (
    <div className="space-y-4 sm:col-span-2">
      <PropertySection title="1. Basic & Location Details">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="title" className={labelClass}>
              Property Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={(e) => onFieldChange("title", e.target.value)}
              className={inputClass}
              placeholder="Property title"
            />
          </div>

          <SelectField
            id="category"
            label="Category"
            value={form.category}
            onChange={(value) => onFieldChange("category", value)}
            options={categories}
            placeholder="Select category"
          />

          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="address" className={labelClass}>
              Address &amp; Location
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <textarea
                id="address"
                rows={2}
                value={form.address}
                onChange={(e) => onFieldChange("address", e.target.value)}
                className={`${inputClass} min-h-[42px] flex-1`}
                placeholder="Full address"
              />
              <button
                type="button"
                onClick={() =>
                  toast.success("Location picker will be available in a future update.")
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="size-4"
                >
                  <path d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z" />
                  <circle cx="12" cy="11" r="2.5" />
                </svg>
                Location Picker
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="plotNumber" className={labelClass}>
              Plot Number
            </label>
            <input
              id="plotNumber"
              type="text"
              value={form.plotNumber}
              onChange={(e) => onFieldChange("plotNumber", e.target.value)}
              className={inputClass}
              placeholder="Plot / survey number"
            />
          </div>

          <div>
            <label htmlFor="city" className={labelClass}>
              City
            </label>
            <input
              id="city"
              type="text"
              value={form.city}
              onChange={(e) => onFieldChange("city", e.target.value)}
              className={inputClass}
              placeholder="City"
            />
          </div>

          <SelectField
            id="state"
            label="State"
            value={form.state}
            onChange={(value) => onFieldChange("state", value)}
            options={states}
            placeholder="Select state"
          />

          <div>
            <label htmlFor="pincode" className={labelClass}>
              Pin Code
            </label>
            <input
              id="pincode"
              type="text"
              value={form.pincode}
              onChange={(e) => onFieldChange("pincode", e.target.value)}
              className={inputClass}
              placeholder="122002"
            />
          </div>

          <div>
            <label htmlFor="microMarketLocality" className={labelClass}>
              Micro-Market / Locality
            </label>
            <input
              id="microMarketLocality"
              type="text"
              value={form.microMarketLocality}
              onChange={(e) =>
                onFieldChange("microMarketLocality", e.target.value)
              }
              className={inputClass}
              placeholder="Sector 43"
            />
          </div>

          <div>
            <label htmlFor="buildingName" className={labelClass}>
              Building Name
            </label>
            <input
              id="buildingName"
              type="text"
              value={form.buildingName}
              onChange={(e) => onFieldChange("buildingName", e.target.value)}
              className={inputClass}
              placeholder="Building name"
            />
          </div>

          <div className="lg:col-span-1">
            <label htmlFor="roadName" className={labelClass}>
              Road Name
            </label>
            <input
              id="roadName"
              type="text"
              value={form.roadName}
              onChange={(e) => onFieldChange("roadName", e.target.value)}
              className={inputClass}
              placeholder="Golf Course Road"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => onFieldChange("description", e.target.value)}
              className={inputClass}
              placeholder="Property details..."
            />
          </div>

          <SelectField
            id="status"
            label="Listing Status"
            value={form.status}
            onChange={(value) => onFieldChange("status", value)}
            options={statuses}
            placeholder="Select status"
            clearable={false}
          />
        </div>
      </PropertySection>
    </div>
  );
}
