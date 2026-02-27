import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    // 🔹 NUEVO: Rol
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    // 🔹 NUEVO: Última actividad
    lastActive: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
}
);

export default mongoose.model("User", userSchema);