import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
// import logo from "./logo.png";
import "./App.css";
import Auth from "./pages/Auth";
import Teacher from "./pages/Teacher";
import { CourseForm } from "./pages/CourseForm";
import { Attendance } from "./pages/Attendance";
import { AttendanceGForm } from "./pages/AttendanceGForm";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="teacher" element={<Teacher />} />
            <Route path="courseform" element={<CourseForm />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="attendanceform" element={<AttendanceGForm />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
};

export default App;
