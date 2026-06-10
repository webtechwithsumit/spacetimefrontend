export function withCurrentOption(
  current: string,
  defaults: readonly string[],
): string[] {
  const list =
    current && !defaults.includes(current as (typeof defaults)[number])
      ? [current, ...defaults]
      : [...defaults];
  return [...new Set(list)];
}
