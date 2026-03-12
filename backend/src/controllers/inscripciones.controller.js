const pool = require("../config/db");

// POST /api/inscripciones/:eventoId  (CLIENTE)
async function inscribir(req, res) {
  const eventoId = Number(req.params.eventoId);
  const userId = req.user.id;

  try {
    // 1) Verificar evento y cupo
    const [evRows] = await pool.query(
      "SELECT id, cupo, estado FROM eventos WHERE id=?",
      [eventoId]
    );
    if (evRows.length === 0) return res.status(404).json({ ok: false, msg: "Evento no existe" });

    const evento = evRows[0];
    if (evento.estado !== "ACTIVO") return res.status(400).json({ ok: false, msg: "Evento no está activo" });

    // 2) Verificar si ya existe inscripción
    const [insRows] = await pool.query(
      "SELECT id, estado FROM inscripciones WHERE user_id=? AND evento_id=?",
      [userId, eventoId]
    );

    if (insRows.length > 0) {
      // Si estaba cancelada, la reactivamos
      if (insRows[0].estado === "CANCELADA") {
        // Antes de reactivar revisa cupo
        const [[{ usados }]] = await pool.query(
          "SELECT COUNT(*) AS usados FROM inscripciones WHERE evento_id=? AND estado='ACTIVA'",
          [eventoId]
        );
        if (usados >= evento.cupo) {
          return res.status(400).json({ ok: false, msg: "Cupo lleno" });
        }

        await pool.query(
          "UPDATE inscripciones SET estado='ACTIVA' WHERE id=?",
          [insRows[0].id]
        );
        return res.json({ ok: true, msg: "Inscripción reactivada" });
      }

      return res.status(409).json({ ok: false, msg: "Ya estás inscrito en este evento" });
    }

    // 3) Contar inscritos activos para cupo
    const [[{ usados }]] = await pool.query(
      "SELECT COUNT(*) AS usados FROM inscripciones WHERE evento_id=? AND estado='ACTIVA'",
      [eventoId]
    );

    if (evento.cupo > 0 && usados >= evento.cupo) {
      return res.status(400).json({ ok: false, msg: "Cupo lleno" });
    }

    // 4) Insertar inscripción
    await pool.query(
      "INSERT INTO inscripciones (user_id, evento_id, estado) VALUES (?,?, 'ACTIVA')",
      [userId, eventoId]
    );

    return res.status(201).json({ ok: true, msg: "Inscrito correctamente" });
  } catch (err) {
    return res.status(500).json({ ok: false, msg: "Error al inscribir", error: err.message });
  }
}

// DELETE /api/inscripciones/:eventoId  (CLIENTE) -> cancela
async function cancelar(req, res) {
  const eventoId = Number(req.params.eventoId);
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      "SELECT id, estado FROM inscripciones WHERE user_id=? AND evento_id=?",
      [userId, eventoId]
    );
    if (rows.length === 0) return res.status(404).json({ ok: false, msg: "No estás inscrito en este evento" });

    await pool.query(
      "UPDATE inscripciones SET estado='CANCELADA' WHERE user_id=? AND evento_id=?",
      [userId, eventoId]
    );

    return res.json({ ok: true, msg: "Inscripción cancelada" });
  } catch (err) {
    return res.status(500).json({ ok: false, msg: "Error al cancelar", error: err.message });
  }
}

// GET /api/inscripciones/mis-inscripciones (CLIENTE)
async function misInscripciones(req, res) {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT i.id, i.estado, i.created_at,
              e.id AS evento_id, e.titulo, e.ubicacion, e.fecha_inicio, e.fecha_fin
       FROM inscripciones i
       INNER JOIN eventos e ON e.id = i.evento_id
       WHERE i.user_id=?
       ORDER BY i.created_at DESC`,
      [userId]
    );

    return res.json({ ok: true, data: rows });
  } catch (err) {
    return res.status(500).json({ ok: false, msg: "Error listando inscripciones", error: err.message });
  }
}

// GET /api/inscripciones/evento/:eventoId (ADMIN) -> ver inscritos
async function inscritosPorEvento(req, res) {
  const eventoId = Number(req.params.eventoId);

  try {
    const [rows] = await pool.query(
      `SELECT i.id, i.estado, i.created_at,
              u.id AS user_id, u.nombre, u.email
       FROM inscripciones i
       INNER JOIN users u ON u.id = i.user_id
       WHERE i.evento_id=?
       ORDER BY i.created_at ASC`,
      [eventoId]
    );

    return res.json({ ok: true, data: rows });
  } catch (err) {
    return res.status(500).json({ ok: false, msg: "Error listando inscritos", error: err.message });
  }
}

module.exports = { inscribir, cancelar, misInscripciones, inscritosPorEvento };
