import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
const C = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cms_user"));
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("cms_token"));
  const navigate = useNavigate();
  useEffect(() => {
    const i = api.interceptors.response.use(
      (r) => r,
      (e) => {
        if (e.response?.status === 401) {
          localStorage.removeItem("cms_token");
          localStorage.removeItem("cms_user");
          setToken(null);
          setUser(null);
          navigate("/login");
        }
        return Promise.reject(e);
      },
    );
    return () => api.interceptors.response.eject(i);
  }, [navigate]);
  const login = async (d) => {
    const r = await api.post("/auth/login", d);
    localStorage.setItem("cms_token", r.data.token);
    localStorage.setItem("cms_user", JSON.stringify(r.data.user));
    setToken(r.data.token);
    setUser(r.data.user);
    return r.data.user;
  };
  const register = async (d) => {
    const r = await api.post("/auth/register", d);
    localStorage.setItem("cms_token", r.data.token);
    localStorage.setItem("cms_user", JSON.stringify(r.data.user));
    setToken(r.data.token);
    setUser(r.data.user);
    return r.data.user;
  };
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    navigate("/login");
  };
  return (
    <C.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        userRole: user?.role,
        login,
        register,
        logout,
      }}
    >
      {children}
    </C.Provider>
  );
}
export const useAuth = () => useContext(C);
