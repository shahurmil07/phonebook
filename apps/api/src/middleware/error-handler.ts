import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import multer from "multer";
import { AppError } from "../errors/app-error.js";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (error instanceof multer.MulterError) {
    const message = error.code === "LIMIT_FILE_SIZE" ? "Image must be 5MB or smaller" : error.message;
    response.status(400).json({ error: message });
    return;
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    console.error(error);
    response.status(500).json({
      error: "Database error. Check DATABASE_URL on Vercel and that the DB is migrated/seeded.",
    });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Internal server error" });
}
