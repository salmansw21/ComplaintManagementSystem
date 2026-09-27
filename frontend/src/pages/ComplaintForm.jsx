import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
export default function ComplaintForm() {
  const { id } = useParams(),
    nav = useNavigate();
  const [cats, setCats] = useState([]),
    [f, setF] = useState({
      title: "",
      description: "",
      categoryId: "",
      priority: "MEDIUM",
    }),
    [error, setError] = useState("");
  useEffect(() => {
    api.get("/categories").then((r) => setCats(r.data.filter((c) => c.active)));
    if (id)
      api.get(`/complaints/${id}`).then((r) =>
        setF({
          title: r.data.title,
          description: r.data.description,
          categoryId: r.data.category.id,
          priority: r.data.priority,
        }),
      );
  }, [id]);
  const sub = async (e) => {
    e.preventDefault();
    try {
      if (id)
        await api.put(`/complaints/${id}`, {
          ...f,
          categoryId: Number(f.categoryId),
        });
      else
        await api.post("/complaints", {
          ...f,
          categoryId: Number(f.categoryId),
        });
      nav("/complaints");
    } catch (x) {
      setError(x.response?.data?.message || "Unable to save complaint");
    }
  };
  return (
    <div className="form-card">
      <h2>{id ? "Edit" : "Create"} Complaint</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={sub}>
        <label>Title</label>
        <input
          required
          className="form-control mb-3"
          value={f.title}
          onChange={(e) => setF({ ...f, title: e.target.value })}
        />
        <label>Description</label>
        <textarea
          required
          className="form-control mb-3"
          rows="6"
          value={f.description}
          onChange={(e) => setF({ ...f, description: e.target.value })}
        />
        <label>Category</label>
        <select
          required
          className="form-select mb-3"
          value={f.categoryId}
          onChange={(e) => setF({ ...f, categoryId: e.target.value })}
        >
          <option value="">Select category</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <label>Priority</label>
        <select
          className="form-select mb-3"
          value={f.priority}
          onChange={(e) => setF({ ...f, priority: e.target.value })}
        >
          {["LOW", "MEDIUM", "HIGH", "URGENT"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <button className="btn btn-primary">Save Complaint</button>
      </form>
    </div>
  );
}
