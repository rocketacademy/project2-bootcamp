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
import { AuthProvider } from "./pages/AuthProvider";
import { Landing } from "./pages/Landing";

const TeacherRoutes = () => (
  <>
    <Routes>
      <Route path="/" element={<Teacher />} />
      <Route path="resources" element={<Resources />} />
      <Route path="resources/courseform" element={<CourseForm />} />
      <Route path="attendance" element={<AttendancePublic />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  </>
);

const StudentRoutes = () => (
  <>
    <Routes>
      <Route path="/" element={<StudentHome />} />
      <Route path="courses" element={<StudentCourses />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  </>
);

const App = () => {
  const currentUser = auth.currentUser;
  console.log(currentUser);

  return (
    <div className="App">
      <header className="App-header">
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="landing" element={<Landing />} />
              <Route path="password-reset" element={<Reset />} />
              <Route path="teacher/*" element={<TeacherRoutes />} />
              <Route path="student/*" element={<StudentRoutes />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </header>
    </div>
  );
};

export default App;
