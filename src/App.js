import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./Components/NavBar";
import Map from "./Components/Map";
import List from "./Components/List";

class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <div className="App">
          <Map />
          <List />
        </div>
      </div>
    );
  }
}

export default App;
