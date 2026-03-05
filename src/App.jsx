import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import LessonViewer from "./pages/LessonViewer";
import MyEnrollments from "./pages/MyEnrollments";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorLessons from "./pages/InstructorLessons";
import Logout from "./pages/Logout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>Mini LMS</h1>

      <nav style={{ marginBottom: 20 }}>
        <Link to="/instructor">Instructor</Link>
        <Link to="/">Courses</Link> {" | "}
        <Link to="/login">Login</Link> {" | "}
        <Link to="/register">Register</Link> {" | "}
        <Link to="/my-enrollments">My Enrollments</Link>
        <Link to="/logout">Logout</Link>
      </nav>

      <Routes>
        <Route
  path="/my-enrollments"
  element={
    <ProtectedRoute>
      <MyEnrollments />
    </ProtectedRoute>
  }
/>

<Route
  path="/lesson/:id"
  element={
    <ProtectedRoute>
      <LessonViewer />
    </ProtectedRoute>
  }
/>
        <Route path="/logout" element={<Logout />} />
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/instructor/course/:id/lessons" element={<InstructorLessons />} />
        <Route path="/" element={<Courses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/lesson/:id" element={<LessonViewer />} />

        <Route path="/my-enrollments" element={<MyEnrollments />} />
      </Routes>
    </div>
  );
}
