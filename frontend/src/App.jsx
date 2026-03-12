import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Eventos from "./pages/Eventos";
import MisInscripciones from "./pages/MisInscripciones";
import InscritosEvento from "./pages/InscritosEvento";
import AdminEventos from "./pages/AdminEventos";
import RecursosAdmin from "./pages/RecursosAdmin";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { setAuthToken } from "./api";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("eventos");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setAuthToken(token);
      const u = JSON.parse(savedUser);
      setUser(u);
      setView("eventos"); // vista inicial
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthToken(null);
    setUser(null);
    setView("eventos");
  };

  if (!user) return <Login onLogin={(u) => { setUser(u); setView("eventos"); }} />;

  return (
    <>
      <Navbar user={user} logout={logout} />

      <div className="app-layout">
        <Sidebar user={user} view={view} setView={setView} />

        <div className="main">
          {view === "eventos" && (
            <div className="card">
              <Eventos user={user} />
            </div>
          )}

          {view === "mis" && user.rol === "CLIENTE" && (
            <div className="card">
              <MisInscripciones user={user} />
            </div>
          )}

          {view === "inscritos" && user.rol === "ADMIN" && (
            <div className="card">
              <InscritosEvento user={user} />
            </div>
          )}

          {view === "admin_eventos" && user.rol === "ADMIN" && (
            <div className="card">
              <AdminEventos user={user} />
            </div>
          )}

          {view === "recursos" && user.rol === "ADMIN" && (
            <div className="card">
              <RecursosAdmin user={user} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
