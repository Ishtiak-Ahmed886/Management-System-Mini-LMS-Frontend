import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

export default function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // course info
        const courseRes = await api.get(`/api/courses/${id}/`);
        setCourse(courseRes.data);

        // lessons
        const lessonRes = await api.get(`/api/courses/${id}/lessons/`);
        setLessons(lessonRes.data.results ?? lessonRes.data);

        // progress (optional)
        try {
          const progressRes = await api.get(`/api/courses/${id}/progress/`);
          setProgress(progressRes.data);
        } catch {}
      } catch (err) {
        console.error(err);
        alert("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const enroll = async () => {
    try {
      setEnrolling(true);

      // ✅ FIXED
      await api.post("/api/enroll/", { course_id: Number(id) });

      alert("Enrollment successful ✅");

      // reload to refresh progress
      window.location.reload();
    } catch (e) {
      alert(e?.response?.data?.detail || "Enroll failed");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <div>
      <Link to="/">← Back</Link>

      <h2>{course.title}</h2>
      <p>{course.description}</p>

      <p>
        <b>Instructor:</b> {course.instructor}
      </p>

      <button onClick={enroll} disabled={enrolling}>
        {enrolling ? "Enrolling..." : "Enroll"}
      </button>

{progress && (
  <div style={{ marginTop: 15 }}>
    <p>
      <b>Progress:</b> {progress.completed_lessons} / {progress.total_lessons} (
      {progress.progress_percent}%)
    </p>

    <div style={{ width: 320, height: 12, border: "1px solid #ccc" }}>
      <div
        style={{
          height: "100%",
          width: `${progress.progress_percent}%`,
          background: "green",
        }}
      />
    </div>
  </div>
)}

      <h3>Lessons</h3>

      {lessons.length === 0 ? (
        <p>No lessons yet.</p>
      ) : (
        <ol>
          {lessons.map((l) => (
            <li key={l.id}>
              {l.title} ({l.duration} min){" "}
              <Link to={`/lesson/${l.id}`}>Open</Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}