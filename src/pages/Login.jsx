import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  // ✅ If already logged in, redirect
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      navigate("/");
    }
  }, [navigate]);


  const submit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const res = await api.post("/api/login/", {
        username,
        password,
      });

      // ✅ Save tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      alert("Login successful ✅");

      // redirect after login
      navigate("/");

    } catch (err) {

      alert(err?.response?.data?.detail || "Login failed");

    } finally {

      setLoading(false);

    }
  };


  return (
    <div style={{ padding: 20 }}>

      <h2>Login</h2>

      <form onSubmit={submit}>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <br />
        <br />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button disabled={loading} type="submit">
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  );
}