import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const courseRes = await api.get(`/api/courses/${id}/`);
        setCourse(courseRes.data);

        const lessonRes = await api.get(`/api/courses/${id}/lessons/`);
        const items = lessonRes.data.results ?? lessonRes.data;
        setLessons(items);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const enroll = async () => {
    try {
      await api.post("/api/enroll/", { course: Number(id) });
      alert("Enrolled ✅ এখন lessons দেখতে পারবে");
    } catch (e) {
      alert(e?.response?.data?.detail || "Enroll failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Not found</p>;

  return (
    <div>
      <Link to="/">← Back</Link>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p><b>Instructor:</b> {course.instructor}</p>

      <button onClick={enroll}>Enroll</button>

      <h3 style={{ marginTop: 20 }}>Lessons</h3>
      {lessons.length === 0 ? (
        <p>No lessons yet.</p>
      ) : (
        <ol>
          {lessons.map((l) => (
            <li key={l.id}>
              {l.title} (duration: {l.duration} min){" "}
              <Link to={`/lesson/${l.id}`}>Open</Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}