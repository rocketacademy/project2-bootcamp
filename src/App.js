import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Teacher from "./pages/Teacher";
import Resources from "./pages/resources";
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
            <Route path="courseform" element={<CourseForm />} />
            <Route path="resources" element={<Resources />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
};

export default App;
