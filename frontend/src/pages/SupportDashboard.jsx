import { useEffect, useState } from "react";
import api from "../services/api";
import ComplaintTable from "../components/ComplaintTable";
export default function SupportDashboard() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/complaints").then((r) => setItems(r.data));
  }, []);
  return (
    <>
      <h2>Support Dashboard</h2>
      <div className="row g-3 my-3">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <small>Assigned</small>
              <h3>{items.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <small>In Progress</small>
              <h3>{items.filter((x) => x.status === "IN_PROGRESS").length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <small>Urgent</small>
              <h3>{items.filter((x) => x.priority === "URGENT").length}</h3>
            </div>
          </div>
        </div>
      </div>
      <ComplaintTable items={items} />
    </>
  );
}
