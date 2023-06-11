import React from "react";
import logo from "./assets/logo.png";
import "./App.css";
import defineRoutesHere from "./routes/routes";
import ResponsiveAppBar from "./components/Navbar";

const App = () => {
  return (
    <div className="App">
      <ResponsiveAppBar/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <br/>
        {defineRoutesHere()}
      </header>
    </div>
  );
};

export default App;
