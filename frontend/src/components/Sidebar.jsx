export default function Sidebar({ user, view, setView }) {
  const itemsBase = [
    { key: "eventos", label: "📅 Eventos" },
  ];

  const itemsCliente = [
    { key: "mis", label: "🧾 Mis inscripciones" },
  ];

  const itemsAdmin = [
    { key: "inscritos", label: "👥 Inscritos por evento" },
    { key: "admin_eventos", label: "🛠️ Panel eventos" },
    { key: "recursos", label: "🧩 Recursos" },
  ];

  const items =
    user.rol === "ADMIN"
      ? [...itemsBase, ...itemsAdmin]
      : [...itemsBase, ...itemsCliente];

  return (
    <div className="card sidebar">
      <div className="side-title">Menú</div>

      <div className="navlist">
        {items.map((it) => (
          <button
            key={it.key}
            type="button"
            className={`navbtn ${view === it.key ? "active" : ""}`}
            onClick={() => setView(it.key)}
          >
            {it.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12, fontSize: 12 }} className="muted">
        Rol: <b style={{ color: "white" }}>{user.rol}</b>
      </div>
    </div>
  );
}
