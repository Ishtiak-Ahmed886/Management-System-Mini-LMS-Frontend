import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function MyEnrollments() {
  const [items, setItems] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // 1) load enrollments
        const res = await api.get("/api/my-enrollments/");
        const data = res.data?.results ?? res.data ?? [];
        const enrollments = Array.isArray(data) ? data : [];
        setItems(enrollments);

        // 2) load progress for each enrolled course
        const newMap = {};

        for (const en of enrollments) {
          const courseId =
            typeof en.course === "object" ? en.course?.id : en.course;

          try {
            const pr = await api.get(`/api/courses/${courseId}/progress/`);
            newMap[courseId] = pr.data;
          } catch {
            // ignore if progress endpoint fails
          }
        }

        setProgressMap(newMap);
      } catch (e) {
        if (e?.response?.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          alert("Session expired. Please login again.");
          navigate("/login");
          return;
        }

        alert(e?.response?.data?.detail || "Failed to load enrollments");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

 
  if (loading) return <p className="loading">Loading...</p>;

return (
  <div className="enroll-page">
    <h2 className="page-title">My Enrolled Courses</h2>

    {items.length === 0 ? (
      <p className="empty-text">No enrollments yet.</p>
    ) : (
      <div className="course-list">
        {items.map((en) => {
          const courseId =
            typeof en.course === "object" ? en.course?.id : en.course;

          const courseTitle =
            en.course_title ||
            (typeof en.course === "object"
              ? en.course?.title
              : `Course #${courseId}`);

          const pr = progressMap[courseId];

          return (
            <div className="course-card" key={en.id}>
              <div className="course-info">

                <h3>
                  <Link to={`/courses/${courseId}`}>
                    {courseTitle}
                  </Link>
                </h3>

                <p className="enroll-date">
                  Enrolled:{" "}
                  {en.enrolled_at
                    ? new Date(en.enrolled_at).toLocaleDateString()
                    : "N/A"}
                </p>

                {pr && (
                  <div className="progress-section">

                    <div className="progress-text">
                      {pr.completed_lessons}/{pr.total_lessons} lessons
                      ({pr.progress_percent}%)
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${pr.progress_percent}%` }}
                      />
                    </div>

                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>)
}