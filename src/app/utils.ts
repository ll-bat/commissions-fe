export function showMessage(success: boolean, message: string) {
  // TODO - implement a better way to show messages
  alert(message);
}

export function normalizePercent(value: string): string {
  let normalizedPercentString = "";
  if (value !== "") {
    normalizedPercentString = String(Math.max(0, Math.min(100, Number(value))));
  }
  return normalizedPercentString;
}

export function returnSame<T>(value: unknown): T {
  // TODO make sure this is common approach
  return value as T;
}
