import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const configuredPort = process.env.API_PORT || process.env.PORT || "4001";
const port = Number(process.env.PORT) || 4001;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid API port "${configuredPort}". Set PORT or API_PORT to a number from 1 to 65535.`);
}

const server = app.listen(port, () => console.log(`FinTrack API listening on port ${port}`));
server.on("error", error => {
  const message = error instanceof Error ? error.message : String(error);
  if ((error as NodeJS.ErrnoException).code === "EADDRINUSE") {
    console.error(`Cannot start FinTrack API: port ${port} is already in use. Set PORT or API_PORT to an available port.`, message);
  } else {
    console.error("Cannot start FinTrack API:", message);
  }
  process.exitCode = 1;
});

connectDatabase().catch(error => {
  console.error("MongoDB connection failed; API is running with database-dependent routes unavailable:", error instanceof Error ? error.message : error);
});
