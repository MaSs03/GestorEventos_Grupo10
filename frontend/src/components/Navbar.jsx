export default function Navbar({ user, logout }) {
  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <span className="brand-dot" />
          <span>Gestión de Eventos</span>
        </div>

        <div className="nav-right">
          <span className="muted">{user.nombre}</span>
          <button className="btn-secondary" onClick={logout}>Salir</button>
        </div>
      </div>
    </div>
  );
}

