import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [filterStudentId, setFilterStudentId] = useState("");
  const [filterCourseId, setFilterCourseId] = useState("");

  useEffect(() => {
    let url = "http://127.0.0.1:8000/attendance/";
    if (filterStudentId || filterCourseId) {
      url += "?";
      if (filterStudentId) url += `student_id=${filterStudentId}&`;
      if (filterCourseId) url += `course_id=${filterCourseId}&`;
      url = url.slice(0, -1); // remove trailing &
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setAttendances(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching attendance:", err);
        setLoading(false);
      });
  }, [navigate, filterStudentId, filterCourseId]);

  const handleDelete = async (attendanceId) => {
    if (confirm("Are you sure you want to delete this attendance record?")) {
      try {
        await fetch(`http://127.0.0.1:8000/attendance/${attendanceId}/`, {
          method: "DELETE",
        });
        setAttendances(attendances.filter((a) => a.id !== attendanceId));
      } catch (err) {
        console.error("Error deleting attendance:", err);
      }
    }
  };

  if (loading) {
    return <div>Loading attendance records...</div>;
  }

  return (
    <div className="attendance-list">
      <h2>Attendance Tracking</h2>
      
      <div className="filters">
        <div className="form-group">
          <label>Filter by Student</label>
          <select
            value={filterStudentId}
            onChange={(e) => setFilterStudentId(e.target.value)}
          >
            <option value="">All Students</option>
            <option value="1">Student 1</option>
            <option value="2">Student 2</option>
            <option value="3">Student 3</option>
          </select>
        </div>
        <div className="form-group">
          <label>Filter by Course</label>
          <select
            value={filterCourseId}
            onChange={(e) => setFilterCourseId(e.target.value)}
          >
            <option value="">All Courses</option>
            <option value="1">Course 1</option>
            <option value="2">Course 2</option>
            <option value="3">Course 3</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Course</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendances.map((attendance) => (
              <tr key={attendance.id}>
                <td>{attendance.id}</td>
                <td>{attendance.student_id}</td>
                <td>{attendance.course_id}</td>
                <td>{attendance.date}</td>
                <td>{attendance.status}</td>
                <td>
                  <Link to={`/attendance/${attendance.id}`} className="btn-edit">
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(attendance.id)}
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

export default AttendanceList;