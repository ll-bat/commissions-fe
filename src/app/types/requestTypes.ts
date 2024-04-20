export type Result<T> = {
  ok: boolean;
  result: T | null;
  errors: string[] | null;
};
