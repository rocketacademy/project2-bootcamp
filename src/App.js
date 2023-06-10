import React from "react";
import "./App.css";
import Map from "./Components/Map";
import NavBar from "./Components/NavBar";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        Welcome to Dollar Direction! <br />
        Now you will always know 'where'd your money go'!
        <Map />
      </div>
    );
  }
}

export default App;
