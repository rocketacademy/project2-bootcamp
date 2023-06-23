import React from "react";
import logo from "./assets/logo.png";
import "./App.css";
import defineRoutesHere from "./routes/routes";
import ResponsiveAppBar from "./components/Navbar";
import Search from "./components/SearchBar";
import SearchPage from "./pages/SearchPage";

const App = () => {
  return (
    <div className="App">
      <ResponsiveAppBar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <Search />
        <SearchPage />
        <br />
        {defineRoutesHere()}
      </header>
    </div>
  );
};

export default App;
