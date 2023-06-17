import React from "react";
import "./App.css";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";

//routes
import AdminUpload from "./components/AdminUpload";
import Home from "./components/Home";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <ResponsiveAppBar />
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route exact path="/admin" element={<AdminUpload />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
