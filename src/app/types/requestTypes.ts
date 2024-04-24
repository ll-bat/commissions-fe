export type Result<T> = {
  ok: boolean;
  result: T | null;
  errors: Errors | null;
};

export type Errors = Record<string, string[]>;
