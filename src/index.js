import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import App from "./App";
import { CourseForm } from "./pages/CourseForm";
import { QuizForm } from "./pages/QuizForm";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Link to="/courseform">Create Course</Link>
    <Link to="/quizform">Create Quiz</Link>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/courseform" element={<CourseForm />} />
      <Route path="/quizform" element={<QuizForm />} />
    </Routes>
  </BrowserRouter>
);
