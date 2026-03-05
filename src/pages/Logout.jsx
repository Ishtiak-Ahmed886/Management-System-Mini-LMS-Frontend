import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const nav = useNavigate();

  useEffect(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    alert("Logged out ✅");
    nav("/login");
  }, [nav]);

  return <p>Logging out...</p>;
}