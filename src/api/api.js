import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  const url = config.url || "";

  // ✅ Login/Register এ token লাগবে না (old token problem fix)
  const isAuthEndpoint =
    url.includes("/api/login/") || url.includes("/api/refresh/") || url.includes("/api/register/");

  if (!isAuthEndpoint) {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;