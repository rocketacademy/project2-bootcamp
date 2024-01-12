import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import App from "./App";
// import { CourseForm } from "./pages/CourseForm";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
  // <BrowserRouter>
  //   <Link to="/courseform">Create Course</Link>
  //   <Routes>
  // <Route path="/" element={<App />} />
  // {/* <Route path="/courseform" element={<CourseForm />} /> */}
  //   </Routes>
  // </BrowserRouter>
);
