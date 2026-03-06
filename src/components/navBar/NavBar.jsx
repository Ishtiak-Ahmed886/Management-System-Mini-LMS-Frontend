import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">

      <h1 className="logo">Mini LMS</h1>

      <nav className="nav-links">
        <Link to="/">Courses</Link>
        <Link to="/instructor">Instructor</Link>
        <Link to="/my-enrollments">My Enrollments</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/logout" className="logout">Logout</Link>
      </nav>

    </header>
  );
}