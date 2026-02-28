import User from '../models/User.js';

// Umbral: si lastSeen fue hace menos de 60s → usuario "online"
const ONLINE_THRESHOLD_MS = 60 * 1000;

// GET /api/admin/users  — lista todos los usuarios con estado online
export async function listUsers(req, res) {
  try {
    const users = await User.find().select('_id name email role lastSeen createdAt');
    const now = Date.now();

    const list = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      online: u.lastSeen ? now - new Date(u.lastSeen).getTime() < ONLINE_THRESHOLD_MS : false,
      lastSeen: u.lastSeen,
    }));

    res.json({ users: list });
  } catch {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
}

// POST /api/admin/heartbeat  — el cliente llama esto cada ~30s para marcar que sigue activo
// Cualquier usuario autenticado puede llamarlo (no solo admins)
export async function heartbeat(req, res) {
  try {
    await User.findByIdAndUpdate(req.userId, { lastSeen: new Date() });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ message: 'Error en heartbeat' });
  }
}
