"use client";

import { useToast } from "@/components/toast-provider";
import type { PropertyFormState } from "@/dashboard/components/property/property-form";
import {
  FormSection,
  SelectField,
  TextareaInput,
  TextInput,
  withCurrentOption,
} from "@/dashboard/components/ui";
import { inputClass } from "@/dashboard/components/ui/form-styles";
import { INDIAN_STATES, PROPERTY_CATEGORIES } from "@/dashboard/constants/property";

type PropertyBasicFieldsProps = {
  form: PropertyFormState;
  onFieldChange: (field: keyof PropertyFormState, value: string) => void;
  categoryOptions?: string[];
  stateOptions?: string[];
};

export function PropertyBasicFields({
  form,
  onFieldChange,
  categoryOptions,
  stateOptions,
}: PropertyBasicFieldsProps) {
  const toast = useToast();
  const categories =
    categoryOptions ?? withCurrentOption(form.category, PROPERTY_CATEGORIES);
  const states = stateOptions ?? withCurrentOption(form.state, INDIAN_STATES);

  return (
    <div className="space-y-4 sm:col-span-2">
      <FormSection title="Category & Status">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="category"
            label="Category"
            value={form.category}
            onChange={(value) => onFieldChange("category", value)}
            options={categories}
            placeholder="Select category"
          />

          <TextInput
            id="occupancyStatus"
            label="Occupancy Status"
            value={form.occupancyStatus}
            readOnly
            placeholder="Set in previous step"
          />
        </div>
      </FormSection>

      <FormSection title="1. Basic & Location Details">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TextInput
            id="title"
            label="Property Title"
            required
            value={form.title}
            onChange={(value) => onFieldChange("title", value)}
            placeholder="Property title"
          />

          <div className="sm:col-span-2 lg:col-span-3">
            <label
              htmlFor="address"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
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
                  toast.success(
                    "Location picker will be available in a future update.",
                  )
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

          <TextInput
            id="plotNumber"
            label="Plot Number"
            value={form.plotNumber}
            onChange={(value) => onFieldChange("plotNumber", value)}
            placeholder="Plot / survey number"
          />

          <TextInput
            id="city"
            label="City"
            value={form.city}
            onChange={(value) => onFieldChange("city", value)}
            placeholder="City"
          />

          <SelectField
            id="state"
            label="State"
            value={form.state}
            onChange={(value) => onFieldChange("state", value)}
            options={states}
            placeholder="Select state"
          />

          <TextInput
            id="pincode"
            label="Pin Code"
            value={form.pincode}
            onChange={(value) => onFieldChange("pincode", value)}
            placeholder="122002"
          />

          <TextInput
            id="microMarketLocality"
            label="Micro-Market / Locality"
            value={form.microMarketLocality}
            onChange={(value) => onFieldChange("microMarketLocality", value)}
            placeholder="Sector 43"
          />

          <TextInput
            id="buildingName"
            label="Building Name"
            value={form.buildingName}
            onChange={(value) => onFieldChange("buildingName", value)}
            placeholder="Building name"
          />

          <TextInput
            id="roadName"
            label="Road Name"
            value={form.roadName}
            onChange={(value) => onFieldChange("roadName", value)}
            placeholder="Golf Course Road"
          />

          <div className="sm:col-span-2">
            <TextareaInput
              id="description"
              label="Description"
              value={form.description}
              onChange={(value) => onFieldChange("description", value)}
              placeholder="Property details..."
            />
          </div>
        </div>
      </FormSection>
    </div>
  );
}
