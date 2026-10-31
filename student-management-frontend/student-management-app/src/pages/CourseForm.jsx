import { useState, useEffect, useNavigate } from "react";
import { useParams } from "react-router-dom";

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    credits: "",
  });
  const [title, setTitle] = useState(id ? "Edit Course" : "Add Course");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize form with existing data
  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/courses/${id}/`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name,
            code: data.code,
            description: data.description || "",
            credits: data.credits || "",
          });
          setTitle("Edit Course");
        })
        .catch((err) => console.error("Error fetching course:", err));
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
      const url = id ? `http://127.0.0.1:8000/courses/${id}/` : "http://127.0.0.1:8000/courses/";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.id) {
        setSuccess(id ? "Course updated successfully!" : "Course added successfully!");
        setTimeout(() => {
          setSuccess("");
          navigate("/courses");
        }, 2000);
      } else {
        setError(data.detail || "Something went wrong");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    }
  };

  return (
    <div className="course-form">
      <div className="form-card">
        <h2>{title}</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Course Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Credits</label>
            <input
              type="number"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn-primary">
            {id ? "Update Course" : "Add Course"}
          </button>
          <Link to="/courses" style={{ marginLeft: "10px", textDecoration: "none" }}>
            <button style={{ marginLeft: "10px" }}>Cancel</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;