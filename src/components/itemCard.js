import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CoordinatesContext } from "../Provider/CoordinatesProvider";
//import { UserContext } from "../App";

const ItemCard = ({ name, overview, photoURL, lat, lng, place_id }) => {
  const { gemRedirectDetails, setGemRedirectDetails } = useContext(CoordinatesContext);
  const navigate = useNavigate();

  const handleItemClick = (lat, lng, place_id) => {
    let zoom = 13;
    let m_lat = lat - 0.03;

    if (setGemRedirectDetails !== undefined) {
      setGemRedirectDetails({
        coordinates: { lat: m_lat, lng: lng },
        zoom: zoom,
        place_id: place_id,
      });
    }
  };

  useEffect(() => {
    if (gemRedirectDetails !== undefined) {
      if (Object.keys(gemRedirectDetails).length > 0) {
        navigate("/Explore");
      }
    }
  }, [gemRedirectDetails]);

  return (
    <>
      <button
        className="card bg-base-100 shadow-xl"
        onClick={() => handleItemClick(lat, lng, place_id)}
      >
        <div className="p-7 card-body flex flex-row justify-center text-left content-center gap-4">
          <img
            src={photoURL}
            alt="keyPhoto"
            className=" w-20 h-20 rounded-lg"
          />
          <div>
            <h2 className="card-title text-base">{name}</h2>
            <p className="text-xs">{overview}</p>
          </div>
        </div>
      </button>
      <br />
    </>
  );
};

export default ItemCard;
