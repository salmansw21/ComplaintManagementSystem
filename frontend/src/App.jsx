import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ComplaintList from "./pages/ComplaintList";
import ComplaintForm from "./pages/ComplaintForm";
import ComplaintDetails from "./pages/ComplaintDetails";
import AdminDashboard from "./pages/AdminDashboard";
import SupportDashboard from "./pages/SupportDashboard";
import UserAdmin from "./pages/UserAdmin";
import CategoryAdmin from "./pages/CategoryAdmin";
import Profile from "./pages/Profile";
function Home() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return (
    <Navigate
      to={
        user.role === "ADMIN"
          ? "/admin"
          : user.role === "SUPPORT"
            ? "/support"
            : "/dashboard"
      }
    />
  );
}
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/complaints" element={<ComplaintList />} />
                    <Route
                      path="/complaints/create"
                      element={<ComplaintForm />}
                    />
                    <Route
                      path="/complaints/:id"
                      element={<ComplaintDetails />}
                    />
                    <Route
                      path="/complaints/:id/edit"
                      element={<ComplaintForm />}
                    />
                    <Route path="/profile" element={<Profile />} />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute roles={["ADMIN"]}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <ProtectedRoute roles={["ADMIN"]}>
                          <UserAdmin />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/categories"
                      element={
                        <ProtectedRoute roles={["ADMIN"]}>
                          <CategoryAdmin />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/support"
                      element={
                        <ProtectedRoute roles={["SUPPORT", "ADMIN"]}>
                          <SupportDashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
