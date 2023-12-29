import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import App from "./App";
import { CourseForm } from "./pages/CourseForm";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Link to="/courseform">Create Course</Link>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/courseform" element={<CourseForm />} />
    </Routes>
  </BrowserRouter>
);
