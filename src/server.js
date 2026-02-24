// src/server.js
import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const { PORT = 4000, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, { dbName: "BackPWA" })
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error conectando a MongoDB", err);
    process.exit(1);
  });
