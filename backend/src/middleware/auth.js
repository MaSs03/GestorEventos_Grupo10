const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ ok: false, msg: "Token requerido" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, rol, email }
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, msg: "Token inválido" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, msg: "No autenticado" });
    if (req.user.rol !== role) return res.status(403).json({ ok: false, msg: "No autorizado" });
    next();
  };
}

module.exports = { auth, requireRole };
