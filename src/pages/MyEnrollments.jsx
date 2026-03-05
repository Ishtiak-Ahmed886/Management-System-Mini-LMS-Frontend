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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Enrolled Courses</h2>

      {items.length === 0 ? (
        <p>No enrollments yet.</p>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
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
              <li key={en.id} style={{ marginBottom: 14 }}>
                <Link to={`/courses/${courseId}`}>{courseTitle}</Link>{" "}
                <small>
                  ({en.enrolled_at
                    ? new Date(en.enrolled_at).toLocaleString()
                    : "N/A"})
                </small>

                {/* ✅ Progress UI */}
                {pr && (
                  <div style={{ marginTop: 6 }}>
                    <small>
                      Progress: {pr.completed_lessons}/{pr.total_lessons} (
                      {pr.progress_percent}%)
                    </small>

                    <div
                      style={{
                        width: 260,
                        height: 10,
                        border: "1px solid #ccc",
                        marginTop: 4,
                      }}
                    >
                      <div
                        style={{
                          width: `${pr.progress_percent}%`,
                          height: "100%",
                          background: "green",
                        }}
                      />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}