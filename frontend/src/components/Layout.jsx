import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Layout({ children }) {
  const { user, logout } = useAuth();
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/dashboard">
            CMS
          </Link>
          <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#nav"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div id="nav" className="collapse navbar-collapse">
            <div className="navbar-nav me-auto">
              <NavLink className="nav-link" to="/complaints">
                Complaints
              </NavLink>
              {user?.role === "ADMIN" && (
                <>
                  <NavLink className="nav-link" to="/admin">
                    Admin
                  </NavLink>
                  <NavLink className="nav-link" to="/admin/users">
                    Users
                  </NavLink>
                  <NavLink className="nav-link" to="/admin/categories">
                    Categories
                  </NavLink>
                </>
              )}
              {user?.role === "SUPPORT" && (
                <NavLink className="nav-link" to="/support">
                  Support
                </NavLink>
              )}
            </div>
            <span className="navbar-text me-3">
              {user?.firstName} ({user?.role})
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="container py-4">{children}</main>
      <footer className="border-top py-3 text-center">
        © 2026 Complaint Management System — Developed by Salman Khan
      </footer>
    </>
  );
}
