# Student Management System

A complete Student Management System with React frontend + FastAPI backend + PostgreSQL database.

## Project Structure

```
student-management-system/
├── student-management-backend/   # FastAPI Python Backend
│   ├── main.py                   # API routes and application
│   ├── database.py               # Database configuration
│   ├── models.py                 # SQLAlchemy models
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Environment variables
│   └── schema.sql                # Database schema
│
├── student-management-frontend/  # React + Vite Frontend
│   ├── src/
│   │   ├── pages/                # Page components
│   │   │   ├── LoginPage.jsx
│ │   │   ├── RegisterPage.jsx
│ │   │   ├── AdminDashboard.jsx
│ │   │   ├── StudentList.jsx
│ │   │   ├── StudentForm.jsx
│ │   │   ├── CourseList.jsx
│ │   │   ├── CourseForm.jsx
│ │   │   ├── AttendanceList.jsx
│ │   │   └── AttendanceForm.jsx
│ │   ├── App.jsx                 # Main App with routing
│ │   ├── App.css                 # Custom styling
│ │   ├── main.jsx                # Entry point
│ │   └── vite.config.js          # Vite config with API proxy
│   ├── index.html
│   ├── package.json
│   └── ...
│
└── README.md
```

## Features

### Backend (FastAPI)
- **Student Management**: Register, view, update, delete students
- **Course Management**: Add, update, view, delete courses
- **Attendance Tracking**: Mark and view attendance with analytics
- **Authentication**: User registration and login with JWT tokens
- **PostgreSQL Database**: Relational database with proper schemas
- **CORS Enabled**: Configured for React development server

### Frontend (React)
- **Student Registration & Login**: Secure authentication flow
- **Admin Dashboard**: Overview of users, students, and courses
- **Add/Update/Delete Students**: Full CRUD operations
- **Course Management**: Create and manage courses
- **Attendance Tracking**: Mark attendance and view statistics
- **Responsive Design**: Works on mobile and desktop

## Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for APIs
- **SQLAlchemy**: ORM for database operations
- **PostgreSQL**: Primary database
- **Pydantic**: Data validation using Python type hints
- **Passlib**: Password hashing
- **python-jose**: JWT token creation
- **Uvicorn**: ASGI server

### Frontend
- **React**: UI library
- **Vite**: Fast development server and build
- **React Router**: Client-side routing
- **Axios**: API communication with backend

### Database
- **PostgreSQL**: Open source relational database

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd student-management-backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Set up PostgreSQL:
   ```bash
   # Create the database
   createdb student_management
   
   # Or update DATABASE_URL in .env
   ```

6. Run the backend:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

The backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd student-management-frontend/student-management-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### API Endpoints

#### Authentication
- `POST /register/` - Register a new user
- `POST /token/` - Login and get JWT token
- `GET /users/me/` - Get current user info

#### Students
- `GET /students/` - List all students
- `POST /students/` - Create a new student
- `GET /students/{id}/` - Get student by ID
- `PUT /students/{id}/` - Update student
- `DELETE /students/{id}/` - Delete student

#### Courses
- `GET /courses/` - List all courses
- `POST /courses/` - Create a new course
- `GET /courses/{id}/` - Get course by ID
- `PUT /courses/{id}/` - Update course
- `DELETE /courses/{id}/` - Delete course

#### Attendance
- `GET /attendance/` - List attendance records
- `POST /attendance/` - Mark attendance
- `GET /attendance/{student_id}/{course_id}/` - Get attendance by student and course
- `GET /attendance/student/{student_id}/` - Get student attendance stats
- `GET /attendance/course/{course_id}/` - Get course attendance stats

## License

This project is licensed under the MIT License.