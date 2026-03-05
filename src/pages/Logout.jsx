import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ tokens remove
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    alert("Logged out ✅");
    navigate("/login");
  }, [navigate]);

  return null;
}