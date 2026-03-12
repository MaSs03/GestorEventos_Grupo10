import { useEffect, useState } from "react";
import { api } from "../api";

export default function InscritosEvento({ user }) {
  const [eventos, setEventos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [inscritos, setInscritos] = useState([]);
  const [msg, setMsg] = useState("");

  const cargarEventos = async () => {
    setMsg("");
    try {
      const { data } = await api.get("/eventos");
      setEventos(data.data || []);
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.msg || err.message));
    }
  };

  const verInscritos = async (evento) => {
    setMsg("");
    setSelected(evento);
    setInscritos([]);
    try {
      const { data } = await api.get(`/inscripciones/evento/${evento.id}`);
      setInscritos(data.data || []);
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.msg || err.message));
    }
  };

  useEffect(() => {
    if (user.rol === "ADMIN") cargarEventos();
  }, []);

  if (user.rol !== "ADMIN") return null;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Inscritos por Evento </h3>

      <button onClick={cargarEventos} style={{ padding: 8, marginBottom: 10 }}>
        Recargar eventos
      </button>

      {msg && <p>{msg}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Lista de eventos */}
        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
          <h4 style={{ marginTop: 0 }}>Eventos</h4>

          {eventos.length === 0 ? (
            <p>No hay eventos.</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {eventos.map((e) => (
                <button
                  key={e.id}
                  onClick={() => verInscritos(e)}
                  onMouseEnter={(e)=> e.currentTarget.style.background="#2a2a2a"}
                  onMouseLeave={(e)=> e.currentTarget.style.background="#1e1e1e"}
                  style={{
                    textAlign: "left",
                    padding: 12,
                    borderRadius: 12,
                    border: selected?.id === e.id ? "2px solid #4cafef" : "1px solid #444",
                    background: "#1e1e1e",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "0.2s"
                  }}
                >
                  <b>{e.titulo}</b>
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    ID: {e.id} | {String(e.estado)}
                  </div>
                  <div style={{ fontSize: 13 }}>
                    Cupo: {e.cupo} | Usado: {e.cupo_usado ?? 0}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Inscritos del evento seleccionado */}
        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
          <h4 style={{ marginTop: 0 }}>
            {selected ? `Inscritos: ${selected.titulo}` : "Seleccioná un evento"}
          </h4>

          {selected && inscritos.length === 0 && (
            <p>No hay inscritos (o todos cancelaron).</p>
          )}

          {inscritos.length > 0 && (
            <div style={{ display: "grid", gap: 8 }}>
              {inscritos.map((r) => (
                <div key={r.id} style={{ padding: 10, border: "1px solid #eee", borderRadius: 10 }}>
                  <b>{r.nombre}</b>
                  <div style={{ fontSize: 13 }}>{r.email}</div>
                  <div style={{ fontSize: 13 }}>
                    Estado: <b>{r.estado}</b>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
