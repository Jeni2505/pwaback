import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: 'Por favor llena todos los campos' });

        const exists = await User.findOne({ email });
        if (exists)
            return res.status(409).json({ message: 'El usuario ya existe' });

        const hash = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hash
        });

        await user.save();

        // 🔹 TOKEN CON ROLE
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'changeme',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'Email o contraseña incorrectos' });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok)
            return res.status(404).json({ message: 'Email o contraseña incorrectos' });

        // 🔹 TOKEN CON ROLE
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'changeme',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

export async function profile(req, res) {
    const user = await User.findById(req.userId)
        .select('_id name email role');

    res.json({ user });
}

// 🔹 HEARTBEAT (usuarios en línea)
export async function heartbeat(req, res) {
    await User.findByIdAndUpdate(req.userId, {
        lastActive: new Date()
    });

    res.json({ message: "Activo" });
}

// 🔹 OBTENER TODOS LOS USUARIOS (SOLO ADMIN)
export async function getAllUsers(req, res) {
    const users = await User.find().select('-password');

    const now = new Date();

    const result = users.map(u => {
        const diff = (now - u.lastActive) / 1000;

        return {
            ...u.toObject(),
            online: diff < 30
        };
    });

    res.json(result);
}