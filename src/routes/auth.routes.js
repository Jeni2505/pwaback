import { Router } from "express";
import {
    register,
    login,
    profile,
    heartbeat,
    getAllUsers
} from "../controllers/auth.controller.js";

import { auth, isAdmin } from "../middleware/auth.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, profile);

// 🔹 NUEVAS RUTAS
router.post('/heartbeat', auth, heartbeat);
router.get('/users', auth, isAdmin, getAllUsers);

export default router;