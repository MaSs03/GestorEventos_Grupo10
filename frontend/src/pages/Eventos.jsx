import { useEffect, useState } from "react";
import { api } from "../api";
import { formatFecha } from "../utils/dateformat";


export default function Eventos({ user }) {
  const [eventos, setEventos] = useState([]);
  const [msg, setMsg] = useState("");

  // 👇 recursos por evento (cache) y cuál está abierto
  const [recursosPorEvento, setRecursosPorEvento] = useState({});
  const [openEventoId, setOpenEventoId] = useState(null);

  const cargar = async () => {
    setMsg("");
    try {
      const { data } = await api.get("/eventos");
      setEventos(data.data || []);
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.msg || err.message));
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const inscribirme = async (eventoId) => {
    setMsg("");
    try {
      const { data } = await api.post(`/inscripciones/${eventoId}`);
      setMsg("✅ " + data.msg);
      await cargar();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.msg || err.message));
    }
  };

  const toggleRecursos = async (eventoId) => {
    setMsg("");

    // si ya está abierto, cerrar
    if (openEventoId === eventoId) {
      setOpenEventoId(null);
      return;
    }

    setOpenEventoId(eventoId);

    // si ya lo tenemos cacheado, no pedir otra vez
    if (recursosPorEvento[eventoId]) return;

    try {
      const { data } = await api.get(`/recursos/evento/${eventoId}`);
      setRecursosPorEvento((prev) => ({
        ...prev,
        [eventoId]: data.data || [],
      }));
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div>
      <h3>Eventos</h3>

      <button onClick={cargar} style={{ padding: 8, marginBottom: 10 }}>
        Recargar
      </button>

      {msg && <p>{msg}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {eventos.map((e) => (
          <div key={e.id} className="card">
            <h4 style={{ margin: 0 }}>{e.titulo}</h4>

            <p style={{ margin: "6px 0" }}>
              {e.ubicacion || "Sin ubicación"} | {String(e.estado)}
            </p>

            <p style={{ margin: "6px 0" }}>
              <b>Inicio:</b> {formatFecha(e.fecha_inicio)} <br />
              <b>Fin:</b> {formatFecha(e.fecha_fin)}
            </p>

            <p style={{ margin: "6px 0" }}>
              <b>Cupo:</b> {e.cupo} | <b>Usado:</b> {e.cupo_usado ?? 0} |{" "}
              <b>Disponible:</b>{" "}
              {e.cupo_disponible ?? (e.cupo === 0 ? "Ilimitado" : "-")}
            </p>

            {/* CLIENTE: Inscribirse */}
            {user.rol === "CLIENTE" && (
              <button onClick={() => inscribirme(e.id)} style={{ padding: 8, marginTop: 6 }}>
                Inscribirme
              </button>
            )}

            {/* Ver recursos (ADMIN y CLIENTE) */}
            <button
              type="button"
              className="btn-secondary"
              onClick={() => toggleRecursos(e.id)}
              style={{ padding: 8, marginTop: 10, width: "100%" }}
            >
              {openEventoId === e.id ? "Ocultar recursos" : "Ver recursos"}
            </button>

            {/* Lista recursos */}
            {openEventoId === e.id && (
              <div style={{ marginTop: 10 }}>
                <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>
                  Recursos asignados
                </div>

                {(recursosPorEvento[e.id] || []).length === 0 ? (
                  <div className="muted" style={{ fontSize: 13 }}>
                    No hay recursos asignados.
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 8 }}>
                    {recursosPorEvento[e.id].map((r) => (
                      <div
                        key={r.id}
                        style={{
                          padding: 10,
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,.12)",
                          background: "rgba(255,255,255,.06)",
                        }}
                      >
                        <b>{r.nombre}</b> — {r.tipo}{" "}
                        <span className="muted">x{r.cantidad}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
