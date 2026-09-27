import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Register() {
  const [f, setF] = useState({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    }),
    [error, setError] = useState("");
  const { register } = useAuth();
  const nav = useNavigate();
  const sub = async (e) => {
    e.preventDefault();
    try {
      await register(f);
      nav("/dashboard");
    } catch (x) {
      setError(x.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div className="auth-card">
      <h2>Create account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={sub}>
        {[
          ["firstName", "First name"],
          ["lastName", "Last name"],
          ["username", "Username"],
          ["email", "Email"],
        ].map(([k, p]) => (
          <input
            key={k}
            className="form-control mb-3"
            placeholder={p}
            type={k === "email" ? "email" : "text"}
            value={f[k]}
            onChange={(e) => setF({ ...f, [k]: e.target.value })}
          />
        ))}
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
        />
        <button className="btn btn-primary w-100">Register</button>
      </form>
      <p className="mt-3">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
