"use client";

import { inputClass, labelClass } from "@/dashboard/components/property/types";
import { formatNumericInput } from "@/lib/property-form-utils";

export { MultiSelectField } from "@/dashboard/components/property/property-select";

const numberInputClass =
  "w-full border-0 bg-transparent px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500";

type NumberInputProps = {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
};

export function NumberInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  readOnly,
  className,
}: NumberInputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        readOnly={readOnly}
        value={value}
        onChange={
          readOnly
            ? undefined
            : (e) => onChange(formatNumericInput(e.target.value))
        }
        className={className ?? inputClass}
        placeholder={placeholder}
      />
    </div>
  );
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  readOnly,
}: {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="flex overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/50 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-900/50 dark:focus-within:border-indigo-400 dark:focus-within:ring-indigo-400/10">
        <span className="flex items-center border-r border-zinc-200 bg-zinc-100 px-3 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
          ₹
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          readOnly={readOnly}
          value={value}
          onChange={
            onChange
              ? (e) => onChange(formatNumericInput(e.target.value))
              : undefined
          }
          className={`${numberInputClass} read-only:text-zinc-500`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
