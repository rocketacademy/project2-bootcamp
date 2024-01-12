import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Auth from "./pages/Auth";
import Teacher from "./pages/Teacher";
import { CourseForm } from "./pages/CourseForm";
import { AttendancePublic } from "./pages/AttendancePublic";
import { StudentCourses } from "./pages/StudentCourses";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="teacher" element={<Teacher />} />
          <Route path="courseform" element={<CourseForm />} />
          <Route path="attendance" element={<AttendancePublic />} />
          <Route path="student" element={<StudentCourses />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
