"use client";

import { NumberInput } from "@/dashboard/components/property/property-form-fields";
import { PropertySection } from "@/dashboard/components/property/property-section";
import type { PropertyFormState } from "@/dashboard/components/property/property-form";
import { SelectField } from "@/dashboard/components/property/property-select";
import { inputClass, labelClass } from "@/dashboard/components/property/types";
import {
  CONSTRUCTION_STATUSES,
  FURNISHING_STATUSES,
} from "@/dashboard/constants/property";

type PropertyStatusFieldsProps = {
  form: PropertyFormState;
  onFieldChange: (field: keyof PropertyFormState, value: string) => void;
};

export function PropertyStatusFields({
  form,
  onFieldChange,
}: PropertyStatusFieldsProps) {
  return (
    <div className="sm:col-span-2">
      <PropertySection title="Property Status">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="constructionStatus"
            label="Construction Status"
            value={form.constructionStatus}
            onChange={(value) => onFieldChange("constructionStatus", value)}
            options={CONSTRUCTION_STATUSES}
            placeholder="Select"
          />

          <NumberInput
            id="ageOfProperty"
            label="Age of Property (years)"
            value={form.ageOfProperty}
            onChange={(value) => onFieldChange("ageOfProperty", value)}
            placeholder="1"
          />

          <SelectField
            id="furnishingStatus"
            label="Furnishing Status"
            value={form.furnishingStatus}
            onChange={(value) => onFieldChange("furnishingStatus", value)}
            options={FURNISHING_STATUSES}
            placeholder="Select"
          />

          {form.furnishingStatus === "Others" && (
            <div>
              <label htmlFor="furnishingOther" className={labelClass}>
                Furnishing details
              </label>
              <input
                id="furnishingOther"
                type="text"
                value={form.furnishingOther}
                onChange={(e) =>
                  onFieldChange("furnishingOther", e.target.value)
                }
                className={inputClass}
                placeholder="e.g. bare shell"
              />
            </div>
          )}
        </div>
      </PropertySection>
    </div>
  );
}
