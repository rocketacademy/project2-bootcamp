import React from "react";
import "./Homepage.css";
import Trending from "../../components/Trending";
import SearchPage from "../SearchPage";
import Footer from "../../components/Footer";

const Homepage = () => {
  return (
    <div>
      <Trending />
      <SearchPage isHomePage={true} />
      <Footer />
    </div>
  );
};

export default Homepage;
