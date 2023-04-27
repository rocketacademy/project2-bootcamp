import React from "react";
import logo from "./logo.png";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <h1>Test</h1>
          <h2>testing 123</h2>
        </header>
      </div>
    );
  }
}

export default App;
