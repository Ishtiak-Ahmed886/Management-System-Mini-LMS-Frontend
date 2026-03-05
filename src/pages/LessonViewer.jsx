import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

export default function LessonViewer() {

  const { id } = useParams();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {

    const loadLesson = async () => {
      try {

        setLoading(true);

        const res = await api.get(`/api/lessons/${id}/`);

        setLesson(res.data);

      } catch (e) {

        alert(e?.response?.data?.detail || "Lesson load failed");

      } finally {

        setLoading(false);

      }
    };

    loadLesson();

  }, [id]);


  const markComplete = async () => {

    try {

      await api.post("/api/progress/complete/", {
        lesson: Number(id),
      });

      alert("Lesson marked complete ✅");

      setCompleted(true);

    } catch (e) {

      alert(e?.response?.data?.detail || "Mark complete failed");

    }
  };


  if (loading) return <p>Loading...</p>;

  if (!lesson) return <p>Lesson not found</p>;


  return (
    <div>

      <Link to={-1}>← Back</Link>

      <h2>{lesson.title}</h2>

      <p>
        <b>Duration:</b> {lesson.duration} minutes
      </p>


      {/* Video Embed */}
      {lesson.video_url && (
        <div style={{ marginTop: 20 }}>
          <iframe
            width="700"
            height="400"
            src={lesson.video_url.replace("watch?v=", "embed/")}
            title="Lesson Video"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      )}


      <div style={{ marginTop: 20 }}>

        <button
          onClick={markComplete}
          disabled={completed}
        >
          {completed ? "Completed ✅" : "Mark Complete"}
        </button>

      </div>

    </div>
  );
}