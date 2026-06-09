const API = "http://localhost:3000";
const api = {
  get:  (path)        => fetch(`${API}/${path}`).then(r => r.json()),
  post: (path, body)  => fetch(`${API}/${path}`, { method: "POST",   headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json()),
  put:  (path, body)  => fetch(`${API}/${path}`, { method: "PUT",    headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json()),
  del:  (path)        => fetch(`${API}/${path}`, { method: "DELETE" }).then(r => r.json()),
};

export default api;
