export function showMessage(success: boolean, message: string) {
  // TODO - implement a better way to show messages
  alert(message);
}

export function returnSame<T>(value: unknown): T {
  // TODO make sure this is common approach
  return value as T;
}
