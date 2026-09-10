import "dotenv/config";
import { createApp } from "./app.js";

const app = createApp();

// Local / traditional hosting only — Vercel uses api/index.ts as the serverless entry.
if (!process.env.VERCEL) {
  const port = Number(process.env.API_PORT ?? 3001);
  const server = app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Stop the other process, then run npm run dev again.`);
      process.exit(1);
    }

    throw error;
  });
}

export default app;
