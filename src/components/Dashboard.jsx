export default function Dashboard({ products, users, sales, user }) {
  const totalRevenue = sales.reduce((s, sale) => s + (sale.total || 0), 0);
  const lowStock = products.filter(p => (p.stock || 0) <= 5);

  return (
    <div>
      <div className="welcome-header">
        <div className="greeting">
          Bienvenido, <em>{user.name?.split(" ")[0]}</em>
        </div>
        <div className="page-sub">
          PANEL PRINCIPAL ·{" "}
          {new Date()
            .toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
            .toUpperCase()}
        </div>
      </div>

      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-label">🌿 Productos</div>
          <div className="stat-val">{products.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">💰 Ventas totales</div>
          <div className="stat-val">${totalRevenue.toLocaleString("es-MX")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">🧾 Transacciones</div>
          <div className="stat-val">{sales.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">👥 Usuarios</div>
          <div className="stat-val">{users.length}</div>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>⚠️ Stock bajo</div>
            <span className="badge badge-gold">{lowStock.length} producto(s)</span>
          </div>
          <table>
            <thead>
              <tr><th>Producto</th><th>Código</th><th>Stock</th></tr>
            </thead>
            <tbody>
              {lowStock.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td><span className="badge badge-muted">{p.code || "—"}</span></td>
                  <td><span className="badge badge-gold">{p.stock} unidades</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card">
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: 16 }}>
          Ventas recientes
        </div>
        {sales.length === 0 ? (
          <div className="empty"><div className="emoji">🧾</div>Sin ventas registradas</div>
        ) : (
          <table>
            <thead>
              <tr><th>Código</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {sales.slice(0, 8).map(s => (
                <tr key={s.id}>
                  <td><span className="badge badge-muted">{s.code || "—"}</span></td>
                  <td>{s.client || "—"}</td>
                  <td style={{ color: "var(--green)" }}>${(s.total || 0).toLocaleString("es-MX")}</td>
                  <td><span className="badge badge-green">{s.status}</span></td>
                  <td style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
                    {s.date ? new Date(s.date).toLocaleDateString("es-MX") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
