import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Token requerido" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "changeme");
    req.userId = payload.id;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

// Middleware que verifica que el usuario tenga rol ADMIN
export async function adminOnly(req, res, next) {
  try {
    const user = await User.findById(req.userId).select("role");
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ message: "Acceso denegado: se requiere rol ADMIN" });
    }
    next();
  } catch {
    return res.status(500).json({ message: "Error verificando permisos" });
  }
}
