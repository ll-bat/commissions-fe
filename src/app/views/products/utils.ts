export function normalizePercent(value: string): number | null {
  if (value !== "") {
    return Number(Math.max(0, Math.min(100, Number(value))));
  }
  return null;
}
