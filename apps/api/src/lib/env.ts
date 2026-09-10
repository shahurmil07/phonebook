import { AppError } from "../errors/app-error.js";

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new AppError(500, `Missing environment variable: ${name}`);
  }
  return value;
}
