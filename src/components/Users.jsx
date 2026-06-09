import { useState } from "react";
import api from "../api";

function UserModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "empleado" });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    await api.post("users", form);
    onSave();
    setSaving(false);
  };

  return (
    <div className="overlay" onClick={e => e.target.className === "overlay" && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Nuevo usuario</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Nombre completo</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Juan García" />
          </div>
          <div className="form-group">
            <label>Correo</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="juan@vivero.mx" />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <select value={form.role} onChange={e => set("role", e.target.value)}>
              {["admin", "empleado", "gerente"].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? "Guardando..." : "Crear usuario"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Users({ users, onRefresh }) {
  const [modal, setModal] = useState(false);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Usuarios</div>
          <div className="page-sub">GESTIÓN DE ACCESOS</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Nuevo usuario</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {users.length === 0 ? (
          <div className="empty"><div className="emoji">👥</div>Sin usuarios registrados</div>
        ) : (
          <table>
            <thead>
              <tr><th>Nombre</th><th>Correo</th><th>Rol</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "var(--green-dim)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        color: "var(--green)", fontWeight: 700, fontSize: "0.9rem",
                      }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ color: "var(--muted)" }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === "admin" ? "badge-gold" : u.role === "gerente" ? "badge-green" : "badge-muted"}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <UserModal onSave={() => { setModal(false); onRefresh(); }} onClose={() => setModal(false)} />
      )}
    </div>
  );
}
