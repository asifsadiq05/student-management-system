import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/courses/")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setLoading(false);
      });
  }, [navigate]);

  const handleDelete = async (courseId) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await fetch(`http://127.0.0.1:8000/courses/${courseId}/`, {
          method: "DELETE",
        });
        setCourses(courses.filter((c) => c.id !== courseId));
      } catch (err) {
        console.error("Error deleting course:", err);
      }
    }
  };

  if (loading) {
    return <div>Loading courses...</div>;
  }

  return (
    <div className="course-list">
      <h2>Course Management</h2>
      <Link to="/courses/add" className="btn-add">
        Add New Course
      </Link>
      <br /><br />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Course Name</th>
              <th>Code</th>
              <th>Credits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.code}</td>
                <td>{course.credits || "-"}</td>
                <td>
                  <Link to={`/courses/${course.id}`} className="btn-edit">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseList;