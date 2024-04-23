export type Result<T> = {
  ok: boolean;
  result: T | null;
  errors: Record<string, string[]> | null;
};
