import { useEffect, useState } from "react";
import api from "../services/api";
import ErrorMessage from "./ErrorMessage";
export default function CommentSection({ id }) {
  const [items, setItems] = useState([]),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const load = () =>
    api
      .get(`/complaints/${id}/comments`)
      .then((r) => setItems(r.data))
      .catch((e) =>
        setError(e.response?.data?.message || "Unable to load comments"),
      );
  useEffect(() => {
    load();
  }, [id]);
  const add = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await api.post(`/complaints/${id}/comments`, { message });
      setMessage("");
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Unable to add comment");
    }
  };
  return (
    <section className="card mt-4">
      <div className="card-body">
        <h5>Comments</h5>
        <ErrorMessage message={error} />
        {items.map((x) => (
          <div className="border-bottom py-2" key={x.id}>
            <strong>{x.username}</strong>
            <small className="text-muted ms-2">
              {x.createdAt?.replace("T", " ")}
            </small>
            <div>{x.message}</div>
          </div>
        ))}
        <form className="mt-3" onSubmit={add}>
          <textarea
            className="form-control mb-2"
            rows="3"
            placeholder="Add a comment..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="btn btn-primary">Add Comment</button>
        </form>
      </div>
    </section>
  );
}
