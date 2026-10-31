from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import models
import database
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
import hashlib
import jwt
import os
from passlib.context import CryptContext

# Environment variables
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create all tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Student Management System API",
    description="Complete Student Management System with React Frontend + FastAPI Backend + PostgreSQL",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# ===== PYDANTIC MODELS =====

class Student(BaseModel):
    id: int
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=5, max_length=100)
    enrollment_number: str = Field(min_length=1, max_length=50, unique=True)
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime

    class Config:
        from_orm = True

class StudentCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=5, max_length=100)
    enrollment_number: str = Field(min_length=1, max_length=50, unique=True)
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class StudentUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    email: Optional[str] = Field(default=None, min_length=5, max_length=100)
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class Course(BaseModel):
    id: int
    name: str = Field(min_length=1, max_length=100)
    code: str = Field(min_length=3, max_length=20, unique=True)
    description: Optional[str] = None
    credits: Optional[int] = None
    created_at: datetime

    class Config:
        from_orm = True

class CourseCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    code: str = Field(min_length=3, max_length=20, unique=True)
    description: Optional[str] = None
    credits: Optional[int] = None

class CourseUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None)
    credits: Optional[int] = Field(default=None)

class Attendance(BaseModel):
    id: int
    student_id: int
    course_id: int
    date: str
    status: str  # "present", "absent", "late"
    marked_at: datetime

    class Config:
        from_orm = True

class AttendanceCreate(BaseModel):
    student_id: int
    course_id: int
    date: str
    status: str = "present"

class User(BaseModel):
    id: int
    email: str
    is_active: bool = True
    is_superuser: bool = False
    full_name: Optional[str] = None

# ===== DATABASE DEPENDENCY =====

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===== AUTHENTICATION FUNCTIONS =====

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow()() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# ===== ROUTES =====

@app.get("/")
async def root():
    return {"message": "Student Management System API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    db = database.SessionLocal()
    try:
        student_count = db.query(models.Student).count()
        course_count = db.query(models.Course).count()
        attendance_count = db.query(models.Attendance).count()
        return {"status": "healthy", "students": student_count, "courses": course_count, "attendance_records": attendance_count}
    finally:
        db.close()

# ===== AUTH ROUTES =====

@app.post("/register/", response_model=User)
async def register(user_email: str, user_password: str, full_name: str = None, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_password)
    db_user = models.User(
        email=user_email,
        full_name=full_name,
        hashed_password=hashed_password,
        is_superuser=False,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_email}, expires_delta=access_token_expires
    )
    
    return {"id": db_user.id, "email": db_user.email, "full_name": db_user.full_name, "is_active": db_user.is_active, "is_superuser": db_user.is_superuser}

@app.post("/token/", response_model=dict)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "full_name": user.full_name, "is_active": user.is_active, "is_superuser": user.is_superuser}}

@app.get("/users/me/", response_model=User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# ===== STUDENT ROUTES (with authentication) =====

@app.post("/students/", response_model=Student)
async def create_student(student: StudentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Check if enrollment number already exists
    existing_student = db.query(models.Student).filter(models.Student.enrollment_number == student.enrollment_number).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Enrollment number already registered")
    
    db_student = models.Student(
        name=student.name,
        email=student.email,
        enrollment_number=student.enrollment_number,
        date_of_birth=student.date_of_birth,
        gender=student.gender,
        phone=student.phone,
        address=student.address,
        user_id=current_user.id  # Assign as advised by current user
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@app.get("/students/", response_model=List[Student])
async def get_students(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    students = db.query(models.Student).offset(skip).limit(limit).all()
    return students

@app.get("/students/{student_id}", response_model=Student)
async def get_student(student_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.put("/students/{student_id}", response_model=Student)
async def update_student(student_id: int, student: StudentUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    update_data = student.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_student, key, value)
    
    db.commit()
    db.refresh(db_student)
    return db_student

@app.delete("/students/{student_id}")
async def delete_student(student_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(db_student)
    db.commit()
    return {"message": "Student deleted successfully"}

# ===== COURSE ROUTES =====

@app.post("/courses/", response_model=Course)
async def create_course(course: CourseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    existing_course = db.query(models.Course).filter(models.Course.code == course.code).first()
    if existing_course:
        raise HTTPException(status_code=400, detail="Course code already exists")
    
    db_course = models.Course(
        name=course.name,
        code=course.code,
        description=course.description,
        credits=course.credits,
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.get("/courses/", response_model=List[Course])
async def get_courses(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    courses = db.query(models.Course).offset(skip).limit(limit).all()
    return courses

@app.get("/courses/{course_id}", response_model=Course)
async def get_course(course_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.put("/courses/{course_id}", response_model=Course)
async def update_course(course_id: int, course: CourseUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    update_data = course.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_course, key, value)
    
    db.commit()
    db.refresh(db_course)
    return db_course

@app.delete("/courses/{course_id}")
async def delete_course(course_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(db_course)
    db.commit()
    return {"message": "Course deleted successfully"}

# ===== ATTENDANCE ROUTES =====

@app.post("/attendance/", response_model=Attendance)
async def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Check if student exists
    student = db.query(models.Student).filter(models.Student.id == attendance.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Check if course exists
    course = db.query(models.Course).filter(models.Course.id == attendance.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if attendance already marked for this student-course-date combination
    existing_attendance = db.query(models.Attendance).filter(
        models.Attendance.student_id == attendance.student_id,
        models.Attendance.course_id == attendance.course_id,
        models.Attendance.date == attendance.date
    ).first()
    
    if existing_attendance:
        raise HTTPException(status_code=400, detail="Attendance already marked for this student, course, and date")
    
    db_attendance = models.Attendance(
        student_id=attendance.student_id,
        course_id=attendance.course_id,
        date=attendance.date,
        status=attendance.status,
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

@app.get("/attendance/{student_id}/{course_id}")
async def get_attendance(
    student_id: int, 
    course_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    attendance_records = db.query(models.Attendance).filter(
        models.Attendance.student_id == student_id,
        models.Attendance.course_id == course_id
    ).all()
    return attendance_records

@app.get("/attendance/student/{student_id}")
async def get_student_attendance(
    student_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    attendance_records = db.query(models.Attendance).filter(models.Attendance.student_id == student_id).all()
    total = len(attendance_records)
    present = len([a for a in attendance_records if a.status == "present"])
    absent = len([a for a in attendance_records if a.status == "absent"])
    late = len([a for a in attendance_records if a.status == "late"])
    
    attendance_rate = (present / total * 100) if total > 0 else 0
    
    return {
        "student_id": student_id,
        "total_sessions": total,
        "present": present,
        "absent": absent,
        "late": late,
        "attendance_rate": round(attendance_rate, 2)
    }

@app.get("/attendance/course/{course_id}")
async def get_course_attendance(
    course_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    attendance_records = db.query(models.Attendance).filter(models.Attendance.course_id == course_id).all()
    total = len(attendance_records)
    present = len([a for a in attendance_records if a.status == "present"])
    absent = len([a for a in attendance_records if a.status == "absent"])
    late = len([a for a in attendance_records if a.status == "late"])
    
    attendance_rate = (present / total * 100) if total > 0 else 0
    
    return {
        "course_id": course_id,
        "total_sessions": total,
        "present": present,
        "absent": absent,
        "late": late,
        "attendance_rate": round(attendance_rate, 2)
    }