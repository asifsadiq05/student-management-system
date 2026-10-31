from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, func, ForeignKeyConstraint
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    students = relationship("Student", foreign_keys="Student.user_id", back_populates="teacher")


class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    enrollment_number = Column(String(50), unique=True, nullable=False)
    date_of_birth = Column(String(50), nullable=True)
    gender = Column(String(20), nullable=True)
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    # Foreign key to teacher/advisor
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    teacher = relationship("User", foreign_keys=[user_id], back_populates="students")
    attendances = relationship("Attendance", back_populates="student")


class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    credits = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    attendances = relationship("Attendance", back_populates="course")


class Attendance(Base):
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    course_id = Column(Integer, nullable=False)
    date = Column(String(50), nullable=False)  # YYYY-MM-DD format
    status = Column(String(20), nullable=False)  # present, absent, late
    marked_at = Column(DateTime, default=func.now())
    
    # Foreign keys
    __table_args__ = (
        ForeignKeyConstraint([student_id], [Student.id], ondelete="CASCADE"),
        ForeignKeyConstraint([course_id], [Course.id], ondelete="CASCADE"),
    )
    
    # Relationships
    student = relationship("Student", back_populates="attendances")
    course = relationship("Course", back_populates="attendances")