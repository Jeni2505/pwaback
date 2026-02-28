import { Router } from "express";
import { auth, adminOnly } from "../middleware/auth.js";
import { listUsers, heartbeat } from "../controllers/admin.controller.js";

const router = Router();

// Todos los usuarios autenticados pueden enviar heartbeat
router.post("/heartbeat", auth, heartbeat);

// Solo ADMIN puede ver la lista de usuarios
router.get("/users", auth, adminOnly, listUsers);

export default router;
