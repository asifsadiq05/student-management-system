import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

// Login Page
import LoginPage from "./pages/LoginPage";
// Register Page
import RegisterPage from "./pages/RegisterPage";
// Admin Dashboard
import AdminDashboard from "./pages/AdminDashboard";
// Student Management
import StudentList from "./pages/StudentList";
import StudentForm from "./pages/StudentForm";
// Course Management
import CourseList from "./pages/CourseList";
import CourseForm from "./pages/CourseForm";
// Attendance Tracking
import AttendanceList from "./pages/AttendanceList";
import AttendanceForm from "./pages/AttendanceForm";

// Main App Component
const App = () => {
  const navigate = useNavigate();

  // Check if user is logged in (simulated - in production, check localStorage/token)
  const isLoggedIn = localStorage.getItem("access_token");

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          {isLoggedIn ? (
            <>
              <Link to="/" className="navbar-link">Home</Link>
              <Link to="/students" className="navbar-link">Students</Link>
              <Link to="/courses" className="navbar-link">Courses</Link>
              <Link to="/attendance" className="navbar-link">Attendance</Link>
              <Link to="/dashboard" className="navbar-link">Admin Dashboard</Link>
              <button
                onClick={() => localStorage.removeItem("access_token")}
                className="navbar-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </nav>
        <div className="container">
          <Routes>
            {isLoggedIn ? (
              <>
                <Route path="/" element={<div><h2>Welcome to Student Management System</h2></div>} />
                <Route path="/students" element={<StudentList />} />
                <Route path="/students/add" element={<StudentForm />} />
                <Route path="/students/:id" element={<StudentForm />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/add" element={<CourseForm />} />
                <Route path="/courses/:id" element={<CourseForm />} />
                <Route path="/attendance" element={<AttendanceList />} />
                <Route path="/attendance/add" element={<AttendanceForm />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<LoginPage navigate={navigate} />} />
                <Route path="/register" element={<RegisterPage navigate={navigate} />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;