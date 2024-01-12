import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Teacher from "./pages/Teacher";
import Resources from "./pages/Resources";
import { CourseForm } from "./pages/CourseForm";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="teacher" element={<Teacher />} />
            <Route path="teacher/resources" element={<Resources />} />
            <Route
              path="teacher/resources/courseform"
              element={<CourseForm />}
            />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
};

export default App;
