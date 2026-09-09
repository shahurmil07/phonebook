import { AppError } from "../errors/app-error.js";

const PHONE_PATTERN = /^[+]?[\d\s()-]{7,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(400, `${field} is required`);
  }

  return value.trim();
}

export function optionalString(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new AppError(400, `${field} must be a string`);
  }

  return value.trim();
}

export function validatePhone(phone: string): void {
  if (!PHONE_PATTERN.test(phone)) {
    throw new AppError(400, "Phone number is invalid");
  }
}

export function validateEmail(email: string | undefined): void {
  if (email && !EMAIL_PATTERN.test(email)) {
    throw new AppError(400, "Email is invalid");
  }
}
