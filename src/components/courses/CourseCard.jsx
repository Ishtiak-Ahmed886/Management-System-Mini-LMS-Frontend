import { Link } from "react-router-dom";
import "./CourseCard.css";
const CourseCard = ({c}) => {
    return <div className="course-card" key={c.id}>      
      <img 
        src={c.thumbnail} 
        alt={c.title} 
        className="course-thumbnail"
      />

      <div className="course-content">
        <h3 className="course-title">
          <Link to={`/courses/${c.id}`}>{c.title}</Link>
        </h3>

        <p className="course-instructor">
          Instructor: {c.instructor}
        </p>

        <Link to={`/courses/${c.id}`} className="course-btn">
          View Course
        </Link>
      </div>
</div>
}



export default CourseCard;