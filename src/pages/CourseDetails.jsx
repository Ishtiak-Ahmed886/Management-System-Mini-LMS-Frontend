import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import CourseDetailsCard from "../components/courses/CourseDetailsCard";

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
    <div style={{ padding: "2rem" }}>
      <Link to="/" className="back-link">← Back to Courses</Link>
      <br />
      <CourseDetailsCard 
  course={course}
  lessons={lessons}
  progress={progress}
  enroll={enroll}
  enrolling={enrolling}
      />
    </div>
  );
}