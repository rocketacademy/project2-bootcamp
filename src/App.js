import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Teacher from "./pages/Teacher";
import Resources from "./pages/Resources";
import { CourseForm } from "./pages/CourseForm";

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
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
};

export default App;
