import React from "react";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import Accountsummary from "../components/Accountsummary";
import Performance from "../components/Performance";
import Educationalmaterial from "../components/Educationalmaterial"

const Dashboard = () => {
  return (
    <>
      <Searchbar />
      <Accountsummary />
      <Performance />
      <h3>

      Educational Material
      </h3>
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      {/* <p>
            Edit <code>src/App.js</code> and save to reload.
          </p> */}
      {/* <Educationalmaterial /> */}
    </>
  );
};

export default Dashboard;
