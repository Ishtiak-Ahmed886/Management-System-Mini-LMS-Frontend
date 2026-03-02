import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

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
    <div>
      <h2>Courses</h2>
      <ul>
        {courses.map((c) => (
          <li key={c.id}>
  <Link to={`/courses/${c.id}`}>{c.title}</Link> — {c.instructor}
</li>
        ))}
      </ul>
    </div>
  );
}