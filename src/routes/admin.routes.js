import { Router } from 'express';
import { auth, adminOnly } from '../middleware/auth.js';
import { heartbeat, getOnlineUsers, getAllUsers } from '../controllers/admin.controller.js';

const router = Router();

// Cualquier usuario autenticado puede hacer heartbeat
router.post('/heartbeat', auth, heartbeat);

// Solo ADMIN puede ver usuarios online y lista completa
router.get('/online', auth, adminOnly, getOnlineUsers);
router.get('/users',  auth, adminOnly, getAllUsers);

export default router;