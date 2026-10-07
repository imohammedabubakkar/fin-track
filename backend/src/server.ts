import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const configuredPort = process.env.PORT || process.env.API_PORT || "8787";
const port = Number(configuredPort);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid API port "${configuredPort}". Set PORT or API_PORT to a number from 1 to 65535.`);
}

async function startServer() {
  try {
    await connectDatabase();
    const server = app.listen(port, () => {
      console.log("===================================================");
      console.log("🚀 FinTrack Backend API is running!");
      console.log(`🌐 URL: http://localhost:${port}`);
      console.log(`💚 Health Check: http://localhost:${port}/api/health`);
      console.log("===================================================");
    });
    server.on("error", error => {
      const message = error instanceof Error ? error.message : String(error);
      if ((error as NodeJS.ErrnoException).code === "EADDRINUSE") {
        console.error(`Cannot start FinTrack API: port ${port} is already in use. Set PORT or API_PORT to an available port.`, message);
      } else {
        console.error("Cannot start FinTrack API:", message);
      }
      process.exitCode = 1;
    });
  } catch (error) {
    console.error("[Database] MongoDB connection failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

void startServer();
