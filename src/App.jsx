import { useState, useEffect, useCallback } from "react";
import api from "./api";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Sales from "./components/Sales";
import Users from "./components/Users";
import "./styles/global.css";

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("cg_user") || "null"); }
    catch { return null; }
  });
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [p, u, s] = await Promise.all([
      api.get("products"),
      api.get("users"),
      api.get("sales"),
    ]);
    setProducts(Array.isArray(p) ? p : []);
    setUsers(Array.isArray(u) ? u : []);
    setSales(Array.isArray(s) ? s : []);
    setLoading(false);
  }, []);

  useEffect(() => { if (user) load(); }, [user, load]);

  const login  = (u) => { sessionStorage.setItem("cg_user", JSON.stringify(u)); setUser(u); };
  const logout = ()  => { sessionStorage.removeItem("cg_user"); setUser(null); };

  if (!user) return <><div className="leaf-bg" /><Login onLogin={login} /></>;

  const nav = [
    { id: "dashboard", icon: "🏡", label: "Panel principal" },
    { id: "products",  icon: "🌿", label: "Inventario" },
    { id: "sales",     icon: "🧾", label: "Ventas" },
    ...(user.role === "admin" || user.role === "gerente"
      ? [{ id: "users", icon: "👥", label: "Usuarios" }]
      : []),
  ];

  return (
    <div className="shell">
      <div className="leaf-bg" />
      <div className="sidebar">
        <div className="logo">🌱 Cosmo<span>Garden</span></div>
        <nav className="nav">
          {nav.map(n => (
            <button
              key={n.id}
              className={`nav-item${page === n.id ? " active" : ""}`}
              onClick={() => setPage(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-dot" />
            <div>
              <div style={{ color: "var(--text)", fontSize: "0.78rem" }}>{user.name}</div>
              <div style={{ fontSize: "0.68rem" }}>{user.role}</div>
            </div>
          </div>
          <button
            className="btn btn-ghost"
            style={{ marginTop: 12, width: "100%", fontSize: "0.72rem" }}
            onClick={logout}
          >
            ← Cerrar sesión
          </button>
        </div>
      </div>

      <main className="main">
        {loading ? (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: "60vh", color: "var(--muted)",
            fontFamily: "var(--font-display)", fontSize: "1.2rem", fontStyle: "italic",
          }}>
            Cargando datos...
          </div>
        ) : (
          <>
            {page === "dashboard" && <Dashboard products={products} users={users} sales={sales} user={user} />}
            {page === "products"  && <Products products={products} onRefresh={load} />}
            {page === "sales"     && <Sales sales={sales} onRefresh={load} />}
            {page === "users"     && <Users users={users} onRefresh={load} />}
          </>
        )}
      </main>
    </div>
  );
}
