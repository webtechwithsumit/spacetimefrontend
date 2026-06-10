"use client";

import type { PropertyFormState } from "@/dashboard/components/property/property-form";
import {
  FormSection,
  NumberInput,
  SelectField,
  TextInput,
} from "@/dashboard/components/ui";
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
      <FormSection title="Property Status">
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
            <TextInput
              id="furnishingOther"
              label="Furnishing details"
              value={form.furnishingOther}
              onChange={(value) => onFieldChange("furnishingOther", value)}
              placeholder="e.g. bare shell"
            />
          )}
        </div>
      </FormSection>
    </div>
  );
}
