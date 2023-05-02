import React from "react";
import { useState } from "react";
import "./SearchPokeScreen.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

import {
  faPlus,
  faStar,
  faMagnifyingGlass,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { get } from "firebase/database";

const SearchPokeScreen = () => {
  const [pokeName, setPokeName] = useState("")
  const [pokeData, setPokeData] = useState("")
  const handleChange = (e) => {
    setPokeName(e.target.value)
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeName}`).then((response) => {
      console.log(response.data.types[0].type.name)
      setPokeData(response.data.types[0].type.name)
    })

  }
  return (
    <div className="pokeSearch">
      <button className="back">
        <FontAwesomeIcon icon={faChevronLeft} size="2xl" />
      </button>

      <h1 className="addPoke">Add Pokemon</h1>
      <div>
        <div className="flex-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="enter pokemon name"
              className="pokeSearchBox"
              onChange={handleChange}
              value={pokeName}
            ></input>


            <button type="submit" className="pokeSearchIcon">
              <FontAwesomeIcon icon={faMagnifyingGlass} />{" "}
            </button>
          </form>
        </div>

        <br />
        {/* <h1>{pokeData}</h1> */}

        <div>
          <div className="flex-container">
            <div className="flex-item results">
              {pokeData}

            </div>
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
