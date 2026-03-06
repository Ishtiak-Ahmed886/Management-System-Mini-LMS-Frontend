import { useEffect, useState } from "react";
import api from "../api/api";
import CourseCard from "../components/courses/CourseCard";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/courses/")
      .then((res) => {
        const data = res.data.results ?? res.data;
        setCourses(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Backend connect hocche na");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>All Courses</h2>
      <hr />
      <div className="course-grid">
        {courses.map((c) => (
          <CourseCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}