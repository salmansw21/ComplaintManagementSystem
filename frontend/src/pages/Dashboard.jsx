import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ComplaintTable from "../components/ComplaintTable";
import LoadingSpinner from "../components/LoadingSpinner";
export default function Dashboard() {
  const [d, setD] = useState(null);
  useEffect(() => {
    api.get("/dashboard").then((r) => setD(r.data));
  }, []);
  if (!d) return <LoadingSpinner />;
  const s = d.stats;
  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <div>
          <h2>My Dashboard</h2>
          <p className="text-muted">Overview of your complaint activity.</p>
        </div>
        <Link className="btn btn-primary" to="/complaints/create">
          Create Complaint
        </Link>
      </div>
      <div className="row g-3 mb-4">
        {[
          ["Total", s.totalComplaints],
          ["Submitted", s.submitted],
          ["In Progress", s.inProgress],
          ["Resolved", s.resolved],
          ["Closed", s.closed],
          ["Reopened", s.reopened],
        ].map((x) => (
          <div className="col-6 col-md-2" key={x[0]}>
            <div className="card shadow-sm">
              <div className="card-body">
                <small>{x[0]}</small>
                <h3>{x[1]}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h4>Recent complaints</h4>
      <ComplaintTable items={d.recentComplaints} />
    </>
  );
}
