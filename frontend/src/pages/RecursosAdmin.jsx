import { useEffect, useState } from "react";
import { api } from "../api";

export default function RecursosAdmin({ user }) {
  const [recursos, setRecursos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [eventoId, setEventoId] = useState("");
  const [recursoId, setRecursoId] = useState("");
  const [msg, setMsg] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const cargar = async () => {
    try {
      const r = await api.get("/recursos");
      setRecursos(r.data.data || []);

      const e = await api.get("/eventos");
      setEventos(e.data.data || []);
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  };

  useEffect(() => {
    if (user.rol === "ADMIN") cargar();
  }, []);

  const crearRecurso = async () => {
    try {

      if (editandoId) {
        const { data } = await api.put(`/recursos/${editandoId}`, {
          nombre,
          tipo,
        });

        setMsg("✅ " + data.msg);
        setEditandoId(null);

      } else {

        const { data } = await api.post("/recursos", {
          nombre,
          tipo,
        });

        setMsg("✅ " + data.msg);
      }

      setNombre("");
      setTipo("");
      cargar();

    } catch (err) {
      setMsg("❌ " + (err.response?.data?.msg || err.message));
    }
  };

  const asignar = async () => {
    try {
      const { data } = await api.post(`/recursos/evento/${eventoId}`, {
        recurso_id: recursoId,
        cantidad: 1,
      });

      setMsg("✅ " + data.msg);

    } catch (err) {
      setMsg("❌ " + (err.response?.data?.msg || err.message));
    }
  };

  const eliminarRecurso = async (id) => {

    const ok = confirm("¿Eliminar este recurso?");
    if (!ok) return;

    try {

      const { data } = await api.delete(`/recursos/${id}`);

      setMsg("✅ " + data.msg);

      cargar();

    } catch (err) {

      setMsg("❌ " + (err.response?.data?.msg || err.message));

    }
  };

  const editarRecurso = (recurso) => {
    setNombre(recurso.nombre);
    setTipo(recurso.tipo);
    setEditandoId(recurso.id);
  };

  if (user.rol !== "ADMIN") return null;

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Recursos</h3>

      {msg && <p>{msg}</p>}

      {/* Crear */}
      <div style={{ border: "1px solid #444", padding: 12, borderRadius: 12 }}>
        <h4>Crear recurso</h4>

        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ padding: 8, marginRight: 8 }}
        />

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Seleccionar tipo</option>
          <option value="Multimedia">Multimedia</option>
          <option value="Infraestructura">Infraestructura</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Personal">Personal</option>
          <option value="Logística">Logística</option>
        </select>

        <button onClick={crearRecurso}>
          {editandoId ? "Actualizar" : "Crear"}
        </button>
      </div>

      {/* Asignar */}
      <div style={{ border: "1px solid #444", padding: 12, borderRadius: 12, marginTop: 12 }}>
        <h4>Asignar recurso a evento</h4>

        <select onChange={(e) => setEventoId(e.target.value)}>
          <option>Evento</option>
          {eventos.map(e => (
            <option key={e.id} value={e.id}>
              {e.titulo}
            </option>
          ))}
        </select>

        <select onChange={(e) => setRecursoId(e.target.value)} style={{ marginLeft: 8 }}>
          <option>Recurso</option>
          {recursos.map(r => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>

        <button onClick={asignar} style={{ marginLeft: 8 }}>
          Asignar
        </button>
      </div>

      {/* Lista */}
      <div style={{ marginTop: 12 }}>
        <h4>Recursos existentes</h4>

        {recursos.map(r => (
          <div
            key={r.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 8,
              border: "1px solid #555",
              borderRadius: 8,
              marginBottom: 6
            }}
          >
            <span>
              {r.nombre} — {r.tipo}
            </span>

            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => editarRecurso(r)}>
                Editar
              </button>

              <button
                onClick={() => eliminarRecurso(r.id)}
                style={{ background: "#ff4d4f", color: "white" }}
              >
                Eliminar
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}