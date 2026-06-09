import { useState } from "react";
import api from "../api";

function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(
    product || {
      name: "", code: "", species: "", category: "All",
      location: "", price: 0, stock: 0,
      health: "Excelente", watered: "Hace 1 día", image: "",
    }
  );
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    if (product?.id) await api.put(`products/${product.id}`, form);
    else await api.post("products", form);
    onSave();
    setSaving(false);
  };

  return (
    <div className="overlay" onClick={e => e.target.className === "overlay" && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{product ? "Editar producto" : "Nuevo producto"}</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Nombre *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ej. Monstera deliciosa" />
          </div>
          <div className="form-group">
            <label>Código</label>
            <input value={form.code} onChange={e => set("code", e.target.value)} placeholder="Ej. PLT-001" />
          </div>
          <div className="form-group">
            <label>Especie</label>
            <input value={form.species} onChange={e => set("species", e.target.value)} placeholder="Ej. Monstera" />
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select value={form.category} onChange={e => set("category", e.target.value)}>
              {["All", "Interior", "Exterior", "Suculentas", "Cactus", "Flores", "Árboles", "Hierbas"].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Precio ($)</label>
            <input type="number" value={form.price} onChange={e => set("price", +e.target.value)} min={0} />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" value={form.stock} onChange={e => set("stock", +e.target.value)} min={0} />
          </div>
          <div className="form-group">
            <label>Salud</label>
            <select value={form.health} onChange={e => set("health", e.target.value)}>
              {["Excelente", "Buena", "Regular", "Mala"].map(h => <option key={h}>{h}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Último riego</label>
            <input value={form.watered} onChange={e => set("watered", e.target.value)} placeholder="Ej. Hace 1 día" />
          </div>
          <div className="form-group">
            <label>Ubicación</label>
            <input value={form.location} onChange={e => set("location", e.target.value)} placeholder="Ej. Sección A" />
          </div>
          <div className="form-group full">
            <label>URL de imagen (base64 o URL)</label>
            <textarea
              value={form.image}
              onChange={e => set("image", e.target.value)}
              placeholder="https://... o data:image/..."
              rows={2}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products({ products, onRefresh }) {
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = products.filter(p =>
    (cat === "All" || p.category === cat) &&
    (!search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.code?.toLowerCase().includes(search.toLowerCase()))
  );

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  const remove = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await api.del(`products/${id}`);
    onRefresh();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Inventario</div>
          <div className="page-sub">GESTIÓN DE PLANTAS Y PRODUCTOS</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({})}>+ Nuevo producto</button>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar planta o código..." />
        </div>
        <select value={cat} onChange={e => setCat(e.target.value)} style={{ width: "auto" }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <div className="empty"><div className="emoji">🌱</div>No hay productos</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Planta</th><th>Código</th><th>Categoría</th>
                <th>Precio</th><th>Stock</th><th>Salud</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="plant-img">
                        {p.image
                          ? <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                          : "🌿"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                        {p.species && (
                          <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontStyle: "italic" }}>{p.species}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-muted">{p.code || "—"}</span></td>
                  <td><span className="badge badge-green">{p.category}</span></td>
                  <td style={{ color: "var(--gold)" }}>${(p.price || 0).toLocaleString("es-MX")}</td>
                  <td>
                    <span className={`badge ${(p.stock || 0) <= 5 ? "badge-gold" : "badge-muted"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${p.health === "Excelente" ? "badge-green" : p.health === "Buena" ? "badge-muted" : "badge-gold"}`}>
                      {p.health}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-ghost" style={{ padding: "5px 10px" }} onClick={() => setModal(p)}>✏️</button>
                      <button className="btn btn-danger" style={{ padding: "5px 10px" }} onClick={() => remove(p.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal !== null && (
        <ProductModal
          product={modal.id ? modal : null}
          onSave={() => { setModal(null); onRefresh(); }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
