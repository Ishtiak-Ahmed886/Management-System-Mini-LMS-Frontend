import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { User,Lock, LogIn, UserRoundPlus } from 'lucide-react';


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


  const handleSubmit = async (e) => {
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
    <div style={{
      height: "100vh",
      display:"flex",
      justifyContent: "center",
      alignItems: "center"
    }}>

      <form className="form" onSubmit={handleSubmit}>

      <h2 id="heading">Login</h2>

      <div className="field">

       <User/>

        <input
          placeholder="Username"
          className="input-field"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

      </div>

      <div className="field">

       <Lock />

        <input
          placeholder="Password"
          className="input-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

      </div>

      <div className="btn">
        <button type="submit" className="button1">
         <LogIn/> Login
        </button>
<Link to="/register" style={{ textDecoration: "none" }}>
        <button type="button" className="button2">
         <UserRoundPlus /> Sign Up
        </button>
</Link>
      </div>


    </form>

    </div>
  );
}