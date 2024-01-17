import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Reset from "./pages/Reset";
import Teacher from "./pages/Teacher";
import Resources from "./pages/Resources";
import { CourseForm } from "./pages/CourseForm";
import "./App.css";
import { AttendancePublic } from "./pages/AttendancePublic";
import { StudentCourses } from "./pages/StudentCourses";
import { Navbar } from "./components/Navbar";
import { StudentHome } from "./pages/StudentHome";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="password-reset" element={<Reset />} />
            <Route path="teacher" element={<Teacher />} />
            <Route path="teacher/resources" element={<Resources />} />
            <Route
              path="teacher/resources/courseform"
              element={<CourseForm />}
            />
            <Route path="teacher/attendance" element={<AttendancePublic />} />
            <Route path="teacher/settings" element={<Settings />} />
            <Route path="student/settings" element={<Settings />} />
            <Route path="student" element={<StudentHome />} />
            <Route path="student/courses" element={<StudentCourses />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
};

export default App;
