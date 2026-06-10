"use client";

import { useMemo } from "react";
import {
  MultiSelectField,
  NumberInput,
} from "@/dashboard/components/property/property-form-fields";
import { PropertySection } from "@/dashboard/components/property/property-section";
import {
  CompactSelectField,
  SelectField,
} from "@/dashboard/components/property/property-select";
import type { PropertyFormState } from "@/dashboard/components/property/property-form";
import { inputClass, labelClass } from "@/dashboard/components/property/types";
import {
  CAR_PARKING_INCLUDED,
  PARKING_TYPES,
  PLOT_AREA_UNITS,
} from "@/dashboard/constants/property";
import {
  formatIndianNumber,
  formatNumericInput,
  plotAreaToSqFt,
} from "@/lib/property-form-utils";

type PropertyPlotFieldsProps = {
  form: PropertyFormState;
  onFieldChange: (field: keyof PropertyFormState, value: string) => void;
  onParkingTypesChange: (types: string[]) => void;
};

export function PropertyPlotFields({
  form,
  onFieldChange,
  onParkingTypesChange,
}: PropertyPlotFieldsProps) {
  const plotSqFt = useMemo(
    () => plotAreaToSqFt(form.plotArea, form.plotAreaUnit),
    [form.plotArea, form.plotAreaUnit],
  );

  return (
    <div className="sm:col-span-2">
      <PropertySection title="Plot & Building Specifications">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="plotArea" className={labelClass}>
              Plot area
            </label>
            <div className="flex overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/50 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-900/50">
              <input
                id="plotArea"
                type="text"
                inputMode="numeric"
                value={form.plotArea}
                onChange={(e) =>
                  onFieldChange("plotArea", formatNumericInput(e.target.value))
                }
                className="w-full border-0 bg-transparent px-3 py-2.5 text-sm outline-none dark:text-white"
                placeholder="500"
              />
              <CompactSelectField
                value={form.plotAreaUnit}
                onChange={(value) => onFieldChange("plotAreaUnit", value)}
                options={PLOT_AREA_UNITS}
              />
            </div>
            {plotSqFt > 0 && (
              <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                = {formatIndianNumber(Math.round(plotSqFt))} sq. ft. (for
                calculations &amp; reports)
              </p>
            )}
          </div>

          <NumberInput
            id="superArea"
            label="Super Area (sq. ft.)"
            value={form.superArea}
            onChange={(value) => onFieldChange("superArea", value)}
            placeholder="40,000"
          />

          <NumberInput
            id="totalCarpetArea"
            label="Total Carpet Area (sq. ft.)"
            value={form.totalCarpetArea}
            onChange={(value) => onFieldChange("totalCarpetArea", value)}
          />

          <div>
            <label htmlFor="floorsOffered" className={labelClass}>
              Floors Offered
            </label>
            <input
              id="floorsOffered"
              type="text"
              value={form.floorsOffered}
              onChange={(e) => onFieldChange("floorsOffered", e.target.value)}
              className={inputClass}
              placeholder="B + G + 4"
            />
          </div>

          <NumberInput
            id="totalFloorsInBuilding"
            label="Total Floors in Building"
            value={form.totalFloorsInBuilding}
            onChange={(value) => onFieldChange("totalFloorsInBuilding", value)}
            placeholder="4"
          />

          <SelectField
            id="carParkingIncluded"
            label="Is Car Parking Included?"
            value={form.carParkingIncluded}
            onChange={(value) => onFieldChange("carParkingIncluded", value)}
            options={CAR_PARKING_INCLUDED}
            placeholder="Select"
          />

          <NumberInput
            id="totalCarParks"
            label="Total Number of Car Parks"
            value={form.totalCarParks}
            onChange={(value) => onFieldChange("totalCarParks", value)}
            placeholder="10"
          />

          <MultiSelectField
            id="parkingTypes"
            label="Parking Type"
            options={PARKING_TYPES}
            selected={form.parkingTypes}
            onChange={onParkingTypesChange}
            placeholder="Select parking type"
          />
        </div>
      </PropertySection>
    </div>
  );
}
