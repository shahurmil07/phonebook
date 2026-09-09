import cors from "cors";
import express, { type Express } from "express";
import { errorHandler } from "./middleware/error-handler.js";
import { contactsRouter } from "./routes/contacts.routes.js";

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: ["http://localhost:5173"] }));
  app.use(express.json());

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/api/contacts", contactsRouter);
  app.use(errorHandler);

  return app;
}
