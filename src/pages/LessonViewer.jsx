import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function LessonViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lessonId = Number(id);

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  const [completed, setCompleted] = useState(false);
  const [marking, setMarking] = useState(false);

  // ✅ Convert YouTube/Vimeo link to embed link safely
  const embedUrl = useMemo(() => {
    if (!lesson?.video_url) return "";

    const url = lesson.video_url.trim();

    // YouTube: watch?v= -> embed/
    if (url.includes("youtube.com/watch")) {
      return url.replace("watch?v=", "embed/");
    }

    // YouTube short: youtu.be/VIDEO -> youtube.com/embed/VIDEO
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    // Vimeo: vimeo.com/123 -> player.vimeo.com/video/123
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1]?.split(/[?&]/)[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }

    // If already embed or other link, return as-is
    return url;
  }, [lesson]);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);

        // ✅ lesson details
        const res = await api.get(`/api/lessons/${lessonId}/`);
        setLesson(res.data);

        // ✅ OPTIONAL: try to detect completion (if you later add endpoint)
        // If you don't have a "lesson progress status" endpoint, ignore silently.
        // Example future endpoint: /api/progress/status/?lesson=ID
        // try {
        //   const pr = await api.get(`/api/progress/status/?lesson=${lessonId}`);
        //   setCompleted(!!pr.data?.completed);
        // } catch {}

      } catch (e) {
        if (e?.response?.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          alert("Session expired. Please login again.");
          navigate("/login");
          return;
        }

        alert(e?.response?.data?.detail || "Lesson load failed");
      } finally {
        setLoading(false);
      }
    };

    if (!Number.isFinite(lessonId)) return;
    loadLesson();
  }, [lessonId, navigate]);

  const markComplete = async () => {
    try {
      setMarking(true);

      await api.post("/api/progress/complete/", { lesson: lessonId });

      setCompleted(true);
      alert("Lesson marked complete ✅");
    } catch (e) {
      if (e?.response?.status === 401) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      alert(e?.response?.data?.detail || "Mark complete failed");
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!lesson) return <p>Lesson not found</p>;

  return (
    <div className="lesson-page">
  <div className="lesson-card">

    <Link to={-1} className="back-link">← Back To Course</Link>

    <h2 className="lesson-title">{lesson.title}</h2>

    <p className="lesson-duration">
      <b>Duration:</b> {lesson.duration} minutes
    </p>

    {/* Video */}
    {embedUrl ? (
      <div className="video-wrapper">
        <iframe
          src={embedUrl}
          title="Lesson Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    ) : (
      <p className="no-video">No video URL provided.</p>
    )}

    <p className="open-link">
      <a href={lesson.video_url} target="_blank" rel="noreferrer">
        Open original link
      </a>
    </p>

    <button
      className={`complete-btn ${completed ? "done" : ""}`}
      onClick={markComplete}
      disabled={completed || marking}
    >
      {completed ? "Completed ✅" : marking ? "Marking..." : "Mark Complete"}
    </button>

  </div>
</div>
  );
}