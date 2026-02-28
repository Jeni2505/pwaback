import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    lastSeen: { type: Date, default: null }, // para detección de online
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
