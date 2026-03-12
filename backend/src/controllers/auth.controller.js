const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, msg: "nombre, email y password son requeridos" });
    }

    // Revisar si existe
    const [exist] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exist.length > 0) {
      return res.status(409).json({ ok: false, msg: "Ese email ya está registrado" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // Por defecto CLIENTE
    const [result] = await pool.query(
      "INSERT INTO users (nombre, email, password_hash, rol) VALUES (?,?,?, 'CLIENTE')",
      [nombre, email, password_hash]
    );

    return res.status(201).json({
      ok: true,
      msg: "Usuario registrado",
      data: { id: result.insertId, nombre, email, rol: "CLIENTE" },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, msg: "Error en register", error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, msg: "email y password son requeridos" });
    }

    const [rows] = await pool.query(
      "SELECT id, nombre, email, password_hash, rol FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });

    const user = rows[0];
    const okPass = await bcrypt.compare(password, user.password_hash);
    if (!okPass) return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      ok: true,
      msg: "Login correcto",
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, msg: "Error en login", error: err.message });
  }
}

async function registerAdmin(req, res) {
  try {
    const { nombre, email, password, setupKey } = req.body;

    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ ok: false, msg: "SetupKey inválida" });
    }

    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, msg: "nombre, email y password son requeridos" });
    }

    const [exist] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exist.length > 0) {
      return res.status(409).json({ ok: false, msg: "Ese email ya está registrado" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (nombre, email, password_hash, rol) VALUES (?,?,?, 'ADMIN')",
      [nombre, email, password_hash]
    );

    return res.status(201).json({
      ok: true,
      msg: "ADMIN creado",
      data: { id: result.insertId, nombre, email, rol: "ADMIN" }
    });
  } catch (err) {
    return res.status(500).json({ ok: false, msg: "Error creando admin", error: err.message });
  }
}
async function resetAdminPassword(req, res) {
  try {
    const { email, newPassword, resetKey } = req.body;

    if (resetKey !== process.env.ADMIN_RESET_KEY) {
      return res.status(403).json({ ok: false, msg: "ResetKey inválida" });
    }

    if (!email || !newPassword) {
      return res.status(400).json({ ok: false, msg: "email y newPassword son requeridos" });
    }

    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, msg: "Usuario no existe" });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password_hash=? WHERE email=?", [password_hash, email]);

    return res.json({ ok: true, msg: "Password actualizado" });
  } catch (err) {
    return res.status(500).json({ ok: false, msg: "Error reset password", error: err.message });
  }
}


module.exports = { register, login, registerAdmin, resetAdminPassword };


