import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

export default function InstructorLessons() {
  const { id } = useParams(); // course id
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState("");
  const [video_url, setVideoUrl] = useState("");
  const [duration, setDuration] = useState(5);
  const [order, setOrder] = useState(1);

  const load = async () => {
    const res = await api.get(`/api/courses/${id}/lessons/`);
    setLessons(res.data.results ?? res.data);
  };

  useEffect(() => {
    load();
  }, [id]);

  const addLesson = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/courses/${id}/lessons/`, {
        title,
        video_url,
        duration: Number(duration),
        order: Number(order),
      });
      alert("Lesson added ✅");
      setTitle("");
      setVideoUrl("");
      setDuration(5);
      setOrder((prev) => Number(prev) + 1);
      await load();
    } catch (e2) {
      alert(e2?.response?.data?.detail || "Add lesson failed");
    }
  };

  return (
    <div>
      <Link to={`/instructor`}>← Back to Dashboard</Link>
      <h2>Manage Lessons (Course #{id})</h2>

      <h3>Add Lesson</h3>
      <form onSubmit={addLesson}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <input
          placeholder="Video URL"
          value={video_url}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
        />
        <br />
        <input
          type="number"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <br />
        <input
          type="number"
          placeholder="Order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          required
        />
        <br />
        <button type="submit">Add</button>
      </form>

      <h3 style={{ marginTop: 20 }}>Lessons</h3>
      {lessons.length === 0 ? (
        <p>No lessons.</p>
      ) : (
        <ol>
          {lessons.map((l) => (
            <li key={l.id}>
              {l.title} (order {l.order})
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}