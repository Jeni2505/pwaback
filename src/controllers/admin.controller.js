import User from '../models/User.js';
import { ObjectId } from 'mongodb';

/**
 * Marca al usuario como "vivo" — lo llama el frontend cada 30 seg
 * POST /api/admin/heartbeat
 */
export async function heartbeat(req, res) {
  try {
    await User.findByIdAndUpdate(req.userId, { lastSeen: new Date() });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ message: 'Error al actualizar lastSeen' });
  }
}

/**
 * Devuelve usuarios cuyo lastSeen fue hace menos de 2 minutos
 * GET /api/admin/online
 * Solo ADMIN puede llamarlo
 */
export async function getOnlineUsers(req, res) {
  try {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    const users = await User.find(
      { lastSeen: { $gte: twoMinutesAgo } },
      { password: 0 }          // nunca enviar el hash
    ).sort({ lastSeen: -1 });

    res.json({ users, count: users.length });
  } catch {
    res.status(500).json({ message: 'Error al obtener usuarios online' });
  }
}

/**
 * Devuelve TODOS los usuarios (para la tabla del panel admin)
 * GET /api/admin/users
 * Solo ADMIN
 */
export async function getAllUsers(req, res) {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json({ users, count: users.length });
  } catch {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
}