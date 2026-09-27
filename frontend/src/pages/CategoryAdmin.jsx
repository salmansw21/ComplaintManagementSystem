import { useEffect, useState } from "react";
import api from "../services/api";
export default function CategoryAdmin() {
  const [items, setItems] = useState([]),
    [f, setF] = useState({ name: "", description: "", active: true });
  const load = () => api.get("/categories").then((r) => setItems(r.data));

  useEffect(() => {
    load();
  }, []);
  const add = async (e) => {
    e.preventDefault();
    await api.post("/categories", f);
    setF({ name: "", description: "", active: true });
    load();
  };
  const toggle = async (c) => {
    await api.put(`/categories/${c.id}`, { ...c, active: !c.active });
    load();
  };
  return (
    <>
      <h2>Category Management</h2>
      <form className="card card-body mb-4" onSubmit={add}>
        <div className="row g-2">
          <div className="col-md-4">
            <input
              required
              className="form-control"
              placeholder="Category name"
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Description"
              value={f.description}
              onChange={(e) => setF({ ...f, description: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100">Add</button>
          </div>
        </div>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Active</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.description}</td>
              <td>{c.active ? "Yes" : "No"}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => toggle(c)}
                >
                  {c.active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
