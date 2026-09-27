import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import CommentSection from "../components/CommentSection";
import { useAuth } from "../context/AuthContext";
export default function ComplaintDetails() {
  const { id } = useParams(),
    nav = useNavigate(),
    { user } = useAuth();
  const [c, setC] = useState(null),
    [acts, setActs] = useState([]),
    [supports, setSupports] = useState([]),
    [status, setStatus] = useState("");
  const load = () =>
    api.get(`/complaints/${id}`).then((r) => {
      setC(r.data);
      setStatus(r.data.status);
    });
  useEffect(() => {
    load();
    api.get(`/complaints/${id}/activities`).then((r) => setActs(r.data));
    if (user?.role === "ADMIN")
      api
        .get("/users")
        .then((r) =>
          setSupports(r.data.filter((x) => x.role === "SUPPORT" && x.active)),
        );
  }, [id]);
  if (!c) return <div>Loading...</div>;
  const change = async () => {
    try {
      const response = await api.put(`/complaints/${id}/status`, {
        status: status,
        resolutionNote:
          status === "RESOLVED"
            ? "Issue resolved by support team."
            : c.resolutionNote,
      });

      // Update complaint immediately
      setC(response.data);
      setStatus(response.data.status);

      // Reload activity timeline
      const activitiesResponse = await api.get(`/complaints/${id}/activities`);
      setActs(activitiesResponse.data);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };
  const assign = async (e) => {
    await api.put(`/complaints/${id}/assign`, {
      supportUserId: Number(e.target.value),
    });
    load();
  };
  return (
    <>
      <div className="d-flex justify-content-between">
        <div>
          <h2>{c.title}</h2>
          <div>
            {c.complaintNumber} · <StatusBadge value={c.status} /> ·{" "}
            <PriorityBadge value={c.priority} />
          </div>
        </div>
        {user?.role === "USER" &&
          (c.status === "SUBMITTED" || c.status === "REOPENED") && (
            <Link
              className="btn btn-outline-primary"
              to={`/complaints/${id}/edit`}
            >
              Edit
            </Link>
          )}
      </div>
      <div className="card mt-3">
        <div className="card-body">
          <p>{c.description}</p>
          <dl className="row">
            <dt className="col-sm-3">Category</dt>
            <dd className="col-sm-9">{c.category?.name}</dd>
            <dt className="col-sm-3">Created by</dt>
            <dd className="col-sm-9">{c.createdBy?.username}</dd>
            <dt className="col-sm-3">Assigned to</dt>
            <dd className="col-sm-9">
              {c.assignedTo?.username || "Unassigned"}
            </dd>
            <dt className="col-sm-3">Created</dt>
            <dd className="col-sm-9">{c.createdAt}</dd>
            <dt className="col-sm-3">Resolution</dt>
            <dd className="col-sm-9">{c.resolutionNote || "—"}</dd>
          </dl>
          {user?.role === "ADMIN" && (
            <div className="row g-2">
              <div className="col-md-6">
                <label>Assign support</label>
                <select
                  className="form-select"
                  value={c.assignedTo?.id || ""}
                  onChange={assign}
                >
                  <option value="">Select</option>
                  {supports.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label>Status</label>
                <div className="input-group">
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {[
                      "UNDER_REVIEW",
                      "ASSIGNED",
                      "IN_PROGRESS",
                      "RESOLVED",
                      "CLOSED",
                      "REOPENED",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                  <button className="btn btn-primary" onClick={change}>
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
          {user?.role === "SUPPORT" && (
            <div className="input-group">
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {["IN_PROGRESS", "RESOLVED", "REOPENED"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={change}>
                Update
              </button>
            </div>
          )}
        </div>
      </div>
      <CommentSection id={id} />
      <section className="card mt-4">
        <div className="card-body">
          <h5>Activity Timeline</h5>
          {acts.map((a) => (
            <div className="timeline-item" key={a.id}>
              <strong>{a.activityType}</strong> — {a.description}
              <div className="small text-muted">
                {a.username} · {a.createdAt?.replace("T", " ")}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
