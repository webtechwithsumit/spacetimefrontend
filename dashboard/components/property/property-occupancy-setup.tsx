"use client";

import { FormSection, SelectField } from "@/dashboard/components/ui";
import { OCCUPANCY_STATUSES } from "@/dashboard/constants/property";

type PropertyOccupancySetupProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PropertyOccupancySetup({
  value,
  onChange,
}: PropertyOccupancySetupProps) {
  return (
    <div className="sm:col-span-2">
      <FormSection title="Occupancy Status">
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          Select whether this property is vacant or pre-rented before entering
          property details.
        </p>
        <div className="max-w-sm">
          <SelectField
            id="occupancyStatusSetup"
            label="Occupancy Status"
            value={value}
            onChange={onChange}
            options={OCCUPANCY_STATUSES}
            placeholder="Select occupancy status"
            clearable={false}
          />
        </div>
      </FormSection>
    </div>
  );
}
