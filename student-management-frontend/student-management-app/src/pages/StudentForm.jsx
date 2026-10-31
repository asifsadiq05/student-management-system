import { useState, useEffect, useNavigate } from "react";
import { useParams } from "react-router-dom";

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    enrollment_number: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    address: "",
  });
  const [title, setTitle] = useState(id ? "Edit Student" : "Add Student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize form with existing data
  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/students/${id}/`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name,
            email: data.email,
            enrollment_number: data.enrollment_number,
            date_of_birth: data.date_of_birth || "",
            gender: data.gender || "",
            phone: data.phone || "",
            address: data.address || "",
          });
          setTitle("Edit Student");
        })
        .catch((err) => console.error("Error fetching student:", err));
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
      const url = id ? `http://127.0.0.1:8000/students/${id}/` : "http://127.0.0.1:8000/students/";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.id) {
        setSuccess(id ? "Student updated successfully!" : "Student added successfully!");
        setTimeout(() => {
          setSuccess("");
          navigate("/students");
        }, 2000);
      } else {
        setError(data.detail || "Something went wrong");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    }
  };

  return (
    <div className="student-form">
      <div className="form-card">
        <h2>{title}</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Enrollment Number</label>
            <input
              type="text"
              name="enrollment_number"
              value={formData.enrollment_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" className="btn-primary">
            {id ? "Update Student" : "Add Student"}
          </button>
          <Link to="/students" style={{ marginLeft: "10px", textDecoration: "none" }}>
            <button style={{ marginLeft: "10px" }}>Cancel</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;