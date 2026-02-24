import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Ruta base
app.get("/", (req, res) =>
  res.json({ ok: true, name: "Jenifer Todo API" })
);

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Variables de entorno
const { PORT = 4000, MONGO_URL } = process.env;

// Conexión a MongoDB
mongoose
  .connect(MONGO_URL, { dbName: "BackPWA" })
  .then(() => {
    console.log("Conectado a MongoDB:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  });