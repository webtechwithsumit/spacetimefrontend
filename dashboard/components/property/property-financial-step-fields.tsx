"use client";

import { useMemo } from "react";
import type { PropertyFormState } from "@/dashboard/components/property/property-form";
import { CurrencyInput, FormSection } from "@/dashboard/components/ui";
import { calcPricePerSqft } from "@/lib/property-form-utils";

type PropertyFinancialStepFieldsProps = {
  form: PropertyFormState;
  onFieldChange: (field: keyof PropertyFormState, value: string) => void;
};

export function PropertyFinancialStepFields({
  form,
  onFieldChange,
}: PropertyFinancialStepFieldsProps) {
  const autoPricePerSqft = useMemo(
    () =>
      calcPricePerSqft(
        form.totalPrice,
        form.superArea,
        form.totalCarpetArea,
      ),
    [form.totalPrice, form.superArea, form.totalCarpetArea],
  );

  function handleTotalPriceChange(raw: string) {
    onFieldChange("totalPrice", raw);
    const computed = calcPricePerSqft(
      raw,
      form.superArea,
      form.totalCarpetArea,
    );
    if (computed) onFieldChange("pricePerSqft", computed);
  }

  return (
    <div className="sm:col-span-2">
      <FormSection title="Financial Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <CurrencyInput
            id="totalPrice"
            label="Total Price"
            value={form.totalPrice}
            onChange={handleTotalPriceChange}
            placeholder="50,00,00,000"
          />

          <CurrencyInput
            id="pricePerSqft"
            label="Price Per Sq. Ft. [Auto-Calculated]"
            value={form.pricePerSqft || autoPricePerSqft}
            readOnly
          />

          <CurrencyInput
            id="propertyTax"
            label="Property Tax / Municipal Tax"
            value={form.propertyTax}
            onChange={(value) => onFieldChange("propertyTax", value)}
            placeholder="e.g. 50,000"
          />

          <CurrencyInput
            id="estimatedMonthlyMaintenance"
            label="Estimated Monthly Maintenance"
            value={form.estimatedMonthlyMaintenance}
            onChange={(value) =>
              onFieldChange("estimatedMonthlyMaintenance", value)
            }
            placeholder="e.g. 15,000"
          />
        </div>
      </FormSection>
    </div>
  );
}
