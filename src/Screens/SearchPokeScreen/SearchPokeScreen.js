import React from "react";
import "./SearchPokeScreen.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPlus,
  faStar,
  faMagnifyingGlass,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const SearchPokeScreen = () => {
  return (
    <div className="pokeSearch">
      <button className="back">
        <FontAwesomeIcon icon={faChevronLeft} size="2xl" />
      </button>

      <h1 className="addPoke">Add Pokemon</h1>
      <div>
        <div className="flex-container">
          <div className="flex-item">
            <input
              type="text"
              placeholder="enter pokemon name"
              className="pokeSearchBox"
            ></input>
          </div>
          <div className="flex-item">
            <button type="submit" className="pokeSearchIcon">
              <FontAwesomeIcon icon={faMagnifyingGlass} />{" "}
            </button>
          </div>
        </div>

        <br />

        <div>
          <div className="flex-container">
            <div className="flex-item results">results</div>
            <div className="flex-item plus">
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div className="flex-item star">
              <FontAwesomeIcon icon={faStar} />
            </div>
          </div>
          <div className="flex-container">
            <div className="flex-item results">results</div>
            <div className="flex-item plus">
              <FontAwesomeIcon icon={faPlus} />
            </div>
            <div className="flex-item star">
              <FontAwesomeIcon icon={faStar} />
            </div>
          </div>
        </div>

        <br />
      </div>
    </div>
  );
};
export default SearchPokeScreen;
