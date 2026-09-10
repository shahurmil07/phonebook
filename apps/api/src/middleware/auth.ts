import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error.js";
import { requireEnv } from "../lib/env.js";

export type AuthPayload = {
  sub: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      admin?: AuthPayload;
    }
  }
}

export function requireAdmin(request: Request, _response: Response, next: NextFunction) {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Authentication required"));
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, requireEnv("JWT_SECRET")) as AuthPayload;
    request.admin = payload;
    return next();
  } catch {
    return next(new AppError(401, "Invalid or expired token"));
  }
}
