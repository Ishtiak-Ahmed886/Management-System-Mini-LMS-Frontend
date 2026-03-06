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
import Navbar from "./components/navBar/NavBar";

export default function App() {
  return (
    <div >
      <Navbar/>

      <Routes>
      <Route
  path="/instructor"
  element={
    <ProtectedRoute>
      <InstructorDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/instructor/courses/:id/lessons"
  element={
    <ProtectedRoute>
      <InstructorLessons />
    </ProtectedRoute>
  }
/>  
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
