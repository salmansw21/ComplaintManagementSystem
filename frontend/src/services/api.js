import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((c) => {
  const t = localStorage.getItem("cms_token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
export default api;
