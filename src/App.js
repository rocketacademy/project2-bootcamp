import React, { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <header className="py-5 my-5">
        <Dashboard />
      </header>
    </div>
  );
};

export default App;
