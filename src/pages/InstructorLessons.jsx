import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

export default function InstructorLessons() {
  const { id } = useParams(); // course id
  const courseId = Number(id);

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [order, setOrder] = useState("");

  const [editingId, setEditingId] = useState(null); // lesson id when editing

  const load = async () => {
    try {
      setLoading(true);

      const courseRes = await api.get(`/api/courses/${courseId}/`);
      setCourse(courseRes.data);

      const lessonRes = await api.get(`/api/courses/${courseId}/lessons/`);
      const items = lessonRes.data?.results ?? lessonRes.data ?? [];
      // sort by order just in case
      const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setLessons(sorted);
    } catch (e) {
      alert(e?.response?.data?.detail || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const resetForm = () => {
    setTitle("");
    setVideoUrl("");
    setDuration("");
    setOrder("");
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return alert("Title লাগবে");
    if (!videoUrl.trim()) return alert("Video URL লাগবে");
    if (!duration) return alert("Duration লাগবে");
    if (!order) return alert("Order লাগবে");

    const payload = {
      title: title.trim(),
      video_url: videoUrl.trim(),
      duration: Number(duration),
      order: Number(order),
    };

    try {
      if (editingId) {
        // update lesson
        await api.patch(`/api/lessons/${editingId}/`, payload);
        alert("Lesson updated ✅");
      } else {
        // create lesson for this course
        await api.post(`/api/courses/${courseId}/lessons/`, payload);
        alert("Lesson added ✅");
      }

      resetForm();
      load();
    } catch (e2) {
      alert(
        e2?.response?.data?.detail ||
          JSON.stringify(e2?.response?.data || {}) ||
          "Save failed"
      );
    }
  };

  const startEdit = (l) => {
    setEditingId(l.id);
    setTitle(l.title ?? "");
    setVideoUrl(l.video_url ?? "");
    setDuration(String(l.duration ?? ""));
    setOrder(String(l.order ?? ""));
  };

  const removeLesson = async (lessonId) => {
    if (!confirm("Delete lesson?")) return;
    try {
      await api.delete(`/api/lessons/${lessonId}/`);
      alert("Lesson deleted ✅");
      load();
    } catch (e) {
      alert(e?.response?.data?.detail || "Delete failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Link to="/instructor">← Back to Instructor</Link>

      <h2 style={{ marginTop: 10 }}>
        Manage Lessons {course ? `— ${course.title}` : ""}
      </h2>

      <form onSubmit={submit} style={{ marginTop: 15 }}>
        <h3>{editingId ? "Edit Lesson" : "Add Lesson"}</h3>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: 350 }}
        />
        <br />

        <input
          placeholder="Video URL (YouTube/Vimeo link)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={{ width: 350, marginTop: 8 }}
        />
        <br />

        <input
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          type="number"
          style={{ width: 350, marginTop: 8 }}
        />
        <br />

        <input
          placeholder="Order (position)"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          type="number"
          style={{ width: 350, marginTop: 8 }}
        />
        <br />

        <button type="submit" style={{ marginTop: 10 }}>
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            type="button"
            style={{ marginLeft: 10, marginTop: 10 }}
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      <hr style={{ margin: "20px 0" }} />

      <h3>Lessons</h3>

      {lessons.length === 0 ? (
        <p>No lessons yet.</p>
      ) : (
        <ol>
          {lessons.map((l) => (
            <li key={l.id} style={{ marginBottom: 10 }}>
              <b>
                {l.order}. {l.title}
              </b>{" "}
              <small>({l.duration} min)</small>
              <div style={{ marginTop: 4 }}>
                <button onClick={() => startEdit(l)}>Edit</button>
                <button
                  onClick={() => removeLesson(l.id)}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}