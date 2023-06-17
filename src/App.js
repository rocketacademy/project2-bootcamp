import React from "react";
import logo from "./logo.png";
import "./App.css";
import ImageTile from "./components/ImageTile";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import SearchBar from "./components/SearchBar";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <ResponsiveAppBar/>
        <div>
        <SearchBar/>
        </div>  
        <header className="App-header">
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <div className="Gallery-img">
        <ImageTile/>
        </div>
        
        </header>
        
      </div>
    );
  }
}

export default App;
