import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [f, setF] = useState({ username: "", password: "" }),
    [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const u = await login(f);
      nav(
        u.role === "ADMIN"
          ? "/admin"
          : u.role === "SUPPORT"
            ? "/support"
            : "/dashboard",
      );
    } catch (x) {
      setError(x.response?.data?.message || "Invalid username or password");
    }
  };
  return (
    <div className="auth-card">
      <h2>Sign in</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}>
        <input
          className="form-control mb-3"
          placeholder="Username"
          value={f.username}
          onChange={(e) => setF({ ...f, username: e.target.value })}
        />
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
        />
        <button className="btn btn-primary w-100">Login</button>
      </form>
      <p className="mt-3">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
