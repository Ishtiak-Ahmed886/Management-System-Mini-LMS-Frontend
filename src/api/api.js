import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ✅ Request: attach access token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response: if 401 => try refresh once, then retry original request
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // if no response, just reject
    if (!error.response) return Promise.reject(error);

    // prevent infinite loop
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        // no refresh -> logout
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // ✅ refresh token request (NO api instance to avoid loop)
        const refreshRes = await axios.post(
          "http://127.0.0.1:8000/api/refresh/",
          { refresh }
        );

        const newAccess = refreshRes.data.access;
        localStorage.setItem("access", newAccess);

        // retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axios(originalRequest);
      } catch (e) {
        // refresh failed -> logout
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;