import { useEffect, useState } from "react";
import api from "../services/api";
export default function UserAdmin() {
  const [items, setItems] = useState([]),
    [f, setF] = useState({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      role: "USER",
    });
  const load = () => api.get("/users").then((r) => setItems(r.data));

  useEffect(() => {
    load();
  }, []);
  const add = async (e) => {
    e.preventDefault();
    await api.post("/users", f);
    setF({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      role: "USER",
    });
    load();
  };
  const toggle = async (u) => {
    await api.put(`/users/${u.id}`, {
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      active: !u.active,
    });
    load();
  };
  return (
    <>
      <h2>User Management</h2>
      <form className="card card-body mb-4" onSubmit={add}>
        <div className="row g-2">
          {["firstName", "lastName", "username", "email", "password"].map(
            (k) => (
              <div className="col-md" key={k}>
                <input
                  required
                  className="form-control"
                  placeholder={k}
                  type={
                    k === "password"
                      ? "password"
                      : k === "email"
                        ? "email"
                        : "text"
                  }
                  value={f[k]}
                  onChange={(e) => setF({ ...f, [k]: e.target.value })}
                />
              </div>
            ),
          )}
          <div className="col-md">
            <select
              className="form-select"
              value={f.role}
              onChange={(e) => setF({ ...f, role: e.target.value })}
            >
              <option>USER</option>
              <option>SUPPORT</option>
              <option>ADMIN</option>
            </select>
          </div>
          <div className="col-md-auto">
            <button className="btn btn-primary">Create</button>
          </div>
        </div>
      </form>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Active</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id}>
                <td>
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.active ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => toggle(u)}
                  >
                    {u.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
