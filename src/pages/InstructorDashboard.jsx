import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

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
      setCourses(items);
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

    if (!title.trim()) return alert("Title required");
    if (!description.trim()) return alert("Description required");

    try {
      await api.post("/api/courses/", {
        title,
        description,
      });

      alert("Course created ✅");
      setTitle("");
      setDescription("");
      loadCourses();
    } catch (e) {
      alert(e?.response?.data?.detail || "Create failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Instructor Dashboard</h2>

      <h3>Create Course</h3>
      <form onSubmit={createCourse}>
        <input
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: 320 }}
        />
        <br />
        <br />
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{ width: 320 }}
        />
        <br />
        <br />
        <button type="submit">Create</button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <h3>All Courses</h3>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <ul>
          {courses.map((c) => (
            <li key={c.id} style={{ marginBottom: 8 }}>
              <b>{c.title}</b> — {c.instructor}{" "}
              <Link to={`/instructor/courses/${c.id}/lessons`}>
                Manage Lessons
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}