import { useState, useEffect, useNavigate } from "react";
import { useParams } from "react-router-dom";

const AttendanceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_id: "",
    course_id: "",
    date: "",
    status: "present",
  });
  const [title, setTitle] = useState(id ? "Edit Attendance" : "Mark Attendance");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize form with existing data
  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/attendance/${id}/`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            student_id: data.student_id,
            course_id: data.course_id,
            date: data.date,
            status: data.status,
          });
          setTitle("Edit Attendance");
        })
        .catch((err) => console.error("Error fetching attendance:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `http://127.0.0.1:8000/attendance/${id}/` : "http://127.0.0.1:8000/attendance/";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.id) {
        setSuccess(id ? "Attendance updated successfully!" : "Attendance marked successfully!");
        setTimeout(() => {
          setSuccess("");
          navigate("/attendance");
        }, 2000);
      } else {
        setError(data.detail || "Something went wrong");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    }
  };

  return (
    <div className="attendance-form">
      <div className="form-card">
        <h2>{title}</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student ID</label>
            <input
              type="number"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Course ID</label>
            <input
              type="number"
              name="course_id"
              value={formData.course_id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date (YYYY-MM-DD)</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">
            {id ? "Update Attendance" : "Mark Attendance"}
          </button>
          <Link to="/attendance" style={{ marginLeft: "10px", textDecoration: "none" }}>
            <button style={{ marginLeft: "10px" }}>Cancel</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AttendanceForm;