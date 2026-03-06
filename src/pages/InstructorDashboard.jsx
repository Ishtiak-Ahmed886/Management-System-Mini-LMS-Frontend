import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import Courses from "./Courses";

export default function InstructorDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
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
        description,thumbnail
      });

      alert("Course created ✅");
      setTitle("");
      setDescription("");
      setThumbnail("")
      loadCourses();
    } catch (e) {
      alert(e?.response?.data?.detail || "Create failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="dashboard">

  <h2 className="dashboard-title">Instructor Dashboard</h2>

  <div className="create-course-card">

    <h3>Create Course</h3>

    <form onSubmit={createCourse} className="course-form">

      <div className="form-group">
        <label>Course Title</label>
        <input
          type="text"
          placeholder="Enter course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Course Description</label>
        <textarea
          placeholder="Enter course description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>Course Thumbnail</label>
      <input
  type="text"
  placeholder="Thumbnail Image URL"
  value={thumbnail}
  onChange={(e) => setThumbnail(e.target.value)}
/>
      </div>

      <button type="submit" className="create-btn">
        Create Course
      </button>

    </form>

  </div>

</div>


      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
       <Courses/>
      )}
    </div>
  );
}