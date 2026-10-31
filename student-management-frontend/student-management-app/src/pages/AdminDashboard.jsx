import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = ({ navigate }) => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("users");

  const togglePage = (newPage) => {
    setPage(newPage);
    setUsers([]);
    setStudents([]);
    setCourses([]);
  };

  useEffect(() => {
    // In a real app, we'd fetch data from the API with auth token
    // For now, we'll use mock data or just show the structure
    setLoading(false);
  }, [page]);

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h3>Student Management System</h3>
        <ul>
          <li onClick={() => togglePage("users")} className={page === "users" ? "active" : ""}>
            Users
          </li>
          <li onClick={() => togglePage("students")} className={page === "students" ? "active" : ""}>
            Students
          </li>
          <li onClick={() => togglePage("courses")} className={page === "courses" ? "active" : ""}>
            Courses
          </li>
        </ul>
      </div>

      <div className="main-content">
        <header>
          <h2>{page === "users" ? "User Management" : page === "students" ? "Student Management" : "Course Management"}</h2>
          <Link to="/dashboard" className="back-link">Back to Home</Link>
        </header>

        {page === "users" && (
          <div className="card-list">
            <h3>Users ({users.length})</h3>
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  <span>{user.email}</span>
                  <span>{user.full_name || ""}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {page === "students" && (
          <div className="card-list">
            <h3>Students ({students.length})</h3>
            <ul>
              {students.map((student) => (
                <li key={student.id}>
                  <span>{student.name}</span>
                  <span>{student.enrollment_number}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {page === "courses" && (
          <div className="card-list">
            <h3>Courses ({courses.length})</h3>
            <ul>
              {courses.map((course) => (
                <li key={course.id}>
                  <span>{course.name}</span>
                  <span>{course.code}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;