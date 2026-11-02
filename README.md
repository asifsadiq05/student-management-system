# Student Management System - CSE Portfolio Project

## 📚 Project Overview
A complete **Student Management System** built with **React + FastAPI + PostgreSQL** - perfect for CSE job applications in Dhaka, Bangladesh.

This project demonstrates full-stack development skills including modern web development, database management, and API creation.

## 🌐 Live Demo & Access

### Backend (FastAPI)
- **URL**: `http://127.0.0.1:8000`
- **Documentation**: `http://127.0.0.1:8000/docs` (Auto-generated Swagger UI)

### Frontend (React)
- **URL**: `http://localhost:5173`

## 📁 Project Structure

```
I:\Student Management System\
├── student-management-backend/     # FastAPI Python Backend
│   ├── main.py                     # Complete API with auth, CRUD routes
│   ├── database.py                 # PostgreSQL configuration
│   ├── models.py                   # SQLAlchemy ORM models
│   ├── requirements.txt            # Python dependencies
│   └── .env                        # Environment variables
│
└── student-management-frontend/    # React + Vite Frontend
    └── student-management-app/     # Vite React application
        ├── src/
        │   ├── App.jsx             # Main routing with auth guard
        │   ├── App.css             # Custom styling
        │   ├── main.jsx            # Entry point
        │   └── vite.config.js      # API proxy config
        ├── package.json            # npm dependencies
        └── README.md               # Frontend documentation
```

## ⚙️ Features

### Backend Features (FastAPI + PostgreSQL)
- ✅ **User Authentication**: Registration & login with JWT tokens
- ✅ **Student Management**: Add, view, update, delete students
- ✅ **Course Management**: Create and manage courses
- ✅ **Attendance Tracking**: Mark attendance with present/absent/late status
- ✅ **Attendance Statistics**: View attendance rates and totals
- ✅ **Password Hashing**: Secure bcrypt password protection
- ✅ **CORS Enabled**: Configured for React development server
- ✅ **PostgreSQL Database**: Relational database with proper schemas

### Frontend Features (React + Vite)
- ✅ **Login Page**: Secure authentication flow
- ✅ **Register Page**: New user creation
- ✅ **Student List**: View all students with delete functionality
- ✅ **Student Form**: Add new students or edit existing ones
- ✅ **Course List**: Manage courses with CRUD operations
- ✅ **Attendance List**: View attendance records with filtering
- ✅ **Attendance Form**: Mark attendance for students
- ✅ **Admin Dashboard**: Overview of system statistics
- ✅ **Responsive Design**: Works on mobile and desktop devices
- ✅ **API Integration**: Connected to FastAPI backend

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL database

### 1. Backend Setup

```bash
# Navigate to backend
cd "I:\Student Management System\student-management-backend"

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your PostgreSQL configuration

# Run the backend
uvicorn main:app --reload --port 8000
```

**Backend will be available at**: `http://127.0.0.1:8000`

### 2. Frontend Setup

```bash
# Navigate to frontend
cd "I:\Student Management System\student-management-frontend\student-management-app"

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will be available at**: `http://localhost:5173`

### 3. Database Setup

Make sure PostgreSQL is running and create the database:

```bash
# Create database (or update DATABASE_URL in .env)
createdb student_management
# OR update the DATABASE_URL in .env file
```

## 🔧 API Endpoints

### Authentication
- `POST /register/` - Register a new user
- `POST /token/` - Login and get JWT token
- `GET /users/me/` - Get current user info

### Students
- `GET /students/` - List all students
- `POST /students/` - Create a new student
- `GET /students/{id}/` - Get student by ID
- `PUT /students/{id}/` - Update student
- `DELETE /students/{id}/` - Delete student

### Courses
- `GET /courses/` - List all courses
- `POST /courses/` - Create a new course
- `GET /courses/{id}/` - Get course by ID
- `PUT /courses/{id}/` - Update course
- `DELETE /courses/{id}/` - Delete course

### Attendance
- `GET /attendance/` - List attendance records
- `POST /attendance/` - Mark attendance
- `GET /attendance/{student_id}/{course_id}/` - Get attendance by student and course
- `GET /attendance/student/{student_id}/` - Get student attendance stats
- `GET /attendance/course/{course_id}/` - Get course attendance stats

## 🎯 Default Accounts

1. **Register a new account** via `http://localhost:5173/register`
2. **Or use the login flow** to access the system

## 🛠️ Technology Stack

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

## 📦 Installation & Setup Summary

### Quick Commands:

```bash
# 1. Start Backend
cd "I:\Student Management System\student-management-backend"
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 2. Start Frontend (in another terminal)
cd "I:\Student Management System\student-management-frontend\student-management-app"
npm install
npm run dev

# 3. Access the application
# Frontend: http://localhost:5173
# Backend API: http://127.0.0.1:8000
```

## 📸 Screenshots & Features

The application includes:
- Student registration and login interface
- Admin dashboard with statistics
- Student management (add, edit, delete)
- Course management interface
- Attendance tracking with visual statistics
- Responsive design working on all devices

## 🤝 Contributing

This project is open for improvements and educational purposes. Feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Report issues

## 📄 License


This project is licensed under the **MIT License** - see the LICENSE file for details.

## 👨‍💻 Author

Built with ❤️ for CSE job applications in Dhaka, Bangladesh.
This project demonstrates full-stack development capabilities including:
- React frontend development
- FastAPI backend development
- PostgreSQL database management
- JWT authentication
- CRUD operations
- Responsive UI/UX design

---

**Perfect for your CSE job applications! This complete project showcases modern web development skills that employers look for.**
