import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

export default function InstructorLessons() {
  const { id } = useParams(); // course id

  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/courses/${id}/lessons/`);
      const items = res.data.results ?? res.data;
      setLessons(items);
    } catch (e) {
      alert(e?.response?.data?.detail || "Lessons load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, [id]);

  const addLesson = async (e) => {
    e.preventDefault();

    if (!title.trim()) return alert("Title required");
    if (!videoUrl.trim()) return alert("Video URL required");

    try {
      await api.post(`/api/courses/${id}/lessons/`, {
        title,
        video_url: videoUrl,
        duration: Number(duration || 0),
        order: Number(order || 1),
      });

      alert("Lesson added ✅");
      setTitle("");
      setVideoUrl("");
      setDuration("");
      setOrder("");
      loadLessons();
    } catch (e) {
      alert(e?.response?.data?.detail || "Add lesson failed");
    }
  };

  const deleteLesson = async (lessonId) => {
    if (!confirm("Delete this lesson?")) return;

    try {
      await api.delete(`/api/lessons/${lessonId}/`);
      alert("Lesson deleted ✅");
      loadLessons();
    } catch (e) {
      alert(e?.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Link to="/instructor">← Back</Link>

      <h2>Manage Lessons (Course #{id})</h2>

      <h3>Add Lesson</h3>
      <form onSubmit={addLesson}>
        <input
          placeholder="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: 420 }}
        />
        <br />
        <br />

        <input
          placeholder="YouTube/Vimeo URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={{ width: 420 }}
        />
        <br />
        <br />

        <input
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{ width: 200 }}
        />{" "}
        <input
          placeholder="Order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          style={{ width: 200 }}
        />
        <br />
        <br />

        <button type="submit">Add Lesson</button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <h3>Lessons</h3>

      {loading ? (
        <p>Loading...</p>
      ) : lessons.length === 0 ? (
        <p>No lessons yet.</p>
      ) : (
        <ol>
          {lessons.map((l) => (
            <li key={l.id} style={{ marginBottom: 8 }}>
              <b>{l.title}</b> (order: {l.order}, {l.duration} min){" "}
              <button onClick={() => deleteLesson(l.id)}>Delete</button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}