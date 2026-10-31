import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch students from API
    // In production, would include auth header
    fetch("http://127.0.0.1:8000/students/")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setLoading(false);
      });
  }, [navigate]);

  const handleDelete = async (studentId) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await fetch(`http://127.0.0.1:8000/students/${studentId}/`, {
          method: "DELETE",
        });
        setStudents(students.filter((s) => s.id !== studentId));
      } catch (err) {
        console.error("Error deleting student:", err);
      }
    }
  };

  if (loading) {
    return <div>Loading students...</div>;
  }

  return (
    <div className="student-list">
      <h2>Student Management</h2>
      <Link to="/students/add" className="btn-add">
      Add New Student</Link>
      <br /><br />
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Enrollment Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.enrollment_number}</td>
                <td>
                  <Link to={`/students/${student.id}`} className="btn-edit">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(student.id)}
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

export default StudentList;