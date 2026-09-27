import { useEffect, useState } from "react";
import api from "../services/api";
import ComplaintTable from "../components/ComplaintTable";
export default function AdminDashboard() {
  const [d, setD] = useState(null);
  useEffect(() => {
    api.get("/admin/dashboard").then((r) => setD(r.data));
  }, []);
  if (!d) return <div>Loading...</div>;
  const s = d.stats;
  return (
    <>
      <h2>Admin Dashboard</h2>
      <div className="row g-3 my-3">
        {Object.entries(s).map(([k, v]) => (
          <div className="col-6 col-md-3 col-lg-2" key={k}>
            <div className="card shadow-sm">
              <div className="card-body">
                <small>{k.replace(/([A-Z])/g, " $1")}</small>
                <h4>{v}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h4>Recent complaints</h4>
      <ComplaintTable items={d.recentComplaints} />
      <h4 className="mt-4">By category</h4>
      <div className="row">
        {Object.entries(d.byCategory).map(([k, v]) => (
          <div className="col-md-3" key={k}>
            <div className="alert alert-light border">
              {k}: <strong>{v}</strong>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
