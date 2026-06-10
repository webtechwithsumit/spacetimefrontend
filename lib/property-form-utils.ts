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
