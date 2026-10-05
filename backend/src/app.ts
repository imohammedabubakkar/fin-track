import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "node:url";
import { connectDatabase } from "./config/database.js";
import { errorHandler } from "./middleware/error.middleware.js";
import transactionRoutes from "./routes/transaction.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const app = express();
app.use(cors({ origin: [
  "https://fin-track-two-self.vercel.app",
  "https://fin-track-m1qc.onrender.com",
  "http://localhost:8443",
  "http://127.0.0.1:8443",
],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use((req, _res, next) => {
  if (req.path === "/api/health") return next();
  connectDatabase().then(() => next()).catch(next);
});
app.get("/api/health", (_req, res) => res.json({
  status: "ok",
  database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  timestamp: new Date().toISOString(),
}));
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

export default app;
