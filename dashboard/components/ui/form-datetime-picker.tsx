"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { labelClass } from "@/dashboard/components/ui/form-styles";
import {
  buildDateTimeLocalValue,
  formatDateTimeDisplay,
  parseDateTimeLocalValue,
} from "@/lib/property-form-utils";

const triggerClass =
  "flex w-full min-h-[42px] items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 text-left text-sm outline-none transition-all dark:border-zinc-700 dark:bg-zinc-900/50";

const triggerOpenClass =
  "border-indigo-500 ring-4 ring-indigo-500/10 dark:border-indigo-400 dark:ring-indigo-400/10";

const panelClass =
  "fixed z-[9999] overflow-visible rounded-2xl bg-white shadow-xl shadow-zinc-900/15 dark:bg-zinc-950 dark:shadow-none";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const YEAR_RANGE_START = new Date().getFullYear() - 50;
const YEAR_RANGE_END = new Date().getFullYear() + 20;
const YEAR_OPTIONS = Array.from(
  { length: YEAR_RANGE_END - YEAR_RANGE_START + 1 },
  (_, i) => YEAR_RANGE_START + i,
);

const PANEL_WIDTH = 320;
const PANEL_GAP = 8;
const VIEWPORT_PADDING = 8;
const ESTIMATED_PANEL_HEIGHT = 380;

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
  placement: "above" | "below";
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
  panelRef: RefObject<HTMLElement | null>,
  open: boolean,
) {
  const [position, setPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: PANEL_WIDTH,
    placement: "below",
  });

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const panelHeight =
      panelRef.current?.offsetHeight ?? ESTIMATED_PANEL_HEIGHT;

    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
    const spaceAbove = rect.top - VIEWPORT_PADDING;
    const showAbove =
      spaceBelow < panelHeight + PANEL_GAP && spaceAbove >= spaceBelow;

    let top = showAbove
      ? rect.top - panelHeight - PANEL_GAP
      : rect.bottom + PANEL_GAP;

    top = Math.max(
      VIEWPORT_PADDING,
      Math.min(top, window.innerHeight - panelHeight - VIEWPORT_PADDING),
    );

    let left = rect.left;
    if (left + PANEL_WIDTH > window.innerWidth - VIEWPORT_PADDING) {
      left = window.innerWidth - PANEL_WIDTH - VIEWPORT_PADDING;
    }
    left = Math.max(VIEWPORT_PADDING, left);

    setPosition({
      top,
      left,
      width: PANEL_WIDTH,
      placement: showAbove ? "above" : "below",
    });
  }, [triggerRef, panelRef]);

  useEffect(() => {
    if (!open) return;

    updatePosition();
    const raf = requestAnimationFrame(updatePosition);

    const panel = panelRef.current;
    const observer =
      panel &&
      new ResizeObserver(() => {
        updatePosition();
      });
    if (panel && observer) observer.observe(panel);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition, panelRef]);

  return position;
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className ?? "size-4"}
    >
      <path
        fillRule="evenodd"
        d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className ?? "size-4"}
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className ?? "size-3.5"}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-3.5 shrink-0"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Array<{ day: number; inMonth: boolean }> = [];

  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i -= 1) {
    days.push({ day: prevMonthDays - i, inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    days.push({ day: d, inMonth: true });
  }
  let nextDay = 1;
  while (days.length % 7 !== 0) {
    days.push({ day: nextDay, inMonth: false });
    nextDay += 1;
  }
  return days;
}

function to12Hour(hours24: number): { hour12: number; period: "am" | "pm" } {
  const period: "am" | "pm" = hours24 >= 12 ? "pm" : "am";
  const hour12 = hours24 % 12 || 12;
  return { hour12, period };
}

function to24Hour(hour12: number, period: "am" | "pm") {
  if (period === "am") return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

function cycleValue(
  current: number,
  delta: number,
  min: number,
  max: number,
) {
  const range = max - min + 1;
  return ((((current - min + delta) % range) + range) % range) + min;
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type CalendarHeaderDropdownProps<T extends string | number> = {
  label: string;
  open: boolean;
  onToggle: () => void;
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
  align?: "left" | "center";
};

function CalendarHeaderDropdown<T extends string | number>({
  label,
  open,
  onToggle,
  options,
  selected,
  onSelect,
  align = "left",
}: CalendarHeaderDropdownProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const selectedEl = listRef.current.querySelector("[data-selected='true']");
    selectedEl?.scrollIntoView({ block: "center" });
  }, [open, selected]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-sm font-semibold transition-colors hover:bg-white/15"
      >
        {label}
        <ChevronDownIcon
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          ref={listRef}
          className={`absolute top-full z-20 mt-1 max-h-44 w-36 overflow-y-auto rounded-xl border border-white/20 bg-zinc-800/95 py-1 shadow-xl backdrop-blur-sm ${align === "center" ? "left-1/2 -translate-x-1/2" : "left-0"
            }`}
        >
          {options.map((option) => {
            const isSelected = option.value === selected;
            return (
              <button
                key={String(option.value)}
                type="button"
                data-selected={isSelected}
                onClick={() => onSelect(option.value)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${isSelected
                    ? "bg-blue-600 text-white"
                    : "text-white hover:bg-white/10"
                  }`}
              >
                {isSelected ? <CheckIcon /> : <span className="size-3.5" />}
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

type EditableTimeSpinnerProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  ariaLabel: string;
};

function EditableTimeSpinner({
  value,
  min,
  max,
  onChange,
  ariaLabel,
}: EditableTimeSpinnerProps) {
  const [draft, setDraft] = useState("");
  const [focused, setFocused] = useState(false);

  function commitDraft() {
    const parsed = Number(draft);
    if (Number.isFinite(parsed)) {
      onChange(clampValue(Math.round(parsed), min, max));
    }
    setFocused(false);
  }

  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => onChange(cycleValue(value, -1, min, max))}
        className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
        aria-label={`Decrease ${ariaLabel}`}
      >
        <ChevronLeftIcon className="size-3.5" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        maxLength={2}
        aria-label={ariaLabel}
        value={focused ? draft : String(value).padStart(2, "0")}
        onFocus={() => {
          setDraft(String(value).padStart(2, "0"));
          setFocused(true);
        }}
        onChange={(e) =>
          setDraft(e.target.value.replace(/\D/g, "").slice(0, 2))
        }
        onBlur={commitDraft}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commitDraft();
          }
        }}
        className="w-7 rounded-md border-0 bg-transparent text-center text-base font-semibold tabular-nums text-zinc-900 outline-none ring-indigo-500 focus:ring-2 dark:text-white"
      />
      <button
        type="button"
        onClick={() => onChange(cycleValue(value, 1, min, max))}
        className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-indigo-600 dark:hover:bg-zinc-800"
        aria-label={`Increase ${ariaLabel}`}
      >
        <ChevronRightIcon className="size-3.5" />
      </button>
    </div>
  );
}

type InlineTimePickerProps = {
  hour12: number;
  minute: number;
  period: "am" | "pm";
  onChange: (hour12: number, minute: number, period: "am" | "pm") => void;
};

function InlineTimePicker({
  hour12,
  minute,
  period,
  onChange,
}: InlineTimePickerProps) {
  return (
    <div className="flex w-full items-center justify-between gap-1 border-t border-zinc-100 px-3 py-3 dark:border-zinc-800">
      <div className="flex min-w-0 flex-1 items-center justify-center gap-0.5">
        <EditableTimeSpinner
          value={hour12}
          min={1}
          max={12}
          ariaLabel="Hour"
          onChange={(h) => onChange(h, minute, period)}
        />
        <span className="text-base font-semibold text-zinc-400">:</span>
        <EditableTimeSpinner
          value={minute}
          min={0}
          max={59}
          ariaLabel="Minute"
          onChange={(m) => onChange(hour12, m, period)}
        />
      </div>
      <div className="flex shrink-0 rounded-lg border border-zinc-200 dark:border-zinc-700">
        <button
          type="button"
          onClick={() => onChange(hour12, minute, "am")}
          className={`px-2 py-1 text-[11px] font-semibold uppercase transition-colors ${
            period === "am"
              ? "rounded-l-lg bg-indigo-700 text-white"
              : "rounded-l-lg bg-white text-zinc-500 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
          }`}
        >
          am
        </button>
        <button
          type="button"
          onClick={() => onChange(hour12, minute, "pm")}
          className={`px-2 py-1 text-[11px] font-semibold uppercase transition-colors ${
            period === "pm"
              ? "rounded-r-lg bg-indigo-700 text-white"
              : "rounded-r-lg bg-white text-zinc-500 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
          }`}
        >
          pm
        </button>
      </div>
    </div>
  );
}

type DateTimeInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function DateTimeInput({
  id,
  label,
  value,
  onChange,
}: DateTimeInputProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const parsed = parseDateTimeLocalValue(value);
  const today = new Date();

  const [viewYear, setViewYear] = useState(
    () => parsed?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    () => parsed?.getMonth() ?? today.getMonth(),
  );
  const [selectedDay, setSelectedDay] = useState(
    () => parsed?.getDate() ?? today.getDate(),
  );
  const [hour12, setHour12] = useState(() => {
    const h = parsed?.getHours() ?? today.getHours();
    return to12Hour(h).hour12;
  });
  const [minute, setMinute] = useState(
    () => parsed?.getMinutes() ?? today.getMinutes(),
  );
  const [period, setPeriod] = useState<"am" | "pm">(() => {
    const h = parsed?.getHours() ?? today.getHours();
    return to12Hour(h).period;
  });
  const [openDropdown, setOpenDropdown] = useState<"month" | "year" | null>(
    null,
  );

  const monthOptions = useMemo(
    () => MONTHS.map((name, index) => ({ value: index, label: name })),
    [],
  );
  const yearOptions = useMemo(
    () => YEAR_OPTIONS.map((year) => ({ value: year, label: String(year) })),
    [],
  );

  const close = useCallback(() => {
    setOpenDropdown(null);
    setOpen(false);
  }, []);
  useClickOutside(triggerRef, panelRef, close, open);
  const position = useDropdownPosition(triggerRef, panelRef, open);

  useEffect(() => {
    if (!open) {
      setOpenDropdown(null);
      return;
    }
    const date = parseDateTimeLocalValue(value) ?? new Date();
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
    setSelectedDay(date.getDate());
    const { hour12: h, period: p } = to12Hour(date.getHours());
    setHour12(h);
    setMinute(date.getMinutes());
    setPeriod(p);
    setOpenDropdown(null);
  }, [open, value]);

  const calendarDays = useMemo(
    () => getCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const displayValue = formatDateTimeDisplay(value);

  function commit(
    year: number,
    month: number,
    day: number,
    h12: number,
    min: number,
    p: "am" | "pm",
  ) {
    onChange(
      buildDateTimeLocalValue(
        year,
        month,
        day,
        to24Hour(h12, p),
        min,
      ),
    );
  }

  function selectDay(day: number, inMonth: boolean) {
    setOpenDropdown(null);
    let year = viewYear;
    let month = viewMonth;
    if (!inMonth) {
      if (day > 15) {
        month -= 1;
        if (month < 0) {
          month = 11;
          year -= 1;
        }
      } else {
        month += 1;
        if (month > 11) {
          month = 0;
          year += 1;
        }
      }
      setViewYear(year);
      setViewMonth(month);
    }
    setSelectedDay(day);
    commit(year, month, day, hour12, minute, period);
  }

  function updateTime(h12: number, min: number, p: "am" | "pm") {
    setHour12(h12);
    setMinute(min);
    setPeriod(p);
    commit(viewYear, viewMonth, selectedDay, h12, min, p);
  }

  function applyViewDate(year: number, month: number) {
    const maxDay = new Date(year, month + 1, 0).getDate();
    const day = Math.min(selectedDay, maxDay);
    setViewYear(year);
    setViewMonth(month);
    setSelectedDay(day);
    commit(year, month, day, hour12, minute, period);
  }

  function handleMonthSelect(month: number) {
    applyViewDate(viewYear, month);
    setOpenDropdown(null);
  }

  function handleYearSelect(year: number) {
    applyViewDate(year, viewMonth);
    setOpenDropdown(null);
  }

  function goToPrevMonth() {
    setOpenDropdown(null);
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
      return;
    }
    setViewMonth((m) => m - 1);
  }

  function goToNextMonth() {
    setOpenDropdown(null);
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
      return;
    }
    setViewMonth((m) => m + 1);
  }

  function handleToday() {
    setOpenDropdown(null);
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDay(now.getDate());
    const { hour12: h, period: p } = to12Hour(now.getHours());
    setHour12(h);
    setMinute(now.getMinutes());
    setPeriod(p);
    commit(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      h,
      now.getMinutes(),
      p,
    );
  }

  function handleClear() {
    onChange("");
    close();
  }

  const isToday = (day: number, inMonth: boolean) => {
    if (!inMonth) return false;
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  };

  const isSelected = (day: number, inMonth: boolean) => {
    if (!inMonth) return false;
    const selected = parseDateTimeLocalValue(value);
    if (!selected) return false;
    return (
      day === selected.getDate() &&
      viewMonth === selected.getMonth() &&
      viewYear === selected.getFullYear()
    );
  };

  return (
    <div className="relative">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>

      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`${triggerClass} ${open ? triggerOpenClass : "hover:border-zinc-300 dark:hover:border-zinc-600"}`}
      >
        <span
          className={`min-w-0 flex-1 truncate ${displayValue ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500"}`}
        >
          {displayValue || "Select date & time"}
        </span>
        <CalendarIcon className="size-4 shrink-0 text-zinc-400" />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label={label}
            className={panelClass}
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
              maxWidth: PANEL_WIDTH,
            }}
          >
            <div className="rounded-t-2xl bg-indigo-700 px-3 pb-2 pt-3 text-white dark:bg-indigo-800">
              <div className="relative z-10 mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goToPrevMonth}
                  className="rounded-lg p-1 transition-colors hover:bg-white/15"
                  aria-label="Previous month"
                >
                  <ChevronLeftIcon className="size-5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <CalendarHeaderDropdown
                    label={MONTHS[viewMonth]}
                    open={openDropdown === "month"}
                    onToggle={() =>
                      setOpenDropdown((current) =>
                        current === "month" ? null : "month",
                      )
                    }
                    options={monthOptions}
                    selected={viewMonth}
                    onSelect={handleMonthSelect}
                    align="center"
                  />
                  <CalendarHeaderDropdown
                    label={String(viewYear)}
                    open={openDropdown === "year"}
                    onToggle={() =>
                      setOpenDropdown((current) =>
                        current === "year" ? null : "year",
                      )
                    }
                    options={yearOptions}
                    selected={viewYear}
                    onSelect={handleYearSelect}
                    align="center"
                  />
                </div>

                <button
                  type="button"
                  onClick={goToNextMonth}
                  className="rounded-lg p-1 transition-colors hover:bg-white/15"
                  aria-label="Next month"
                >
                  <ChevronRightIcon className="size-5" />
                </button>
              </div>

              <div className="grid grid-cols-7">
                {WEEKDAYS.map((day) => (
                  <span
                    key={day}
                    className="py-1 text-center text-[11px] font-medium text-white/80"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="overflow-hidden rounded-b-2xl"
              onClick={() => setOpenDropdown(null)}
            >
              <div className="px-3 py-3">
                <div className="grid grid-cols-7 gap-y-1">
                  {calendarDays.map(({ day, inMonth }, index) => {
                    const selected = isSelected(day, inMonth);
                    const todayMatch = isToday(day, inMonth);
                    return (
                      <button
                        key={`${viewYear}-${viewMonth}-${index}`}
                        type="button"
                        onClick={() => selectDay(day, inMonth)}
                        className={`mx-auto flex size-8 items-center justify-center rounded-full text-sm transition-colors ${
                          selected
                            ? "bg-indigo-700 font-semibold text-white dark:bg-indigo-600"
                            : todayMatch
                              ? "font-medium text-indigo-700 ring-2 ring-zinc-300 dark:text-indigo-400 dark:ring-zinc-600"
                              : inMonth
                                ? "text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                : "text-zinc-300 dark:text-zinc-600"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleToday}
                    className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400"
                  >
                    Today
                  </button>
                </div>
              </div>

              <InlineTimePicker
                hour12={hour12}
                minute={minute}
                period={period}
                onChange={updateTime}
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
