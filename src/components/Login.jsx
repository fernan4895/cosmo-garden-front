import { useState } from "react";
import api from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("users/login", { email, password });
      if (res.user) onLogin(res.user);
      else setError(res.message || "Credenciales incorrectas");
    } catch {
      setError("Error de conexión con el servidor");
    }
    setLoading(false);
  };

  return (
    <div className="login-wrap">
      <div className="leaf-bg" />
      <div className="login-box">
        <div className="login-title">Cosmo<em>Garden</em></div>
        <div className="login-sub">SISTEMA DE GESTIÓN DE VIVERO</div>
        <div className="login-form">
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@cosmogarden.mx"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button
            className="btn btn-primary"
            onClick={handleLogin}
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "Verificando..." : "→ Ingresar"}
          </button>
        </div>
      </div>
    </div>
  );
}
