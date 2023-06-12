import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Welcome from "./Components/Welcome";
import AuthForm from "./Components/AuthForm";
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
        <Route path="/authForm" element={<AuthForm />} />

        <Route path="/app" element={<App />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
