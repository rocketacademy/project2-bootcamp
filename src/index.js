import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Welcome from "./Components/Welcome";
import AuthForm from "./Pages/AuthForm";
import SignUp from "./Pages/SignUp";
import Profile from "./Pages/Profile";
import Dashboard from "./Pages/Dashboard";
import Error from "./Components/Error";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/welcome" element={<Welcome />} />
        <Route path="/authform" element={<AuthForm />} />

        <Route path="/app" element={<App />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
