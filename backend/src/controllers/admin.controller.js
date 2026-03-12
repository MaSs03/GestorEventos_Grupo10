const pool = require("../config/db");

async function dashboard(req, res) {
  try {
    const [[totEventos]] = await pool.query("SELECT COUNT(*) AS total_eventos FROM eventos");
    const [[totInscripciones]] = await pool.query(
      "SELECT COUNT(*) AS total_inscripciones_activas FROM inscripciones WHERE estado='ACTIVA'"
    );

    const [[topEvento]] = await pool.query(`
      SELECT e.id, e.titulo, COUNT(i.id) AS inscritos
      FROM eventos e
      LEFT JOIN inscripciones i ON i.evento_id = e.id AND i.estado='ACTIVA'
      GROUP BY e.id
      ORDER BY inscritos DESC
      LIMIT 1
    `);

    const [proximos] = await pool.query(`
      SELECT id, titulo, fecha_inicio, fecha_fin, ubicacion, estado
      FROM eventos
      WHERE fecha_inicio >= NOW()
      ORDER BY fecha_inicio ASC
      LIMIT 5
    `);

    return res.json({
      ok: true,
      data: {
        total_eventos: totEventos.total_eventos,
        total_inscripciones_activas: totInscripciones.total_inscripciones_activas,
        evento_mas_inscritos: topEvento || null,
        proximos_eventos: proximos
      }
    });
  } catch (err) {
    return res.status(500).json({ ok:false, msg:"Error dashboard", error: err.message });
  }
}

module.exports = { dashboard };
