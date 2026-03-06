import { Link } from "react-router-dom";
import "./CourseDetails.css";

export default function CourseDetailsCard({
  course,
  lessons,
  progress,
  enroll,
  enrolling,
}) {
  return (
    <div className="course-details">

      

      <div className="course-details-card">

        <img
          src={course.thumbnail}
          alt={course.title}
          className="course-details-thumbnail"
        />

        <div className="course-details-content">

          <h2 className="course-details-title">{course.title}</h2>

          <p className="course-details-instructor">
            Instructor: {course.instructor}
          </p>

          <p className="course-details-description">
            {course.description}
          </p>

          <button
            className="enroll-btn"
            onClick={enroll}
            disabled={enrolling}
          >
            {enrolling ? "Enrolling..." : "Enroll"}
          </button>

          {progress && (
            <div className="progress-section">

              <p>
                Progress: {progress.completed_lessons} / {progress.total_lessons} ({progress.progress_percent}%)
              </p>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress.progress_percent}%` }}
                />
              </div>

            </div>
          )}

          <h3 className="lesson-heading">Lessons</h3>

          {lessons.length === 0 ? (
            <p>No lessons available.</p>
          ) : (
            <ul className="lesson-list">
              {lessons.map((l) => (
                <li key={l.id} className="lesson-item">

                  <span>
                    {l.title} ({l.duration} min)
                  </span>

                  <Link
                    to={`/lesson/${l.id}`}
                    className="lesson-open-btn"
                  >
                    Open
                  </Link>

                </li>
              ))}
            </ul>
          )}

        </div>

      </div>
    </div>
  );
}