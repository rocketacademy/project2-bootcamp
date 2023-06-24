import React from "react";
import "./Homepage.css";
import Trending from "../../components/Trending";
import Search from "../../components/SearchBar";
import SearchPage from "../SearchPage";

const Homepage = () => {
  return (
    <div>
      <Trending />
      <Search />
      <SearchPage/>
    </div>
  );
};

export default Homepage;
