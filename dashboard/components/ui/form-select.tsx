"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { labelClass } from "@/dashboard/components/ui/form-styles";
import { CheckIcon, ChevronIcon } from "@/dashboard/icons/nav-icons";

const triggerClass =
  "flex w-full min-h-[42px] items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-left text-sm outline-none transition-all dark:border-zinc-700 dark:bg-zinc-900/50";

const triggerOpenClass =
  "border-indigo-500 ring-4 ring-indigo-500/10 dark:border-indigo-400 dark:ring-indigo-400/10";

const dropdownPanelClass =
  "fixed z-[9999] max-h-60 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg shadow-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-950 dark:shadow-none";

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

function useClickOutside(
  triggerRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  onClose: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;

    function handlePointer(event: MouseEvent) {
      const target = event.target as Node;
      const inside =
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target);
      if (!inside) onClose();
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [triggerRef, panelRef, onClose, enabled]);
}

function useDropdownPosition(
  triggerRef: RefObject<HTMLElement | null>,
  open: boolean,
  align: "left" | "right" = "left",
  minWidth = 0,
) {
  const [position, setPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: 0,
  });

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const width = Math.max(rect.width, minWidth);
    const left =
      align === "right" ? rect.right - width : rect.left;

    setPosition({
      top: rect.bottom + 4,
      left,
      width,
    });
  }, [triggerRef, align, minWidth]);

  useEffect(() => {
    if (!open) return;
    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  return position;
}

function DropdownPortal({
  open,
  triggerRef,
  panelRef,
  align = "left",
  minWidth = 0,
  children,
}: {
  open: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  align?: "left" | "right";
  minWidth?: number;
  children: ReactNode;
}) {
  const position = useDropdownPosition(triggerRef, open, align, minWidth);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={panelRef}
      className={dropdownPanelClass}
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }
      }}
      className="shrink-0 cursor-pointer rounded-md p-0.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      aria-label="Clear selection"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-4"
      >
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
      </svg>
    </span>
  );
}

type SelectFieldProps = {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  clearable?: boolean;
  searchable?: boolean;
};

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  clearable = true,
  searchable,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const showSearch = searchable ?? options.length > 8;

  const filteredOptions = useMemo(() => {
    if (!showSearch || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((option) => option.toLowerCase().includes(q));
  }, [options, query, showSearch]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useClickOutside(triggerRef, panelRef, close, open);

  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
        className={`${triggerClass} ${open ? triggerOpenClass : "hover:border-zinc-300 dark:hover:border-zinc-600"}`}
      >
        <span
          className={`min-w-0 flex-1 truncate ${value ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500"}`}
        >
          {value || placeholder}
        </span>
        {clearable && value && <ClearButton onClick={() => onChange("")} />}
        <ChevronIcon className="size-4 shrink-0 text-zinc-400" open={open} />
      </button>

      <DropdownPortal
        open={open}
        triggerRef={triggerRef}
        panelRef={panelRef}
      >
        {showSearch && (
          <div className="border-b border-zinc-100 p-2 dark:border-zinc-800">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        <ul
          id={listboxId}
          role="listbox"
          className="max-h-52 overflow-y-auto py-1"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-3 py-2 text-sm text-zinc-400">No options found</li>
          ) : (
            filteredOptions.map((option) => {
              const selected = value === option;
              return (
                <li key={option} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option);
                      close();
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                      selected
                        ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                        : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <span className="truncate">{option}</span>
                    {selected && (
                      <CheckIcon className="size-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </DropdownPortal>
    </div>
  );
}

type MultiSelectFieldProps = {
  id: string;
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export function MultiSelectField({
  id,
  label,
  options,
  selected,
  onChange,
  placeholder = "Select options",
}: MultiSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const close = useCallback(() => setOpen(false), []);

  useClickOutside(triggerRef, panelRef, close, open);

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
      return;
    }
    onChange([...selected, value]);
  }

  function remove(value: string) {
    onChange(selected.filter((item) => item !== value));
  }

  return (
    <div className="relative">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>

      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
        className={`${triggerClass} ${open ? triggerOpenClass : "hover:border-zinc-300 dark:hover:border-zinc-600"}`}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {selected.length === 0 ? (
            <span className="text-zinc-400 dark:text-zinc-500">{placeholder}</span>
          ) : (
            selected.map((item) => (
              <span
                key={item}
                className="inline-flex max-w-full items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                <span className="truncate">{item}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(item);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      remove(item);
                    }
                  }}
                  className="cursor-pointer text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  aria-label={`Remove ${item}`}
                >
                  ×
                </span>
              </span>
            ))
          )}
        </div>
        {selected.length > 0 && <ClearButton onClick={() => onChange([])} />}
        <ChevronIcon className="size-4 shrink-0 text-zinc-400" open={open} />
      </button>

      <DropdownPortal
        open={open}
        triggerRef={triggerRef}
        panelRef={panelRef}
      >
        <ul id={listboxId} role="listbox" className="max-h-52 overflow-y-auto py-1">
          {options.map((option) => {
            const checked = selected.includes(option);
            return (
              <li key={option} role="option" aria-selected={checked}>
                <button
                  type="button"
                  onClick={() => toggle(option)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                    checked
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                      : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  }`}
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                      checked
                        ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                        : "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900"
                    }`}
                  >
                    {checked && <CheckIcon className="size-2.5" />}
                  </span>
                  <span className="truncate">{option}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </DropdownPortal>
    </div>
  );
}

type CompactSelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
};

export function CompactSelectField({
  value,
  onChange,
  options,
}: CompactSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const close = useCallback(() => setOpen(false), []);

  useClickOutside(triggerRef, panelRef, close, open);

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 border-l border-zinc-200 bg-indigo-600 px-3 py-2.5 text-xs font-medium text-white outline-none transition-opacity hover:opacity-90 dark:border-zinc-700"
      >
        <span className="whitespace-nowrap">{value}</span>
        <ChevronIcon className="size-3.5 text-white/90" open={open} />
      </button>

      <DropdownPortal
        open={open}
        triggerRef={triggerRef}
        panelRef={panelRef}
        align="right"
        minWidth={144}
      >
        <ul id={listboxId} role="listbox" className="py-1">
          {options.map((option) => {
            const selected = value === option;
            return (
              <li key={option} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option);
                    close();
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors ${
                    selected
                      ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                      : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  }`}
                >
                  <span>{option}</span>
                  {selected && (
                    <CheckIcon className="size-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </DropdownPortal>
    </div>
  );
}
