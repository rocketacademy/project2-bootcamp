import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Header from "../components/header.js";
import Footer from "../components/footer.js";

import { database } from "../firebase.js";
import { UserContext } from "../App.js";
import { CoordinatesContext } from "../Provider/CoordinatesProvider";

import {
  ref,
  set,
  push,
  onChildAdded,
  onChildRemoved,
  onValue,
} from "firebase/database";

/////////// DECALRE FIREBASE LIST NAME HERE ///////////
/////////// e.g. const DB_POSTS_KEY = "posts"; ///////////

const Search = (props) => {
  const { districtDetails, setDistrictDetails } = useContext(CoordinatesContext);
  const navigate = useNavigate();

  /////////// DECALRE STATES HERE ///////////

  const districtDetailsObj = {
    island_district: {
      coordinates: {lat: 22.352181810708526, lng: 114.07757756696068},
      zoom: 11
    },
    sai_kung_district: {
      coordinates: {lat: 22.443637248473642, lng: 114.33904456639596},
      zoom: 11
    },
    north_district: {
      coordinates: {lat: 22.467215840494227, lng: 114.18503382542785},
      zoom: 12
    },
  }

  const onButtonClick = (e) => {
    const { name } = e.target;
    // Set the the "coordinates" and "zoom" back to App.js or a new context
    if (setDistrictDetails !== undefined) {
      setDistrictDetails({
        coordinates: districtDetailsObj[name].coordinates,
        zoom: districtDetailsObj[name].zoom,
      });
    }
  }

  useEffect(() => {
    if (districtDetails !== undefined ){
      if (Object.keys(districtDetails).length > 0){
        navigate("/Explore");
      }
    }
  }, [districtDetails]);

  //Equivalent to "componentDidMount()"
  useEffect(() => {
  }, []);

  return (
    <div className="App">
      <Header />
      <div
        className="flex flex-col h-screen justify-center text-center content-center overflow-auto gap-6 p-14"
        style={{ height: "calc(100% - 64px)" }}
      >
        <h1 className="font-sans text-2xl font-bold">
          Select a District
        </h1>
        <div className="flex flex-col justify-center text-center content-center gap-4">
          <button
            name="island_district"
            className="btn"
            onClick={(e) => onButtonClick(e)}
          >
            Island District
          </button>
          <button
          name="sai_kung_district"
            className="btn"
            onClick={(e) => onButtonClick(e)}
          >
            Sai Kung District
          </button>
          <button
            name="north_district"
            className="btn"
            onClick={(e) => onButtonClick(e)}
          >
            North District
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Search;
