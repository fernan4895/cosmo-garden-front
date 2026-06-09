import { useState } from "react";
import api from "../api";

function SaleModal({ products, onSave, onClose }) {
  const [form, setForm] = useState({
    code: "", client: "", payment: "Efectivo", status: "Completada",
  });
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addItem = () => {
    if (products.length === 0) return;
    const available = products.filter(p => !items.find(i => i.product.id === p.id) && p.stock > 0);
    if (available.length === 0) return;
    setItems(prev => [...prev, { product: available[0], qty: 1 }]);
  };

  const updateItem = (idx, field, value) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      if (field === "product") {
        const p = products.find(p => p.id === +value);
        return { ...item, product: p, qty: 1 };
      }
      if (field === "qty") {
        const qty = Math.max(1, Math.min(+value, item.product.stock));
        return { ...item, qty };
      }
      return item;
    }));
  };

  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

  const total = items.reduce((sum, i) => sum + (i.product.price || 0) * i.qty, 0);

  const save = async () => {
    setError("");
    if (items.length === 0) { setError("Agrega al menos un producto."); return; }
    setSaving(true);
    try {
      await api.post("sales", { ...form, total });
      for (const item of items) {
        const newStock = (item.product.stock || 0) - item.qty;
        await api.put(`products/${item.product.id}`, { stock: newStock });
      }
      onSave();
    } catch (e) {
      setError("Error al guardar la venta.");
    }
    setSaving(false);
  };

  const availableForRow = (idx) =>
    products.filter(p =>
      p.stock > 0 &&
      (!items.find((item, i) => i !== idx && item.product.id === p.id))
    );

  return (
    <div className="overlay" onClick={e => e.target.className === "overlay" && onClose()}>
      <div className="modal" style={{ maxWidth: 620 }}>
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

        <div style={{ margin: "16px 0 8px", fontWeight: 600, color: "var(--text)", fontSize: "0.85rem" }}>
          🌿 PRODUCTOS
        </div>

        {items.length === 0 && (
          <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: 8 }}>
            Sin productos aún. Agrega uno abajo.
          </div>
        )}

        {items.map((item, idx) => (
          <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <select
              value={item.product.id}
              onChange={e => updateItem(idx, "product", e.target.value)}
              style={{ flex: 2 }}
            >
              {availableForRow(idx).map(p => (
                <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
              ))}
              <option value={item.product.id}>{item.product.name} (Stock: {item.product.stock})</option>
            </select>
            <input
              type="number"
              value={item.qty}
              min={1}
              max={item.product.stock}
              onChange={e => updateItem(idx, "qty", e.target.value)}
              style={{ width: 70 }}
            />
            <span style={{ color: "var(--gold)", minWidth: 70, fontSize: "0.85rem" }}>
              ${((item.product.price || 0) * item.qty).toLocaleString("es-MX")}
            </span>
            <button className="btn btn-danger" style={{ padding: "4px 8px" }} onClick={() => removeItem(idx)}>✕</button>
          </div>
        ))}

        <button
          className="btn btn-ghost"
          style={{ marginTop: 4, fontSize: "0.8rem" }}
          onClick={addItem}
          disabled={products.filter(p => p.stock > 0 && !items.find(i => i.product.id === p.id)).length === 0}
        >
          + Agregar producto
        </button>

        <div style={{
          margin: "16px 0 8px",
          display: "flex", justifyContent: "flex-end",
          fontSize: "1rem", fontWeight: 700, color: "var(--gold)"
        }}>
          Total: ${total.toLocaleString("es-MX")}
        </div>

        {error && <div style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: 8 }}>{error}</div>}

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

export default function Sales({ sales, products, onRefresh }) {
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
        <SaleModal
          products={products || []}
          onSave={() => { setModal(false); onRefresh(); }}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
}