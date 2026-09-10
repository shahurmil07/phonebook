import type { NextFunction, Request, Response } from "express";
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

  console.error(error);
  response.status(500).json({ error: "Internal server error" });
}
