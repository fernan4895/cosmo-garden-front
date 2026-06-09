import { useState } from "react";
import api from "../api";

function SaleModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    code: "", client: "", total: 0, payment: "Efectivo", status: "Completada",
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    await api.post("sales", form);
    onSave();
    setSaving(false);
  };

  return (
    <div className="overlay" onClick={e => e.target.className === "overlay" && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Nueva venta</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Código</label>
            <input value={form.code} onChange={e => set("code", e.target.value)} placeholder="VNT-001" />
          </div>
          <div className="form-group">
            <label>Cliente</label>
            <input value={form.client} onChange={e => set("client", e.target.value)} placeholder="Nombre del cliente" />
          </div>
          <div className="form-group">
            <label>Total ($)</label>
            <input type="number" value={form.total} onChange={e => set("total", +e.target.value)} min={0} />
          </div>
          <div className="form-group">
            <label>Método de pago</label>
            <select value={form.payment} onChange={e => set("payment", e.target.value)}>
              {["Efectivo", "Tarjeta", "Transferencia", "PayPal", "Otro"].map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Estado</label>
            <select value={form.status} onChange={e => set("status", e.target.value)}>
              {["Completada", "Pendiente", "Cancelada"].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? "Guardando..." : "Registrar venta"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sales({ sales, onRefresh }) {
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = sales.filter(s =>
    !search ||
    s.client?.toLowerCase().includes(search.toLowerCase()) ||
    s.code?.toLowerCase().includes(search.toLowerCase())
  );
  const total = sales.reduce((s, v) => s + (v.total || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Ventas</div>
          <div className="page-sub">REGISTRO DE TRANSACCIONES</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Nueva venta</button>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-label">💰 Ingresos totales</div>
          <div className="stat-val">${total.toLocaleString("es-MX")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">🧾 Transacciones</div>
          <div className="stat-val">{sales.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">✅ Completadas</div>
          <div className="stat-val">{sales.filter(s => s.status === "Completada").length}</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente o código..." />
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <div className="empty"><div className="emoji">🧾</div>Sin ventas registradas</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Código</th><th>Cliente</th><th>Total</th>
                <th>Pago</th><th>Estado</th><th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td><span className="badge badge-muted">{s.code || "—"}</span></td>
                  <td>{s.client || "—"}</td>
                  <td style={{ color: "var(--gold)", fontWeight: 500 }}>
                    ${(s.total || 0).toLocaleString("es-MX")}
                  </td>
                  <td>{s.payment || "—"}</td>
                  <td>
                    <span className={`badge ${s.status === "Completada" ? "badge-green" : s.status === "Pendiente" ? "badge-gold" : "badge-muted"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
                    {s.date ? new Date(s.date).toLocaleDateString("es-MX") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <SaleModal onSave={() => { setModal(false); onRefresh(); }} onClose={() => setModal(false)} />
      )}
    </div>
  );
}
