import { type Errors } from "@/app/types/requestTypes";

export function showAlert(success: boolean, message: string | null) {
  // TODO - implement better way
  if (message) {
    alert(message);
  }
}

export function getFirstError(errors: Errors | null): string | null {
  if (errors === null) {
    return null;
  }
  for (const errorKey in errors) {
    if (errors[errorKey].length > 0) {
      return errors[errorKey][0];
    }
  }
  return null;
}

export function returnSame<T>(value: unknown): T {
  return value as T;
}
