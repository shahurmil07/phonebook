import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express, { type Express } from "express";
import { errorHandler } from "./middleware/error-handler.js";
import { authRouter } from "./routes/auth.routes.js";
import { adminBannersRouter, publicBannersRouter } from "./routes/admin-banners.routes.js";
import { adminCategoriesRouter } from "./routes/admin-categories.routes.js";
import { adminListingsRouter } from "./routes/admin-listings.routes.js";
import { contactsRouter } from "./routes/contacts.routes.js";
import { taxonomyRouter } from "./routes/taxonomy.routes.js";

const uploadsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../uploads");

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: ["http://localhost:5173"] }));
  app.use(express.json());
  app.use("/uploads", express.static(uploadsRoot));

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/admin/listings", adminListingsRouter);
  app.use("/api/admin/categories", adminCategoriesRouter);
  app.use("/api/admin/banners", adminBannersRouter);
  app.use("/api/banners", publicBannersRouter);
  app.use("/api/taxonomy", taxonomyRouter);
  app.use("/api/contacts", contactsRouter);
  app.use(errorHandler);

  return app;
}
