import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function InstructorDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/courses/");
      const items = res.data.results ?? res.data;

      const myUsername = localStorage.getItem("username");
      const myCourses = myUsername
        ? items.filter((c) => c.instructor === myUsername)
        : items;

      setCourses(myCourses);
    } catch (e) {
      alert(e?.response?.data?.detail || "Courses load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const createCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/courses/", { title, description });
      alert("Course created ✅");
      setTitle("");
      setDescription("");
      await loadCourses();
    } catch (e2) {
      alert(e2?.response?.data?.detail || "Create failed");
    }
  };

  return (
    <div>
      <h2>Instructor Dashboard</h2>

      <h3>Create Course</h3>
      <form onSubmit={createCourse}>
        <input
          placeholder="Course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Course description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          style={{ width: "100%" }}
        />
        <br />
        <button type="submit">Create</button>
      </form>

      <h3 style={{ marginTop: 20 }}>My Courses</h3>
      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <ul>
          {courses.map((c) => (
            <li key={c.id}>
              <Link to={`/courses/${c.id}`}>{c.title}</Link>{" "}
              | <Link to={`/instructor/course/${c.id}/lessons`}>Manage Lessons</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}