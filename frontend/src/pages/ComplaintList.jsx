import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ComplaintTable from "../components/ComplaintTable";
import LoadingSpinner from "../components/LoadingSpinner";
export default function ComplaintList() {
  const [items, setItems] = useState(null),
    [q, setQ] = useState("");
  const load = () =>
    api
      .get("/complaints", { params: { q: q || undefined } })
      .then((r) => setItems(r.data));
  useEffect(() => {
    load();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <h2>Complaints</h2>
        <Link className="btn btn-primary" to="/complaints/create">
          New Complaint
        </Link>
      </div>
      <div className="input-group mb-3">
        <input
          className="form-control"
          placeholder="Search complaint number, title or user"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={load}>
          Search
        </button>
      </div>
      {items ? <ComplaintTable items={items} /> : <LoadingSpinner />}
    </>
  );
}
