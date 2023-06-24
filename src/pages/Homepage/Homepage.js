import React from "react";
import "./Homepage.css";
import Trending from "../../components/Trending";
import SearchPage from "../SearchPage";

const Homepage = () => {
  return (
    <div>
      <Trending />

      <SearchPage />
    </div>
  );
};

export default Homepage;
