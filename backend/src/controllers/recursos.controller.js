const pool = require("../config/db");

// ADMIN: CRUD recursos
async function crearRecurso(req, res) {
  try {
    const { nombre, tipo, descripcion, estado } = req.body;
    if (!nombre || !tipo) return res.status(400).json({ ok:false, msg:"nombre y tipo son requeridos" });

    const [r] = await pool.query(
      "INSERT INTO recursos (nombre, tipo, descripcion, estado) VALUES (?,?,?,?)",
      [nombre, tipo, descripcion || null, estado || "DISPONIBLE"]
    );

    return res.status(201).json({ ok:true, id: r.insertId, msg:"Recurso creado" });
  } catch (err) {
    return res.status(500).json({ ok:false, msg:"Error creando recurso", error: err.message });
  }
}

async function listarRecursos(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM recursos ORDER BY created_at DESC");
    return res.json({ ok:true, data: rows });
  } catch (err) {
    return res.status(500).json({ ok:false, msg:"Error listando recursos", error: err.message });
  }
}

async function actualizarRecurso(req, res) {
  try {
    const { nombre, tipo, descripcion, estado } = req.body;

    await pool.query(
      `UPDATE recursos SET
        nombre = COALESCE(?, nombre),
        tipo = COALESCE(?, tipo),
        descripcion = COALESCE(?, descripcion),
        estado = COALESCE(?, estado)
      WHERE id=?`,
      [nombre ?? null, tipo ?? null, descripcion ?? null, estado ?? null, req.params.id]
    );

    return res.json({ ok:true, msg:"Recurso actualizado" });
  } catch (err) {
    return res.status(500).json({ ok:false, msg:"Error actualizando recurso", error: err.message });
  }
}

async function eliminarRecurso(req, res) {
  try {
    await pool.query("DELETE FROM recursos WHERE id=?", [req.params.id]);
    return res.json({ ok:true, msg:"Recurso eliminado" });
  } catch (err) {
    return res.status(500).json({ ok:false, msg:"Error eliminando recurso", error: err.message });
  }
}

// ADMIN: asignar recurso a evento
async function asignarRecursoEvento(req, res) {
  try {
    const eventoId = Number(req.params.eventoId);
    const { recurso_id, cantidad } = req.body;

    if (!recurso_id) return res.status(400).json({ ok:false, msg:"recurso_id requerido" });

    // simple: validar existencia
    const [ev] = await pool.query("SELECT id FROM eventos WHERE id=?", [eventoId]);
    if (ev.length === 0) return res.status(404).json({ ok:false, msg:"Evento no existe" });

    const [rc] = await pool.query("SELECT id, estado FROM recursos WHERE id=?", [recurso_id]);
    if (rc.length === 0) return res.status(404).json({ ok:false, msg:"Recurso no existe" });
    if (rc[0].estado !== "DISPONIBLE") return res.status(400).json({ ok:false, msg:"Recurso no disponible" });

    await pool.query(
      `INSERT INTO evento_recursos (evento_id, recurso_id, cantidad)
       VALUES (?,?,?)
       ON DUPLICATE KEY UPDATE cantidad=VALUES(cantidad)`,
      [eventoId, recurso_id, Number(cantidad || 1)]
    );

    return res.json({ ok:true, msg:"Recurso asignado al evento" });
  } catch (err) {
    return res.status(500).json({ ok:false, msg:"Error asignando recurso", error: err.message });
  }
}

async function recursosDeEvento(req, res) {
  try {
    const eventoId = Number(req.params.eventoId);
    const [rows] = await pool.query(`
      SELECT er.id, er.cantidad,
             r.id AS recurso_id, r.nombre, r.tipo, r.estado
      FROM evento_recursos er
      INNER JOIN recursos r ON r.id = er.recurso_id
      WHERE er.evento_id=?
      ORDER BY r.tipo, r.nombre
    `, [eventoId]);

    return res.json({ ok:true, data: rows });
  } catch (err) {
    return res.status(500).json({ ok:false, msg:"Error listando recursos del evento", error: err.message });
  }
}

module.exports = {
  crearRecurso, listarRecursos, actualizarRecurso, eliminarRecurso,
  asignarRecursoEvento, recursosDeEvento
};
