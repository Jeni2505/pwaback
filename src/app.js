import express from "express";
import morgan from "morgan";
import cors from "cors";

import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { connectToDB } from "./db/connect.js";

const app = express();

/**
 * CORS
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONT_ORIGIN || "",
    ].filter(Boolean),
    credentials: true,
  })
);

/**
 * Middlewares básicos
 */
app.use(express.json());
app.use(morgan("dev"));

/**
 * Conexión a Mongo (segura para serverless)
 */
app.use(async (_req, _res, next) => {
  try {
    await connectToDB();
    next();
  } catch (e) {
    next(e);
  }
});

/**
 * Ruta base
 */
app.get("/", (_req, res) => {
  res.json({ ok: true, name: "todo-pwa-api" });
});

/**
 * Rutas API
 */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes); // 🔥 ESTA ES LA CLAVE

/**
 * Manejo global de errores
 */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
});

export default app;