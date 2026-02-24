// src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { connectToDB } from "./bd/connect.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONT_ORIGIN || ""
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// Conexión a MongoDB (serverless safe)
app.use(async (_req, _res, next) => {
  try {
    await connectToDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ ok: true, message: "API funcionando 🚀" });
});

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;