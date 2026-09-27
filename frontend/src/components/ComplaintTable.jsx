import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
export default function ComplaintTable({ items }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>Number</th>
            <th>Title</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id}>
              <td>{c.complaintNumber}</td>
              <td>{c.title}</td>
              <td>{c.category?.name}</td>
              <td>
                <PriorityBadge value={c.priority} />
              </td>
              <td>
                <StatusBadge value={c.status} />
              </td>
              <td>{c.createdAt?.slice(0, 10)}</td>
              <td>
                <Link
                  className="btn btn-sm btn-outline-primary"
                  to={`/complaints/${c.id}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
