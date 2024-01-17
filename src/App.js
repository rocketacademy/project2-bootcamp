import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Teacher from "./pages/Teacher";
import Resources from "./pages/Resources";
import { CourseForm } from "./pages/CourseForm";
import "./App.css";
import { AttendancePublic } from "./pages/AttendancePublic";
import { StudentCourses } from "./pages/StudentCourses";
import { Navbar } from "./components/Navbar";
import { StudentHome } from "./pages/StudentHome";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="teacher" element={<Teacher />} />
            {/* <Route path="student" element={<Student />} /> */}
            <Route path="teacher/resources" element={<Resources />} />
            <Route
              path="teacher/resources/courseform"
              element={<CourseForm />}
            />
            <Route path="teacher/attendance" element={<AttendancePublic />} />
            <Route path="student" element={<StudentHome />} />
            <Route path="studentcourses" element={<StudentCourses />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
};

export default App;
