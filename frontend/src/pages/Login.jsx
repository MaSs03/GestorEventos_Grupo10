import { useState } from "react";
import { api, setAuthToken } from "../api";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const doLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();

    const { data } = await api.post("/auth/login", {
      email: cleanEmail,
      password,
    });

    const token = data.token;
    const user = data.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthToken(token);
    onLogin(user);
  };

  const doRegister = async () => {
    const cleanNombre = nombre.trim();
    const cleanEmail = email.trim().toLowerCase();

    await api.post("/auth/register", {
      nombre: cleanNombre,
      email: cleanEmail,
      password,
    });

    await doLogin();
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const cleanNombre = nombre.trim();
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (!cleanEmail || !cleanPassword) {
        throw new Error("Email y contraseña son requeridos");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        throw new Error("Ingrese un correo electrónico válido");
      }

      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      if (mode === "register") {
        if (!cleanNombre) {
          throw new Error("Nombre es requerido");
        }

        if (cleanNombre.length < 3) {
          throw new Error("El nombre debe tener al menos 3 caracteres");
        }

        if (!confirmPassword.trim()) {
          throw new Error("Debe confirmar la contraseña");
        }

        if (password !== confirmPassword) {
          throw new Error("Las contraseñas no coinciden");
        }
      }

      if (mode === "register") {
        await doRegister();
      } else {
        await doLogin();
      }
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.msg || err.message));
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setNombre("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMsg("");
    setLoading(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-shell">
        <div className="auth-grid">
          <div className="auth-left">
            <div className="auth-blob" />
            <div className="auth-illustration">
              <div className="auth-illus-content">
                <div className="auth-illus-title">Bienvenido 👋</div>
                <div className="auth-illus-sub">
                  Administra eventos, controla cupos, asigna recursos y permite
                  que tus clientes se inscriban en segundos.
                </div>

                <div className="auth-chiprow">
                  <div className="auth-chip">✅ Cupos</div>
                  <div className="auth-chip">✅ Inscripciones</div>
                  <div className="auth-chip">✅ Recursos</div>
                  <div className="auth-chip">✅ Dashboard</div>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-right">
            <div className="auth-card">
              <div className="auth-brand">
                <div className="auth-brand-badge">GE</div>
                <div>
                  <div style={{ fontWeight: 900 }}>Gestión de Eventos</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(11,18,32,.65)",
                    }}
                  >
                    {mode === "login" ? "Iniciá sesión" : "Creá tu cuenta"}
                  </div>
                </div>
              </div>

              <div className="auth-title">
                {mode === "login" ? "Inicio de Sesión" : "Crear Cuenta"}
              </div>

              <div className="auth-sub">
                {mode === "login"
                  ? "Accedé con tu correo y contraseña."
                  : "Registrate como cliente para inscribirte a eventos."}
              </div>

              <form onSubmit={submit}>
                {mode === "register" && (
                  <div className="auth-field">
                    <label>Nombre</label>
                    <input
                      className="auth-input"
                      placeholder="Tu nombre completo"
                      value={nombre}
                      disabled={loading}
                      onChange={(e) => {
                        setNombre(e.target.value);
                        setMsg("");
                      }}
                    />
                  </div>
                )}

                <div className="auth-field">
                  <label>Correo electrónico</label>
                  <input
                    className="auth-input"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    disabled={loading}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setMsg("");
                    }}
                  />
                </div>

                <div className="auth-field">
                  <label>Contraseña</label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="auth-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      disabled={loading}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setMsg("");
                      }}
                      style={{ paddingRight: "110px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#6c4cff",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                {mode === "register" && (
                  <div className="auth-field">
                    <label>Confirmar contraseña</label>
                    <div style={{ position: "relative" }}>
                      <input
                        className="auth-input"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        disabled={loading}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setMsg("");
                        }}
                        style={{ paddingRight: "110px" }}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        style={{
                          position: "absolute",
                          right: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          color: "#6c4cff",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {showConfirmPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="auth-row">
                  <span
                    style={{
                      fontSize: 12,
                      color: "rgba(11,18,32,.65)",
                    }}
                  >
                    {mode === "login"
                      ? "¿No tenés cuenta?"
                      : "¿Ya tenés cuenta?"}
                  </span>

                  <span className="auth-link" onClick={switchMode}>
                    {mode === "login" ? "Crear cuenta" : "Regresar"}
                  </span>
                </div>

                <button className="auth-primary" disabled={loading}>
                  {loading
                    ? "Procesando..."
                    : mode === "login"
                    ? "Iniciar Sesión"
                    : "Crear cuenta y entrar"}
                </button>

                {msg && <div className="auth-alert">{msg}</div>}
              </form>

              <div
                style={{
                  marginTop: 14,
                  fontSize: 12,
                  color: "rgba(11,18,32,.60)",
                }}
              >
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}