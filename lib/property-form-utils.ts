const SQ_FT_PER_SQ_YARD = 9;
const SQ_FT_PER_SQ_METER = 10.7639;

export function parseIndianNumber(value: string): number {
  const cleaned = value.replace(/[,\s₹]/g, "").trim();
  if (!cleaned) return 0;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatIndianNumber(value: number): string {
  if (!Number.isFinite(value)) return "";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumericInput(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return "";
  return formatIndianNumber(Number(digits));
}

const MONTHS_SHORT = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
] as const;

export function formatDateTimeDisplay(value?: string): string {
  if (!value?.trim()) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTHS_SHORT[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  return `${day} ${month} ${year}, ${hours}:${minutes} ${period}`;
}

export function toDateTimeLocalValue(value?: string): string {
  if (!value?.trim()) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function buildDateTimeLocalValue(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month + 1)}-${pad(day)}T${pad(hours)}:${pad(minutes)}`;
}

export function parseDateTimeLocalValue(value: string): Date | null {
  if (!value.trim()) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function fromDateTimeLocalValue(value: string): string {
  if (!value.trim()) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.trim();
  return date.toISOString();
}

export function formatStoredNumber(value?: string): string {
  if (!value?.trim()) return "";
  const num = parseIndianNumber(value);
  if (!num) return "";
  return formatIndianNumber(num);
}

export function plotAreaToSqFt(plotArea: string, unit: string): number {
  const amount = parseIndianNumber(plotArea);
  if (!amount) return 0;
  if (unit === "Sq. Meters") return amount * SQ_FT_PER_SQ_METER;
  if (unit === "Sq. Ft.") return amount;
  return amount * SQ_FT_PER_SQ_YARD;
}

export function calcPricePerSqft(
  totalPrice: string,
  superArea: string,
  totalCarpetArea: string,
): string {
  const price = parseIndianNumber(totalPrice);
  const area =
    parseIndianNumber(superArea) || parseIndianNumber(totalCarpetArea);
  if (!price || !area) return "";
  return formatIndianNumber(Math.round(price / area));
}
